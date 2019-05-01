package com.doctor.schedule.web.rest;

import com.doctor.schedule.DoctorScheduleApp;

import com.doctor.schedule.domain.PatientsDiseases;
import com.doctor.schedule.repository.PatientsDiseasesRepository;
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
 * Test class for the PatientsDiseasesResource REST controller.
 *
 * @see PatientsDiseasesResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DoctorScheduleApp.class)
public class PatientsDiseasesResourceIntTest {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private PatientsDiseasesRepository patientsDiseasesRepository;

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

    private MockMvc restPatientsDiseasesMockMvc;

    private PatientsDiseases patientsDiseases;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PatientsDiseasesResource patientsDiseasesResource = new PatientsDiseasesResource(patientsDiseasesRepository);
        this.restPatientsDiseasesMockMvc = MockMvcBuilders.standaloneSetup(patientsDiseasesResource)
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
    public static PatientsDiseases createEntity(EntityManager em) {
        PatientsDiseases patientsDiseases = new PatientsDiseases()
            .description(DEFAULT_DESCRIPTION);
        return patientsDiseases;
    }

    @Before
    public void initTest() {
        patientsDiseases = createEntity(em);
    }

    @Test
    @Transactional
    public void createPatientsDiseases() throws Exception {
        int databaseSizeBeforeCreate = patientsDiseasesRepository.findAll().size();

        // Create the PatientsDiseases
        restPatientsDiseasesMockMvc.perform(post("/api/patients-diseases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(patientsDiseases)))
            .andExpect(status().isCreated());

        // Validate the PatientsDiseases in the database
        List<PatientsDiseases> patientsDiseasesList = patientsDiseasesRepository.findAll();
        assertThat(patientsDiseasesList).hasSize(databaseSizeBeforeCreate + 1);
        PatientsDiseases testPatientsDiseases = patientsDiseasesList.get(patientsDiseasesList.size() - 1);
        assertThat(testPatientsDiseases.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createPatientsDiseasesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = patientsDiseasesRepository.findAll().size();

        // Create the PatientsDiseases with an existing ID
        patientsDiseases.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPatientsDiseasesMockMvc.perform(post("/api/patients-diseases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(patientsDiseases)))
            .andExpect(status().isBadRequest());

        // Validate the PatientsDiseases in the database
        List<PatientsDiseases> patientsDiseasesList = patientsDiseasesRepository.findAll();
        assertThat(patientsDiseasesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPatientsDiseases() throws Exception {
        // Initialize the database
        patientsDiseasesRepository.saveAndFlush(patientsDiseases);

        // Get all the patientsDiseasesList
        restPatientsDiseasesMockMvc.perform(get("/api/patients-diseases?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(patientsDiseases.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getPatientsDiseases() throws Exception {
        // Initialize the database
        patientsDiseasesRepository.saveAndFlush(patientsDiseases);

        // Get the patientsDiseases
        restPatientsDiseasesMockMvc.perform(get("/api/patients-diseases/{id}", patientsDiseases.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(patientsDiseases.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPatientsDiseases() throws Exception {
        // Get the patientsDiseases
        restPatientsDiseasesMockMvc.perform(get("/api/patients-diseases/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePatientsDiseases() throws Exception {
        // Initialize the database
        patientsDiseasesRepository.saveAndFlush(patientsDiseases);

        int databaseSizeBeforeUpdate = patientsDiseasesRepository.findAll().size();

        // Update the patientsDiseases
        PatientsDiseases updatedPatientsDiseases = patientsDiseasesRepository.findById(patientsDiseases.getId()).get();
        // Disconnect from session so that the updates on updatedPatientsDiseases are not directly saved in db
        em.detach(updatedPatientsDiseases);
        updatedPatientsDiseases
            .description(UPDATED_DESCRIPTION);

        restPatientsDiseasesMockMvc.perform(put("/api/patients-diseases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPatientsDiseases)))
            .andExpect(status().isOk());

        // Validate the PatientsDiseases in the database
        List<PatientsDiseases> patientsDiseasesList = patientsDiseasesRepository.findAll();
        assertThat(patientsDiseasesList).hasSize(databaseSizeBeforeUpdate);
        PatientsDiseases testPatientsDiseases = patientsDiseasesList.get(patientsDiseasesList.size() - 1);
        assertThat(testPatientsDiseases.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingPatientsDiseases() throws Exception {
        int databaseSizeBeforeUpdate = patientsDiseasesRepository.findAll().size();

        // Create the PatientsDiseases

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientsDiseasesMockMvc.perform(put("/api/patients-diseases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(patientsDiseases)))
            .andExpect(status().isBadRequest());

        // Validate the PatientsDiseases in the database
        List<PatientsDiseases> patientsDiseasesList = patientsDiseasesRepository.findAll();
        assertThat(patientsDiseasesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePatientsDiseases() throws Exception {
        // Initialize the database
        patientsDiseasesRepository.saveAndFlush(patientsDiseases);

        int databaseSizeBeforeDelete = patientsDiseasesRepository.findAll().size();

        // Delete the patientsDiseases
        restPatientsDiseasesMockMvc.perform(delete("/api/patients-diseases/{id}", patientsDiseases.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<PatientsDiseases> patientsDiseasesList = patientsDiseasesRepository.findAll();
        assertThat(patientsDiseasesList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PatientsDiseases.class);
        PatientsDiseases patientsDiseases1 = new PatientsDiseases();
        patientsDiseases1.setId(1L);
        PatientsDiseases patientsDiseases2 = new PatientsDiseases();
        patientsDiseases2.setId(patientsDiseases1.getId());
        assertThat(patientsDiseases1).isEqualTo(patientsDiseases2);
        patientsDiseases2.setId(2L);
        assertThat(patientsDiseases1).isNotEqualTo(patientsDiseases2);
        patientsDiseases1.setId(null);
        assertThat(patientsDiseases1).isNotEqualTo(patientsDiseases2);
    }
}
