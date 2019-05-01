package com.doctor.schedule.web.rest;

import com.doctor.schedule.DoctorScheduleApp;

import com.doctor.schedule.domain.Medicines;
import com.doctor.schedule.repository.MedicinesRepository;
import com.doctor.schedule.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;


import static com.doctor.schedule.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the MedicinesResource REST controller.
 *
 * @see MedicinesResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DoctorScheduleApp.class)
public class MedicinesResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private MedicinesRepository medicinesRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restMedicinesMockMvc;

    private Medicines medicines;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MedicinesResource medicinesResource = new MedicinesResource(medicinesRepository);
        this.restMedicinesMockMvc = MockMvcBuilders.standaloneSetup(medicinesResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Medicines createEntity(EntityManager em) {
        Medicines medicines = new Medicines()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION);
        return medicines;
    }

    @Before
    public void initTest() {
        medicines = createEntity(em);
    }

    @Test
    @Transactional
    public void createMedicines() throws Exception {
        int databaseSizeBeforeCreate = medicinesRepository.findAll().size();

        // Create the Medicines
        restMedicinesMockMvc.perform(post("/api/medicines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(medicines)))
            .andExpect(status().isCreated());

        // Validate the Medicines in the database
        List<Medicines> medicinesList = medicinesRepository.findAll();
        assertThat(medicinesList).hasSize(databaseSizeBeforeCreate + 1);
        Medicines testMedicines = medicinesList.get(medicinesList.size() - 1);
        assertThat(testMedicines.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMedicines.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createMedicinesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = medicinesRepository.findAll().size();

        // Create the Medicines with an existing ID
        medicines.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMedicinesMockMvc.perform(post("/api/medicines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(medicines)))
            .andExpect(status().isBadRequest());

        // Validate the Medicines in the database
        List<Medicines> medicinesList = medicinesRepository.findAll();
        assertThat(medicinesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMedicines() throws Exception {
        // Initialize the database
        medicinesRepository.saveAndFlush(medicines);

        // Get all the medicinesList
        restMedicinesMockMvc.perform(get("/api/medicines?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(medicines.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getMedicines() throws Exception {
        // Initialize the database
        medicinesRepository.saveAndFlush(medicines);

        // Get the medicines
        restMedicinesMockMvc.perform(get("/api/medicines/{id}", medicines.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(medicines.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMedicines() throws Exception {
        // Get the medicines
        restMedicinesMockMvc.perform(get("/api/medicines/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMedicines() throws Exception {
        // Initialize the database
        medicinesRepository.saveAndFlush(medicines);

        int databaseSizeBeforeUpdate = medicinesRepository.findAll().size();

        // Update the medicines
        Medicines updatedMedicines = medicinesRepository.findById(medicines.getId()).get();
        // Disconnect from session so that the updates on updatedMedicines are not directly saved in db
        em.detach(updatedMedicines);
        updatedMedicines
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION);

        restMedicinesMockMvc.perform(put("/api/medicines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMedicines)))
            .andExpect(status().isOk());

        // Validate the Medicines in the database
        List<Medicines> medicinesList = medicinesRepository.findAll();
        assertThat(medicinesList).hasSize(databaseSizeBeforeUpdate);
        Medicines testMedicines = medicinesList.get(medicinesList.size() - 1);
        assertThat(testMedicines.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMedicines.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingMedicines() throws Exception {
        int databaseSizeBeforeUpdate = medicinesRepository.findAll().size();

        // Create the Medicines

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedicinesMockMvc.perform(put("/api/medicines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(medicines)))
            .andExpect(status().isBadRequest());

        // Validate the Medicines in the database
        List<Medicines> medicinesList = medicinesRepository.findAll();
        assertThat(medicinesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMedicines() throws Exception {
        // Initialize the database
        medicinesRepository.saveAndFlush(medicines);

        int databaseSizeBeforeDelete = medicinesRepository.findAll().size();

        // Delete the medicines
        restMedicinesMockMvc.perform(delete("/api/medicines/{id}", medicines.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Medicines> medicinesList = medicinesRepository.findAll();
        assertThat(medicinesList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Medicines.class);
        Medicines medicines1 = new Medicines();
        medicines1.setId(1L);
        Medicines medicines2 = new Medicines();
        medicines2.setId(medicines1.getId());
        assertThat(medicines1).isEqualTo(medicines2);
        medicines2.setId(2L);
        assertThat(medicines1).isNotEqualTo(medicines2);
        medicines1.setId(null);
        assertThat(medicines1).isNotEqualTo(medicines2);
    }
}
