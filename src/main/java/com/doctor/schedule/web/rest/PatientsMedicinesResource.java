package com.doctor.schedule.web.rest;
import com.doctor.schedule.domain.PatientsMedicines;
import com.doctor.schedule.repository.PatientsMedicinesRepository;
import com.doctor.schedule.web.rest.errors.BadRequestAlertException;
import com.doctor.schedule.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing PatientsMedicines.
 */
@RestController
@RequestMapping("/api")
public class PatientsMedicinesResource {

    private final Logger log = LoggerFactory.getLogger(PatientsMedicinesResource.class);

    private static final String ENTITY_NAME = "patientsMedicines";

    private final PatientsMedicinesRepository patientsMedicinesRepository;

    public PatientsMedicinesResource(PatientsMedicinesRepository patientsMedicinesRepository) {
        this.patientsMedicinesRepository = patientsMedicinesRepository;
    }

    /**
     * POST  /patients-medicines : Create a new patientsMedicines.
     *
     * @param patientsMedicines the patientsMedicines to create
     * @return the ResponseEntity with status 201 (Created) and with body the new patientsMedicines, or with status 400 (Bad Request) if the patientsMedicines has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/patients-medicines")
    public ResponseEntity<PatientsMedicines> createPatientsMedicines(@RequestBody PatientsMedicines patientsMedicines) throws URISyntaxException {
        log.debug("REST request to save PatientsMedicines : {}", patientsMedicines);
        if (patientsMedicines.getId() != null) {
            throw new BadRequestAlertException("A new patientsMedicines cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PatientsMedicines result = patientsMedicinesRepository.save(patientsMedicines);
        return ResponseEntity.created(new URI("/api/patients-medicines/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /patients-medicines : Updates an existing patientsMedicines.
     *
     * @param patientsMedicines the patientsMedicines to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated patientsMedicines,
     * or with status 400 (Bad Request) if the patientsMedicines is not valid,
     * or with status 500 (Internal Server Error) if the patientsMedicines couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/patients-medicines")
    public ResponseEntity<PatientsMedicines> updatePatientsMedicines(@RequestBody PatientsMedicines patientsMedicines) throws URISyntaxException {
        log.debug("REST request to update PatientsMedicines : {}", patientsMedicines);
        if (patientsMedicines.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PatientsMedicines result = patientsMedicinesRepository.save(patientsMedicines);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, patientsMedicines.getId().toString()))
            .body(result);
    }

    /**
     * GET  /patients-medicines : get all the patientsMedicines.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of patientsMedicines in body
     */
    @GetMapping("/patients-medicines")
    public List<PatientsMedicines> getAllPatientsMedicines() {
        log.debug("REST request to get all PatientsMedicines");
        return patientsMedicinesRepository.findAll();
    }

    /**
     * GET  /patients-medicines/:id : get the "id" patientsMedicines.
     *
     * @param id the id of the patientsMedicines to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the patientsMedicines, or with status 404 (Not Found)
     */
    @GetMapping("/patients-medicines/{id}")
    public ResponseEntity<PatientsMedicines> getPatientsMedicines(@PathVariable Long id) {
        log.debug("REST request to get PatientsMedicines : {}", id);
        Optional<PatientsMedicines> patientsMedicines = patientsMedicinesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(patientsMedicines);
    }

    /**
     * DELETE  /patients-medicines/:id : delete the "id" patientsMedicines.
     *
     * @param id the id of the patientsMedicines to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/patients-medicines/{id}")
    public ResponseEntity<Void> deletePatientsMedicines(@PathVariable Long id) {
        log.debug("REST request to delete PatientsMedicines : {}", id);
        patientsMedicinesRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
