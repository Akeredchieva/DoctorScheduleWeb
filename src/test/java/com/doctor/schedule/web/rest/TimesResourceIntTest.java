package com.doctor.schedule.web.rest;

import com.doctor.schedule.DoctorScheduleApp;

import com.doctor.schedule.domain.Times;
import com.doctor.schedule.repository.TimesRepository;
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
 * Test class for the TimesResource REST controller.
 *
 * @see TimesResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DoctorScheduleApp.class)
public class TimesResourceIntTest {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private TimesRepository timesRepository;

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

    private MockMvc restTimesMockMvc;

    private Times times;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TimesResource timesResource = new TimesResource(timesRepository);
        this.restTimesMockMvc = MockMvcBuilders.standaloneSetup(timesResource)
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
    public static Times createEntity(EntityManager em) {
        Times times = new Times()
            .date(DEFAULT_DATE);
        return times;
    }

    @Before
    public void initTest() {
        times = createEntity(em);
    }

    @Test
    @Transactional
    public void createTimes() throws Exception {
        int databaseSizeBeforeCreate = timesRepository.findAll().size();

        // Create the Times
        restTimesMockMvc.perform(post("/api/times")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(times)))
            .andExpect(status().isCreated());

        // Validate the Times in the database
        List<Times> timesList = timesRepository.findAll();
        assertThat(timesList).hasSize(databaseSizeBeforeCreate + 1);
        Times testTimes = timesList.get(timesList.size() - 1);
        assertThat(testTimes.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createTimesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = timesRepository.findAll().size();

        // Create the Times with an existing ID
        times.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTimesMockMvc.perform(post("/api/times")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(times)))
            .andExpect(status().isBadRequest());

        // Validate the Times in the database
        List<Times> timesList = timesRepository.findAll();
        assertThat(timesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllTimes() throws Exception {
        // Initialize the database
        timesRepository.saveAndFlush(times);

        // Get all the timesList
        restTimesMockMvc.perform(get("/api/times?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(times.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getTimes() throws Exception {
        // Initialize the database
        timesRepository.saveAndFlush(times);

        // Get the times
        restTimesMockMvc.perform(get("/api/times/{id}", times.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(times.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTimes() throws Exception {
        // Get the times
        restTimesMockMvc.perform(get("/api/times/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTimes() throws Exception {
        // Initialize the database
        timesRepository.saveAndFlush(times);

        int databaseSizeBeforeUpdate = timesRepository.findAll().size();

        // Update the times
        Times updatedTimes = timesRepository.findById(times.getId()).get();
        // Disconnect from session so that the updates on updatedTimes are not directly saved in db
        em.detach(updatedTimes);
        updatedTimes
            .date(UPDATED_DATE);

        restTimesMockMvc.perform(put("/api/times")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTimes)))
            .andExpect(status().isOk());

        // Validate the Times in the database
        List<Times> timesList = timesRepository.findAll();
        assertThat(timesList).hasSize(databaseSizeBeforeUpdate);
        Times testTimes = timesList.get(timesList.size() - 1);
        assertThat(testTimes.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingTimes() throws Exception {
        int databaseSizeBeforeUpdate = timesRepository.findAll().size();

        // Create the Times

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimesMockMvc.perform(put("/api/times")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(times)))
            .andExpect(status().isBadRequest());

        // Validate the Times in the database
        List<Times> timesList = timesRepository.findAll();
        assertThat(timesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTimes() throws Exception {
        // Initialize the database
        timesRepository.saveAndFlush(times);

        int databaseSizeBeforeDelete = timesRepository.findAll().size();

        // Delete the times
        restTimesMockMvc.perform(delete("/api/times/{id}", times.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Times> timesList = timesRepository.findAll();
        assertThat(timesList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Times.class);
        Times times1 = new Times();
        times1.setId(1L);
        Times times2 = new Times();
        times2.setId(times1.getId());
        assertThat(times1).isEqualTo(times2);
        times2.setId(2L);
        assertThat(times1).isNotEqualTo(times2);
        times1.setId(null);
        assertThat(times1).isNotEqualTo(times2);
    }
}
