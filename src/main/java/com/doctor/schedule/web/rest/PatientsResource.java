package com.doctor.schedule.web.rest;
import com.doctor.schedule.domain.Patients;
import com.doctor.schedule.repository.PatientsRepository;
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
 * REST controller for managing Patients.
 */
@RestController
@RequestMapping("/api")
public class PatientsResource {

    private final Logger log = LoggerFactory.getLogger(PatientsResource.class);

    private static final String ENTITY_NAME = "patients";

    private final PatientsRepository patientsRepository;

    public PatientsResource(PatientsRepository patientsRepository) {
        this.patientsRepository = patientsRepository;
    }

    /**
     * POST  /patients : Create a new patients.
     *
     * @param patients the patients to create
     * @return the ResponseEntity with status 201 (Created) and with body the new patients, or with status 400 (Bad Request) if the patients has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/patients")
    public ResponseEntity<Patients> createPatients(@RequestBody Patients patients) throws URISyntaxException {
        log.debug("REST request to save Patients : {}", patients);
        if (patients.getId() != null) {
            throw new BadRequestAlertException("A new patients cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Patients result = patientsRepository.save(patients);
        return ResponseEntity.created(new URI("/api/patients/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /patients : Updates an existing patients.
     *
     * @param patients the patients to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated patients,
     * or with status 400 (Bad Request) if the patients is not valid,
     * or with status 500 (Internal Server Error) if the patients couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/patients")
    public ResponseEntity<Patients> updatePatients(@RequestBody Patients patients) throws URISyntaxException {
        log.debug("REST request to update Patients : {}", patients);
        if (patients.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Patients result = patientsRepository.save(patients);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, patients.getId().toString()))
            .body(result);
    }

    /**
     * GET  /patients : get all the patients.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of patients in body
     */
    @GetMapping("/patients")
    public List<Patients> getAllPatients() {
        log.debug("REST request to get all Patients");
        return patientsRepository.findAll();
    }

    /**
     * GET  /patients/:id : get the "id" patients.
     *
     * @param id the id of the patients to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the patients, or with status 404 (Not Found)
     */
    @GetMapping("/patients/{id}")
    public ResponseEntity<Patients> getPatients(@PathVariable Long id) {
        log.debug("REST request to get Patients : {}", id);
        Optional<Patients> patients = patientsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(patients);
    }

    /**
     * DELETE  /patients/:id : delete the "id" patients.
     *
     * @param id the id of the patients to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/patients/{id}")
    public ResponseEntity<Void> deletePatients(@PathVariable Long id) {
        log.debug("REST request to delete Patients : {}", id);
        patientsRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
