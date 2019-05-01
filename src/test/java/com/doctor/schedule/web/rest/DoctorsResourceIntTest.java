package com.doctor.schedule.web.rest;

import com.doctor.schedule.DoctorScheduleApp;

import com.doctor.schedule.domain.Doctors;
import com.doctor.schedule.repository.DoctorsRepository;
import com.doctor.schedule.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;


import static com.doctor.schedule.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the DoctorsResource REST controller.
 *
 * @see DoctorsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DoctorScheduleApp.class)
public class DoctorsResourceIntTest {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    @Autowired
    private DoctorsRepository doctorsRepository;

    @Mock
    private DoctorsRepository doctorsRepositoryMock;

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

    private MockMvc restDoctorsMockMvc;

    private Doctors doctors;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DoctorsResource doctorsResource = new DoctorsResource(doctorsRepository);
        this.restDoctorsMockMvc = MockMvcBuilders.standaloneSetup(doctorsResource)
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
    public static Doctors createEntity(EntityManager em) {
        Doctors doctors = new Doctors()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .phone(DEFAULT_PHONE);
        return doctors;
    }

    @Before
    public void initTest() {
        doctors = createEntity(em);
    }

    @Test
    @Transactional
    public void createDoctors() throws Exception {
        int databaseSizeBeforeCreate = doctorsRepository.findAll().size();

        // Create the Doctors
        restDoctorsMockMvc.perform(post("/api/doctors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(doctors)))
            .andExpect(status().isCreated());

        // Validate the Doctors in the database
        List<Doctors> doctorsList = doctorsRepository.findAll();
        assertThat(doctorsList).hasSize(databaseSizeBeforeCreate + 1);
        Doctors testDoctors = doctorsList.get(doctorsList.size() - 1);
        assertThat(testDoctors.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testDoctors.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testDoctors.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testDoctors.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    @Transactional
    public void createDoctorsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = doctorsRepository.findAll().size();

        // Create the Doctors with an existing ID
        doctors.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDoctorsMockMvc.perform(post("/api/doctors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(doctors)))
            .andExpect(status().isBadRequest());

        // Validate the Doctors in the database
        List<Doctors> doctorsList = doctorsRepository.findAll();
        assertThat(doctorsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllDoctors() throws Exception {
        // Initialize the database
        doctorsRepository.saveAndFlush(doctors);

        // Get all the doctorsList
        restDoctorsMockMvc.perform(get("/api/doctors?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(doctors.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME.toString())))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE.toString())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllDoctorsWithEagerRelationshipsIsEnabled() throws Exception {
        DoctorsResource doctorsResource = new DoctorsResource(doctorsRepositoryMock);
        when(doctorsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restDoctorsMockMvc = MockMvcBuilders.standaloneSetup(doctorsResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restDoctorsMockMvc.perform(get("/api/doctors?eagerload=true"))
        .andExpect(status().isOk());

        verify(doctorsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllDoctorsWithEagerRelationshipsIsNotEnabled() throws Exception {
        DoctorsResource doctorsResource = new DoctorsResource(doctorsRepositoryMock);
            when(doctorsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restDoctorsMockMvc = MockMvcBuilders.standaloneSetup(doctorsResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restDoctorsMockMvc.perform(get("/api/doctors?eagerload=true"))
        .andExpect(status().isOk());

            verify(doctorsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getDoctors() throws Exception {
        // Initialize the database
        doctorsRepository.saveAndFlush(doctors);

        // Get the doctors
        restDoctorsMockMvc.perform(get("/api/doctors/{id}", doctors.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(doctors.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME.toString()))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDoctors() throws Exception {
        // Get the doctors
        restDoctorsMockMvc.perform(get("/api/doctors/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDoctors() throws Exception {
        // Initialize the database
        doctorsRepository.saveAndFlush(doctors);

        int databaseSizeBeforeUpdate = doctorsRepository.findAll().size();

        // Update the doctors
        Doctors updatedDoctors = doctorsRepository.findById(doctors.getId()).get();
        // Disconnect from session so that the updates on updatedDoctors are not directly saved in db
        em.detach(updatedDoctors);
        updatedDoctors
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE);

        restDoctorsMockMvc.perform(put("/api/doctors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDoctors)))
            .andExpect(status().isOk());

        // Validate the Doctors in the database
        List<Doctors> doctorsList = doctorsRepository.findAll();
        assertThat(doctorsList).hasSize(databaseSizeBeforeUpdate);
        Doctors testDoctors = doctorsList.get(doctorsList.size() - 1);
        assertThat(testDoctors.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testDoctors.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testDoctors.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testDoctors.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    public void updateNonExistingDoctors() throws Exception {
        int databaseSizeBeforeUpdate = doctorsRepository.findAll().size();

        // Create the Doctors

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDoctorsMockMvc.perform(put("/api/doctors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(doctors)))
            .andExpect(status().isBadRequest());

        // Validate the Doctors in the database
        List<Doctors> doctorsList = doctorsRepository.findAll();
        assertThat(doctorsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDoctors() throws Exception {
        // Initialize the database
        doctorsRepository.saveAndFlush(doctors);

        int databaseSizeBeforeDelete = doctorsRepository.findAll().size();

        // Delete the doctors
        restDoctorsMockMvc.perform(delete("/api/doctors/{id}", doctors.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Doctors> doctorsList = doctorsRepository.findAll();
        assertThat(doctorsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Doctors.class);
        Doctors doctors1 = new Doctors();
        doctors1.setId(1L);
        Doctors doctors2 = new Doctors();
        doctors2.setId(doctors1.getId());
        assertThat(doctors1).isEqualTo(doctors2);
        doctors2.setId(2L);
        assertThat(doctors1).isNotEqualTo(doctors2);
        doctors1.setId(null);
        assertThat(doctors1).isNotEqualTo(doctors2);
    }
}
