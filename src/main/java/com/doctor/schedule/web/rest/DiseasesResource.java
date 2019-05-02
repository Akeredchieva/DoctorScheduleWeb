package com.doctor.schedule.web.rest;
import com.doctor.schedule.domain.Diseases;
import com.doctor.schedule.repository.DiseasesRepository;
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
 * REST controller for managing Diseases.
 */
@RestController
@RequestMapping("/api")
public class DiseasesResource {

    private final Logger log = LoggerFactory.getLogger(DiseasesResource.class);

    private static final String ENTITY_NAME = "diseases";

    private final DiseasesRepository diseasesRepository;

    public DiseasesResource(DiseasesRepository diseasesRepository) {
        this.diseasesRepository = diseasesRepository;
    }

    /**
     * POST  /diseases : Create a new diseases.
     *
     * @param diseases the diseases to create
     * @return the ResponseEntity with status 201 (Created) and with body the new diseases, or with status 400 (Bad Request) if the diseases has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/diseases")
    public ResponseEntity<Diseases> createDiseases(@RequestBody Diseases diseases) throws URISyntaxException {
        log.debug("REST request to save Diseases : {}", diseases);
        if (diseases.getId() != null) {
            throw new BadRequestAlertException("A new diseases cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Diseases result = diseasesRepository.save(diseases);
        return ResponseEntity.created(new URI("/api/diseases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /diseases : Updates an existing diseases.
     *
     * @param diseases the diseases to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated diseases,
     * or with status 400 (Bad Request) if the diseases is not valid,
     * or with status 500 (Internal Server Error) if the diseases couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/diseases")
    public ResponseEntity<Diseases> updateDiseases(@RequestBody Diseases diseases) throws URISyntaxException {
        log.debug("REST request to update Diseases : {}", diseases);
        if (diseases.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Diseases result = diseasesRepository.save(diseases);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, diseases.getId().toString()))
            .body(result);
    }

    /**
     * GET  /diseases : get all the diseases.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of diseases in body
     */
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.DOCTOR + "\")")
    @GetMapping("/diseases")
    public List<Diseases> getAllDiseases() {
        log.debug("REST request to get all Diseases");
        return diseasesRepository.findAll();
    }

    /**
     * GET  /diseases/:id : get the "id" diseases.
     *
     * @param id the id of the diseases to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the diseases, or with status 404 (Not Found)
     */
    @GetMapping("/diseases/{id}")
    public ResponseEntity<Diseases> getDiseases(@PathVariable Long id) {
        log.debug("REST request to get Diseases : {}", id);
        Optional<Diseases> diseases = diseasesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(diseases);
    }

    /**
     * DELETE  /diseases/:id : delete the "id" diseases.
     *
     * @param id the id of the diseases to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    @DeleteMapping("/diseases/{id}")
    public ResponseEntity<Void> deleteDiseases(@PathVariable Long id) {
        log.debug("REST request to delete Diseases : {}", id);
        diseasesRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
