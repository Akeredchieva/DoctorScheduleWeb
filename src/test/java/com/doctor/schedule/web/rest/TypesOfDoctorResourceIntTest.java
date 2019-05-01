package com.doctor.schedule.web.rest;

import com.doctor.schedule.DoctorScheduleApp;

import com.doctor.schedule.domain.TypesOfDoctor;
import com.doctor.schedule.repository.TypesOfDoctorRepository;
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
 * Test class for the TypesOfDoctorResource REST controller.
 *
 * @see TypesOfDoctorResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DoctorScheduleApp.class)
public class TypesOfDoctorResourceIntTest {

    private static final String DEFAULT_SPECIALIST = "AAAAAAAAAA";
    private static final String UPDATED_SPECIALIST = "BBBBBBBBBB";

    @Autowired
    private TypesOfDoctorRepository typesOfDoctorRepository;

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

    private MockMvc restTypesOfDoctorMockMvc;

    private TypesOfDoctor typesOfDoctor;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TypesOfDoctorResource typesOfDoctorResource = new TypesOfDoctorResource(typesOfDoctorRepository);
        this.restTypesOfDoctorMockMvc = MockMvcBuilders.standaloneSetup(typesOfDoctorResource)
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
    public static TypesOfDoctor createEntity(EntityManager em) {
        TypesOfDoctor typesOfDoctor = new TypesOfDoctor()
            .specialist(DEFAULT_SPECIALIST);
        return typesOfDoctor;
    }

    @Before
    public void initTest() {
        typesOfDoctor = createEntity(em);
    }

    @Test
    @Transactional
    public void createTypesOfDoctor() throws Exception {
        int databaseSizeBeforeCreate = typesOfDoctorRepository.findAll().size();

        // Create the TypesOfDoctor
        restTypesOfDoctorMockMvc.perform(post("/api/types-of-doctors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(typesOfDoctor)))
            .andExpect(status().isCreated());

        // Validate the TypesOfDoctor in the database
        List<TypesOfDoctor> typesOfDoctorList = typesOfDoctorRepository.findAll();
        assertThat(typesOfDoctorList).hasSize(databaseSizeBeforeCreate + 1);
        TypesOfDoctor testTypesOfDoctor = typesOfDoctorList.get(typesOfDoctorList.size() - 1);
        assertThat(testTypesOfDoctor.getSpecialist()).isEqualTo(DEFAULT_SPECIALIST);
    }

    @Test
    @Transactional
    public void createTypesOfDoctorWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = typesOfDoctorRepository.findAll().size();

        // Create the TypesOfDoctor with an existing ID
        typesOfDoctor.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypesOfDoctorMockMvc.perform(post("/api/types-of-doctors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(typesOfDoctor)))
            .andExpect(status().isBadRequest());

        // Validate the TypesOfDoctor in the database
        List<TypesOfDoctor> typesOfDoctorList = typesOfDoctorRepository.findAll();
        assertThat(typesOfDoctorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllTypesOfDoctors() throws Exception {
        // Initialize the database
        typesOfDoctorRepository.saveAndFlush(typesOfDoctor);

        // Get all the typesOfDoctorList
        restTypesOfDoctorMockMvc.perform(get("/api/types-of-doctors?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typesOfDoctor.getId().intValue())))
            .andExpect(jsonPath("$.[*].specialist").value(hasItem(DEFAULT_SPECIALIST.toString())));
    }
    
    @Test
    @Transactional
    public void getTypesOfDoctor() throws Exception {
        // Initialize the database
        typesOfDoctorRepository.saveAndFlush(typesOfDoctor);

        // Get the typesOfDoctor
        restTypesOfDoctorMockMvc.perform(get("/api/types-of-doctors/{id}", typesOfDoctor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(typesOfDoctor.getId().intValue()))
            .andExpect(jsonPath("$.specialist").value(DEFAULT_SPECIALIST.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTypesOfDoctor() throws Exception {
        // Get the typesOfDoctor
        restTypesOfDoctorMockMvc.perform(get("/api/types-of-doctors/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTypesOfDoctor() throws Exception {
        // Initialize the database
        typesOfDoctorRepository.saveAndFlush(typesOfDoctor);

        int databaseSizeBeforeUpdate = typesOfDoctorRepository.findAll().size();

        // Update the typesOfDoctor
        TypesOfDoctor updatedTypesOfDoctor = typesOfDoctorRepository.findById(typesOfDoctor.getId()).get();
        // Disconnect from session so that the updates on updatedTypesOfDoctor are not directly saved in db
        em.detach(updatedTypesOfDoctor);
        updatedTypesOfDoctor
            .specialist(UPDATED_SPECIALIST);

        restTypesOfDoctorMockMvc.perform(put("/api/types-of-doctors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTypesOfDoctor)))
            .andExpect(status().isOk());

        // Validate the TypesOfDoctor in the database
        List<TypesOfDoctor> typesOfDoctorList = typesOfDoctorRepository.findAll();
        assertThat(typesOfDoctorList).hasSize(databaseSizeBeforeUpdate);
        TypesOfDoctor testTypesOfDoctor = typesOfDoctorList.get(typesOfDoctorList.size() - 1);
        assertThat(testTypesOfDoctor.getSpecialist()).isEqualTo(UPDATED_SPECIALIST);
    }

    @Test
    @Transactional
    public void updateNonExistingTypesOfDoctor() throws Exception {
        int databaseSizeBeforeUpdate = typesOfDoctorRepository.findAll().size();

        // Create the TypesOfDoctor

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypesOfDoctorMockMvc.perform(put("/api/types-of-doctors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(typesOfDoctor)))
            .andExpect(status().isBadRequest());

        // Validate the TypesOfDoctor in the database
        List<TypesOfDoctor> typesOfDoctorList = typesOfDoctorRepository.findAll();
        assertThat(typesOfDoctorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTypesOfDoctor() throws Exception {
        // Initialize the database
        typesOfDoctorRepository.saveAndFlush(typesOfDoctor);

        int databaseSizeBeforeDelete = typesOfDoctorRepository.findAll().size();

        // Delete the typesOfDoctor
        restTypesOfDoctorMockMvc.perform(delete("/api/types-of-doctors/{id}", typesOfDoctor.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TypesOfDoctor> typesOfDoctorList = typesOfDoctorRepository.findAll();
        assertThat(typesOfDoctorList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypesOfDoctor.class);
        TypesOfDoctor typesOfDoctor1 = new TypesOfDoctor();
        typesOfDoctor1.setId(1L);
        TypesOfDoctor typesOfDoctor2 = new TypesOfDoctor();
        typesOfDoctor2.setId(typesOfDoctor1.getId());
        assertThat(typesOfDoctor1).isEqualTo(typesOfDoctor2);
        typesOfDoctor2.setId(2L);
        assertThat(typesOfDoctor1).isNotEqualTo(typesOfDoctor2);
        typesOfDoctor1.setId(null);
        assertThat(typesOfDoctor1).isNotEqualTo(typesOfDoctor2);
    }
}
