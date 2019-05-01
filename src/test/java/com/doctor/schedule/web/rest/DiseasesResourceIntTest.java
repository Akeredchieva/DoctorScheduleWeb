package com.doctor.schedule.web.rest;

import com.doctor.schedule.DoctorScheduleApp;

import com.doctor.schedule.domain.Diseases;
import com.doctor.schedule.repository.DiseasesRepository;
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
 * Test class for the DiseasesResource REST controller.
 *
 * @see DiseasesResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DoctorScheduleApp.class)
public class DiseasesResourceIntTest {

    private static final String DEFAULT_DISEASE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_DISEASE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private DiseasesRepository diseasesRepository;

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

    private MockMvc restDiseasesMockMvc;

    private Diseases diseases;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DiseasesResource diseasesResource = new DiseasesResource(diseasesRepository);
        this.restDiseasesMockMvc = MockMvcBuilders.standaloneSetup(diseasesResource)
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
    public static Diseases createEntity(EntityManager em) {
        Diseases diseases = new Diseases()
            .diseaseName(DEFAULT_DISEASE_NAME)
            .description(DEFAULT_DESCRIPTION);
        return diseases;
    }

    @Before
    public void initTest() {
        diseases = createEntity(em);
    }

    @Test
    @Transactional
    public void createDiseases() throws Exception {
        int databaseSizeBeforeCreate = diseasesRepository.findAll().size();

        // Create the Diseases
        restDiseasesMockMvc.perform(post("/api/diseases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(diseases)))
            .andExpect(status().isCreated());

        // Validate the Diseases in the database
        List<Diseases> diseasesList = diseasesRepository.findAll();
        assertThat(diseasesList).hasSize(databaseSizeBeforeCreate + 1);
        Diseases testDiseases = diseasesList.get(diseasesList.size() - 1);
        assertThat(testDiseases.getDiseaseName()).isEqualTo(DEFAULT_DISEASE_NAME);
        assertThat(testDiseases.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createDiseasesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = diseasesRepository.findAll().size();

        // Create the Diseases with an existing ID
        diseases.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDiseasesMockMvc.perform(post("/api/diseases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(diseases)))
            .andExpect(status().isBadRequest());

        // Validate the Diseases in the database
        List<Diseases> diseasesList = diseasesRepository.findAll();
        assertThat(diseasesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllDiseases() throws Exception {
        // Initialize the database
        diseasesRepository.saveAndFlush(diseases);

        // Get all the diseasesList
        restDiseasesMockMvc.perform(get("/api/diseases?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(diseases.getId().intValue())))
            .andExpect(jsonPath("$.[*].diseaseName").value(hasItem(DEFAULT_DISEASE_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getDiseases() throws Exception {
        // Initialize the database
        diseasesRepository.saveAndFlush(diseases);

        // Get the diseases
        restDiseasesMockMvc.perform(get("/api/diseases/{id}", diseases.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(diseases.getId().intValue()))
            .andExpect(jsonPath("$.diseaseName").value(DEFAULT_DISEASE_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDiseases() throws Exception {
        // Get the diseases
        restDiseasesMockMvc.perform(get("/api/diseases/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDiseases() throws Exception {
        // Initialize the database
        diseasesRepository.saveAndFlush(diseases);

        int databaseSizeBeforeUpdate = diseasesRepository.findAll().size();

        // Update the diseases
        Diseases updatedDiseases = diseasesRepository.findById(diseases.getId()).get();
        // Disconnect from session so that the updates on updatedDiseases are not directly saved in db
        em.detach(updatedDiseases);
        updatedDiseases
            .diseaseName(UPDATED_DISEASE_NAME)
            .description(UPDATED_DESCRIPTION);

        restDiseasesMockMvc.perform(put("/api/diseases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDiseases)))
            .andExpect(status().isOk());

        // Validate the Diseases in the database
        List<Diseases> diseasesList = diseasesRepository.findAll();
        assertThat(diseasesList).hasSize(databaseSizeBeforeUpdate);
        Diseases testDiseases = diseasesList.get(diseasesList.size() - 1);
        assertThat(testDiseases.getDiseaseName()).isEqualTo(UPDATED_DISEASE_NAME);
        assertThat(testDiseases.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingDiseases() throws Exception {
        int databaseSizeBeforeUpdate = diseasesRepository.findAll().size();

        // Create the Diseases

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiseasesMockMvc.perform(put("/api/diseases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(diseases)))
            .andExpect(status().isBadRequest());

        // Validate the Diseases in the database
        List<Diseases> diseasesList = diseasesRepository.findAll();
        assertThat(diseasesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDiseases() throws Exception {
        // Initialize the database
        diseasesRepository.saveAndFlush(diseases);

        int databaseSizeBeforeDelete = diseasesRepository.findAll().size();

        // Delete the diseases
        restDiseasesMockMvc.perform(delete("/api/diseases/{id}", diseases.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Diseases> diseasesList = diseasesRepository.findAll();
        assertThat(diseasesList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Diseases.class);
        Diseases diseases1 = new Diseases();
        diseases1.setId(1L);
        Diseases diseases2 = new Diseases();
        diseases2.setId(diseases1.getId());
        assertThat(diseases1).isEqualTo(diseases2);
        diseases2.setId(2L);
        assertThat(diseases1).isNotEqualTo(diseases2);
        diseases1.setId(null);
        assertThat(diseases1).isNotEqualTo(diseases2);
    }
}
