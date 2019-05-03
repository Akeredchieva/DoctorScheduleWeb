package com.doctor.schedule.web.rest;
import com.doctor.schedule.domain.Doctors;
import com.doctor.schedule.repository.DoctorsRepository;
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
 * REST controller for managing Doctors.
 */
@RestController
@RequestMapping("/api")
public class DoctorsResource {

    private final Logger log = LoggerFactory.getLogger(DoctorsResource.class);

    private static final String ENTITY_NAME = "doctors";

    private final DoctorsRepository doctorsRepository;

    public DoctorsResource(DoctorsRepository doctorsRepository) {
        this.doctorsRepository = doctorsRepository;
    }

    /**
     * POST  /doctors : Create a new doctors.
     *
     * @param doctors the doctors to create
     * @return the ResponseEntity with status 201 (Created) and with body the new doctors, or with status 400 (Bad Request) if the doctors has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.DOCTOR + "\") or hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    @PostMapping("/doctors")
    public ResponseEntity<Doctors> createDoctors(@RequestBody Doctors doctors) throws URISyntaxException {
        log.debug("REST request to save Doctors : {}", doctors);
        if (doctors.getId() != null) {
            throw new BadRequestAlertException("A new doctors cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Doctors result = doctorsRepository.save(doctors);
        return ResponseEntity.created(new URI("/api/doctors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /doctors : Updates an existing doctors.
     *
     * @param doctors the doctors to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated doctors,
     * or with status 400 (Bad Request) if the doctors is not valid,
     * or with status 500 (Internal Server Error) if the doctors couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.DOCTOR + "\") or hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    @PutMapping("/doctors")
    public ResponseEntity<Doctors> updateDoctors(@RequestBody Doctors doctors) throws URISyntaxException {
        log.debug("REST request to update Doctors : {}", doctors);
        if (doctors.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Doctors result = doctorsRepository.save(doctors);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, doctors.getId().toString()))
            .body(result);
    }

    /**
     * GET  /doctors : get all the doctors.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of doctors in body
     */
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.DOCTOR + "\") or hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    @GetMapping("/doctors")
    public List<Doctors> getAllDoctors(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Doctors");
        return doctorsRepository.findAllWithEagerRelationships();
    }

    /**
     * GET  /doctors/:id : get the "id" doctors.
     *
     * @param id the id of the doctors to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the doctors, or with status 404 (Not Found)
     */
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.DOCTOR + "\") or hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    @GetMapping("/doctors/{id}")
    public ResponseEntity<Doctors> getDoctors(@PathVariable Long id) {
        log.debug("REST request to get Doctors : {}", id);
        Optional<Doctors> doctors = doctorsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(doctors);
    }

    /**
     * DELETE  /doctors/:id : delete the "id" doctors.
     *
     * @param id the id of the doctors to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctors(@PathVariable Long id) {
        log.debug("REST request to delete Doctors : {}", id);
        doctorsRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
