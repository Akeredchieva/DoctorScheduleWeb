package com.doctor.schedule.web.rest;
import com.doctor.schedule.domain.TypesOfDoctor;
import com.doctor.schedule.repository.TypesOfDoctorRepository;
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
 * REST controller for managing TypesOfDoctor.
 */
@RestController
@RequestMapping("/api")
public class TypesOfDoctorResource {

    private final Logger log = LoggerFactory.getLogger(TypesOfDoctorResource.class);

    private static final String ENTITY_NAME = "typesOfDoctor";

    private final TypesOfDoctorRepository typesOfDoctorRepository;

    public TypesOfDoctorResource(TypesOfDoctorRepository typesOfDoctorRepository) {
        this.typesOfDoctorRepository = typesOfDoctorRepository;
    }

    /**
     * POST  /types-of-doctors : Create a new typesOfDoctor.
     *
     * @param typesOfDoctor the typesOfDoctor to create
     * @return the ResponseEntity with status 201 (Created) and with body the new typesOfDoctor, or with status 400 (Bad Request) if the typesOfDoctor has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/types-of-doctors")
    public ResponseEntity<TypesOfDoctor> createTypesOfDoctor(@RequestBody TypesOfDoctor typesOfDoctor) throws URISyntaxException {
        log.debug("REST request to save TypesOfDoctor : {}", typesOfDoctor);
        if (typesOfDoctor.getId() != null) {
            throw new BadRequestAlertException("A new typesOfDoctor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypesOfDoctor result = typesOfDoctorRepository.save(typesOfDoctor);
        return ResponseEntity.created(new URI("/api/types-of-doctors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /types-of-doctors : Updates an existing typesOfDoctor.
     *
     * @param typesOfDoctor the typesOfDoctor to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated typesOfDoctor,
     * or with status 400 (Bad Request) if the typesOfDoctor is not valid,
     * or with status 500 (Internal Server Error) if the typesOfDoctor couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/types-of-doctors")
    public ResponseEntity<TypesOfDoctor> updateTypesOfDoctor(@RequestBody TypesOfDoctor typesOfDoctor) throws URISyntaxException {
        log.debug("REST request to update TypesOfDoctor : {}", typesOfDoctor);
        if (typesOfDoctor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TypesOfDoctor result = typesOfDoctorRepository.save(typesOfDoctor);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, typesOfDoctor.getId().toString()))
            .body(result);
    }

    /**
     * GET  /types-of-doctors : get all the typesOfDoctors.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of typesOfDoctors in body
     */
    @GetMapping("/types-of-doctors")
    public List<TypesOfDoctor> getAllTypesOfDoctors() {
        log.debug("REST request to get all TypesOfDoctors");
        return typesOfDoctorRepository.findAll();
    }

    /**
     * GET  /types-of-doctors/:id : get the "id" typesOfDoctor.
     *
     * @param id the id of the typesOfDoctor to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the typesOfDoctor, or with status 404 (Not Found)
     */
    @GetMapping("/types-of-doctors/{id}")
    public ResponseEntity<TypesOfDoctor> getTypesOfDoctor(@PathVariable Long id) {
        log.debug("REST request to get TypesOfDoctor : {}", id);
        Optional<TypesOfDoctor> typesOfDoctor = typesOfDoctorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(typesOfDoctor);
    }

    /**
     * DELETE  /types-of-doctors/:id : delete the "id" typesOfDoctor.
     *
     * @param id the id of the typesOfDoctor to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/types-of-doctors/{id}")
    public ResponseEntity<Void> deleteTypesOfDoctor(@PathVariable Long id) {
        log.debug("REST request to delete TypesOfDoctor : {}", id);
        typesOfDoctorRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
