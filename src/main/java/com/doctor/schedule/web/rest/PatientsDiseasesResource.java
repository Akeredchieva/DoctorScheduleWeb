package com.doctor.schedule.web.rest;
import com.doctor.schedule.domain.PatientsDiseases;
import com.doctor.schedule.repository.PatientsDiseasesRepository;
import com.doctor.schedule.security.AuthoritiesConstants;
import com.doctor.schedule.web.rest.errors.BadRequestAlertException;
import com.doctor.schedule.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing PatientsDiseases.
 */
@RestController
@RequestMapping("/api")
public class PatientsDiseasesResource {
    private final Logger log = LoggerFactory.getLogger(PatientsDiseasesResource.class);

    private static final String ENTITY_NAME = "patientsDiseases";

    private final PatientsDiseasesRepository patientsDiseasesRepository;

    public PatientsDiseasesResource(PatientsDiseasesRepository patientsDiseasesRepository) {
        this.patientsDiseasesRepository = patientsDiseasesRepository;
    }

    /**
     * POST  /patients-diseases : Create a new patientsDiseases.
     *
     * @param patientsDiseases the patientsDiseases to create
     * @return the ResponseEntity with status 201 (Created) and with body the new patientsDiseases, or with status 400 (Bad Request) if the patientsDiseases has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.DOCTOR + "\")")
    @PostMapping("/patients-diseases")
    public ResponseEntity<PatientsDiseases> createPatientsDiseases(@RequestBody PatientsDiseases patientsDiseases) throws URISyntaxException {
        log.debug("REST request to save PatientsDiseases : {}", patientsDiseases);
        if (patientsDiseases.getId() != null) {
            throw new BadRequestAlertException("A new patientsDiseases cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PatientsDiseases result = patientsDiseasesRepository.save(patientsDiseases);
        return ResponseEntity.created(new URI("/api/patients-diseases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /patients-diseases : Updates an existing patientsDiseases.
     *
     * @param patientsDiseases the patientsDiseases to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated patientsDiseases,
     * or with status 400 (Bad Request) if the patientsDiseases is not valid,
     * or with status 500 (Internal Server Error) if the patientsDiseases couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.DOCTOR + "\")")
    @PutMapping("/patients-diseases")
    public ResponseEntity<PatientsDiseases> updatePatientsDiseases(@RequestBody PatientsDiseases patientsDiseases) throws URISyntaxException {
        log.debug("REST request to update PatientsDiseases : {}", patientsDiseases);
        if (patientsDiseases.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PatientsDiseases result = patientsDiseasesRepository.save(patientsDiseases);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, patientsDiseases.getId().toString()))
            .body(result);
    }

    /**
     * GET  /patients-diseases : get all the patientsDiseases.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of patientsDiseases in body
     */
    @GetMapping("/patients-diseases")
    public List<PatientsDiseases> getAllPatientsDiseases() {
        log.debug("REST request to get all PatientsDiseases");
        return patientsDiseasesRepository.findAll();
    }

    /**
     * GET  /patients-diseases/:id : get the "id" patientsDiseases.
     *
     * @param id the id of the patientsDiseases to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the patientsDiseases, or with status 404 (Not Found)
     */
    @GetMapping("/patients-diseases/{id}")
    public ResponseEntity<PatientsDiseases> getPatientsDiseases(@PathVariable Long id) {
        log.debug("REST request to get PatientsDiseases : {}", id);
        Optional<PatientsDiseases> patientsDiseases = patientsDiseasesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(patientsDiseases);
    }

    /**
     * DELETE  /patients-diseases/:id : delete the "id" patientsDiseases.
     *
     * @param id the id of the patientsDiseases to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/patients-diseases/{id}")
    public ResponseEntity<Void> deletePatientsDiseases(@PathVariable Long id) {
        log.debug("REST request to delete PatientsDiseases : {}", id);
        patientsDiseasesRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
