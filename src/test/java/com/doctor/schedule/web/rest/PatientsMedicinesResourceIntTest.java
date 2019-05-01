package com.doctor.schedule.web.rest;

import com.doctor.schedule.DoctorScheduleApp;

import com.doctor.schedule.domain.PatientsMedicines;
import com.doctor.schedule.repository.PatientsMedicinesRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static com.doctor.schedule.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PatientsMedicinesResource REST controller.
 *
 * @see PatientsMedicinesResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DoctorScheduleApp.class)
public class PatientsMedicinesResourceIntTest {

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private PatientsMedicinesRepository patientsMedicinesRepository;

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

    private MockMvc restPatientsMedicinesMockMvc;

    private PatientsMedicines patientsMedicines;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PatientsMedicinesResource patientsMedicinesResource = new PatientsMedicinesResource(patientsMedicinesRepository);
        this.restPatientsMedicinesMockMvc = MockMvcBuilders.standaloneSetup(patientsMedicinesResource)
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
    public static PatientsMedicines createEntity(EntityManager em) {
        PatientsMedicines patientsMedicines = new PatientsMedicines()
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .description(DEFAULT_DESCRIPTION);
        return patientsMedicines;
    }

    @Before
    public void initTest() {
        patientsMedicines = createEntity(em);
    }

    @Test
    @Transactional
    public void createPatientsMedicines() throws Exception {
        int databaseSizeBeforeCreate = patientsMedicinesRepository.findAll().size();

        // Create the PatientsMedicines
        restPatientsMedicinesMockMvc.perform(post("/api/patients-medicines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(patientsMedicines)))
            .andExpect(status().isCreated());

        // Validate the PatientsMedicines in the database
        List<PatientsMedicines> patientsMedicinesList = patientsMedicinesRepository.findAll();
        assertThat(patientsMedicinesList).hasSize(databaseSizeBeforeCreate + 1);
        PatientsMedicines testPatientsMedicines = patientsMedicinesList.get(patientsMedicinesList.size() - 1);
        assertThat(testPatientsMedicines.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testPatientsMedicines.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testPatientsMedicines.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createPatientsMedicinesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = patientsMedicinesRepository.findAll().size();

        // Create the PatientsMedicines with an existing ID
        patientsMedicines.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPatientsMedicinesMockMvc.perform(post("/api/patients-medicines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(patientsMedicines)))
            .andExpect(status().isBadRequest());

        // Validate the PatientsMedicines in the database
        List<PatientsMedicines> patientsMedicinesList = patientsMedicinesRepository.findAll();
        assertThat(patientsMedicinesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPatientsMedicines() throws Exception {
        // Initialize the database
        patientsMedicinesRepository.saveAndFlush(patientsMedicines);

        // Get all the patientsMedicinesList
        restPatientsMedicinesMockMvc.perform(get("/api/patients-medicines?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(patientsMedicines.getId().intValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getPatientsMedicines() throws Exception {
        // Initialize the database
        patientsMedicinesRepository.saveAndFlush(patientsMedicines);

        // Get the patientsMedicines
        restPatientsMedicinesMockMvc.perform(get("/api/patients-medicines/{id}", patientsMedicines.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(patientsMedicines.getId().intValue()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPatientsMedicines() throws Exception {
        // Get the patientsMedicines
        restPatientsMedicinesMockMvc.perform(get("/api/patients-medicines/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePatientsMedicines() throws Exception {
        // Initialize the database
        patientsMedicinesRepository.saveAndFlush(patientsMedicines);

        int databaseSizeBeforeUpdate = patientsMedicinesRepository.findAll().size();

        // Update the patientsMedicines
        PatientsMedicines updatedPatientsMedicines = patientsMedicinesRepository.findById(patientsMedicines.getId()).get();
        // Disconnect from session so that the updates on updatedPatientsMedicines are not directly saved in db
        em.detach(updatedPatientsMedicines);
        updatedPatientsMedicines
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .description(UPDATED_DESCRIPTION);

        restPatientsMedicinesMockMvc.perform(put("/api/patients-medicines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPatientsMedicines)))
            .andExpect(status().isOk());

        // Validate the PatientsMedicines in the database
        List<PatientsMedicines> patientsMedicinesList = patientsMedicinesRepository.findAll();
        assertThat(patientsMedicinesList).hasSize(databaseSizeBeforeUpdate);
        PatientsMedicines testPatientsMedicines = patientsMedicinesList.get(patientsMedicinesList.size() - 1);
        assertThat(testPatientsMedicines.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testPatientsMedicines.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testPatientsMedicines.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingPatientsMedicines() throws Exception {
        int databaseSizeBeforeUpdate = patientsMedicinesRepository.findAll().size();

        // Create the PatientsMedicines

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientsMedicinesMockMvc.perform(put("/api/patients-medicines")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(patientsMedicines)))
            .andExpect(status().isBadRequest());

        // Validate the PatientsMedicines in the database
        List<PatientsMedicines> patientsMedicinesList = patientsMedicinesRepository.findAll();
        assertThat(patientsMedicinesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePatientsMedicines() throws Exception {
        // Initialize the database
        patientsMedicinesRepository.saveAndFlush(patientsMedicines);

        int databaseSizeBeforeDelete = patientsMedicinesRepository.findAll().size();

        // Delete the patientsMedicines
        restPatientsMedicinesMockMvc.perform(delete("/api/patients-medicines/{id}", patientsMedicines.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<PatientsMedicines> patientsMedicinesList = patientsMedicinesRepository.findAll();
        assertThat(patientsMedicinesList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PatientsMedicines.class);
        PatientsMedicines patientsMedicines1 = new PatientsMedicines();
        patientsMedicines1.setId(1L);
        PatientsMedicines patientsMedicines2 = new PatientsMedicines();
        patientsMedicines2.setId(patientsMedicines1.getId());
        assertThat(patientsMedicines1).isEqualTo(patientsMedicines2);
        patientsMedicines2.setId(2L);
        assertThat(patientsMedicines1).isNotEqualTo(patientsMedicines2);
        patientsMedicines1.setId(null);
        assertThat(patientsMedicines1).isNotEqualTo(patientsMedicines2);
    }
}
