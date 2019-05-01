package com.doctor.schedule.web.rest;
import com.doctor.schedule.domain.Medicines;
import com.doctor.schedule.repository.MedicinesRepository;
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
 * REST controller for managing Medicines.
 */
@RestController
@RequestMapping("/api")
public class MedicinesResource {

    private final Logger log = LoggerFactory.getLogger(MedicinesResource.class);

    private static final String ENTITY_NAME = "medicines";

    private final MedicinesRepository medicinesRepository;

    public MedicinesResource(MedicinesRepository medicinesRepository) {
        this.medicinesRepository = medicinesRepository;
    }

    /**
     * POST  /medicines : Create a new medicines.
     *
     * @param medicines the medicines to create
     * @return the ResponseEntity with status 201 (Created) and with body the new medicines, or with status 400 (Bad Request) if the medicines has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/medicines")
    public ResponseEntity<Medicines> createMedicines(@RequestBody Medicines medicines) throws URISyntaxException {
        log.debug("REST request to save Medicines : {}", medicines);
        if (medicines.getId() != null) {
            throw new BadRequestAlertException("A new medicines cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Medicines result = medicinesRepository.save(medicines);
        return ResponseEntity.created(new URI("/api/medicines/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /medicines : Updates an existing medicines.
     *
     * @param medicines the medicines to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated medicines,
     * or with status 400 (Bad Request) if the medicines is not valid,
     * or with status 500 (Internal Server Error) if the medicines couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/medicines")
    public ResponseEntity<Medicines> updateMedicines(@RequestBody Medicines medicines) throws URISyntaxException {
        log.debug("REST request to update Medicines : {}", medicines);
        if (medicines.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Medicines result = medicinesRepository.save(medicines);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, medicines.getId().toString()))
            .body(result);
    }

    /**
     * GET  /medicines : get all the medicines.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of medicines in body
     */
    @GetMapping("/medicines")
    public List<Medicines> getAllMedicines() {
        log.debug("REST request to get all Medicines");
        return medicinesRepository.findAll();
    }

    /**
     * GET  /medicines/:id : get the "id" medicines.
     *
     * @param id the id of the medicines to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the medicines, or with status 404 (Not Found)
     */
    @GetMapping("/medicines/{id}")
    public ResponseEntity<Medicines> getMedicines(@PathVariable Long id) {
        log.debug("REST request to get Medicines : {}", id);
        Optional<Medicines> medicines = medicinesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(medicines);
    }

    /**
     * DELETE  /medicines/:id : delete the "id" medicines.
     *
     * @param id the id of the medicines to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<Void> deleteMedicines(@PathVariable Long id) {
        log.debug("REST request to delete Medicines : {}", id);
        medicinesRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
