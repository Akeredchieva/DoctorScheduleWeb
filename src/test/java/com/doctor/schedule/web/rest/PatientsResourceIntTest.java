package com.doctor.schedule.web.rest;

import com.doctor.schedule.DoctorScheduleApp;

import com.doctor.schedule.domain.Patients;
import com.doctor.schedule.repository.PatientsRepository;
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
 * Test class for the PatientsResource REST controller.
 *
 * @see PatientsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DoctorScheduleApp.class)
public class PatientsResourceIntTest {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MIDDLE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MIDDLE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String DEFAULT_PERSONAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_PERSONAL_ID = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    @Autowired
    private PatientsRepository patientsRepository;

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

    private MockMvc restPatientsMockMvc;

    private Patients patients;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PatientsResource patientsResource = new PatientsResource(patientsRepository);
        this.restPatientsMockMvc = MockMvcBuilders.standaloneSetup(patientsResource)
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
    public static Patients createEntity(EntityManager em) {
        Patients patients = new Patients()
            .firstName(DEFAULT_FIRST_NAME)
            .middleName(DEFAULT_MIDDLE_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .phone(DEFAULT_PHONE)
            .personalId(DEFAULT_PERSONAL_ID)
            .address(DEFAULT_ADDRESS)
            .email(DEFAULT_EMAIL);
        return patients;
    }

    @Before
    public void initTest() {
        patients = createEntity(em);
    }

    @Test
    @Transactional
    public void createPatients() throws Exception {
        int databaseSizeBeforeCreate = patientsRepository.findAll().size();

        // Create the Patients
        restPatientsMockMvc.perform(post("/api/patients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(patients)))
            .andExpect(status().isCreated());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeCreate + 1);
        Patients testPatients = patientsList.get(patientsList.size() - 1);
        assertThat(testPatients.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testPatients.getMiddleName()).isEqualTo(DEFAULT_MIDDLE_NAME);
        assertThat(testPatients.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testPatients.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testPatients.getPersonalId()).isEqualTo(DEFAULT_PERSONAL_ID);
        assertThat(testPatients.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testPatients.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    public void createPatientsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = patientsRepository.findAll().size();

        // Create the Patients with an existing ID
        patients.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPatientsMockMvc.perform(post("/api/patients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(patients)))
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPatients() throws Exception {
        // Initialize the database
        patientsRepository.saveAndFlush(patients);

        // Get all the patientsList
        restPatientsMockMvc.perform(get("/api/patients?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(patients.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME.toString())))
            .andExpect(jsonPath("$.[*].middleName").value(hasItem(DEFAULT_MIDDLE_NAME.toString())))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME.toString())))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE.toString())))
            .andExpect(jsonPath("$.[*].personalId").value(hasItem(DEFAULT_PERSONAL_ID.toString())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())));
    }
    
    @Test
    @Transactional
    public void getPatients() throws Exception {
        // Initialize the database
        patientsRepository.saveAndFlush(patients);

        // Get the patients
        restPatientsMockMvc.perform(get("/api/patients/{id}", patients.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(patients.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME.toString()))
            .andExpect(jsonPath("$.middleName").value(DEFAULT_MIDDLE_NAME.toString()))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME.toString()))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE.toString()))
            .andExpect(jsonPath("$.personalId").value(DEFAULT_PERSONAL_ID.toString()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPatients() throws Exception {
        // Get the patients
        restPatientsMockMvc.perform(get("/api/patients/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePatients() throws Exception {
        // Initialize the database
        patientsRepository.saveAndFlush(patients);

        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();

        // Update the patients
        Patients updatedPatients = patientsRepository.findById(patients.getId()).get();
        // Disconnect from session so that the updates on updatedPatients are not directly saved in db
        em.detach(updatedPatients);
        updatedPatients
            .firstName(UPDATED_FIRST_NAME)
            .middleName(UPDATED_MIDDLE_NAME)
            .lastName(UPDATED_LAST_NAME)
            .phone(UPDATED_PHONE)
            .personalId(UPDATED_PERSONAL_ID)
            .address(UPDATED_ADDRESS)
            .email(UPDATED_EMAIL);

        restPatientsMockMvc.perform(put("/api/patients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPatients)))
            .andExpect(status().isOk());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
        Patients testPatients = patientsList.get(patientsList.size() - 1);
        assertThat(testPatients.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testPatients.getMiddleName()).isEqualTo(UPDATED_MIDDLE_NAME);
        assertThat(testPatients.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testPatients.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testPatients.getPersonalId()).isEqualTo(UPDATED_PERSONAL_ID);
        assertThat(testPatients.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testPatients.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    public void updateNonExistingPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();

        // Create the Patients

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientsMockMvc.perform(put("/api/patients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(patients)))
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePatients() throws Exception {
        // Initialize the database
        patientsRepository.saveAndFlush(patients);

        int databaseSizeBeforeDelete = patientsRepository.findAll().size();

        // Delete the patients
        restPatientsMockMvc.perform(delete("/api/patients/{id}", patients.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Patients.class);
        Patients patients1 = new Patients();
        patients1.setId(1L);
        Patients patients2 = new Patients();
        patients2.setId(patients1.getId());
        assertThat(patients1).isEqualTo(patients2);
        patients2.setId(2L);
        assertThat(patients1).isNotEqualTo(patients2);
        patients1.setId(null);
        assertThat(patients1).isNotEqualTo(patients2);
    }
}
