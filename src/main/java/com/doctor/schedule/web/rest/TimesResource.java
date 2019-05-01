package com.doctor.schedule.web.rest;
import com.doctor.schedule.domain.Times;
import com.doctor.schedule.repository.TimesRepository;
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
 * REST controller for managing Times.
 */
@RestController
@RequestMapping("/api")
public class TimesResource {

    private final Logger log = LoggerFactory.getLogger(TimesResource.class);

    private static final String ENTITY_NAME = "times";

    private final TimesRepository timesRepository;

    public TimesResource(TimesRepository timesRepository) {
        this.timesRepository = timesRepository;
    }

    /**
     * POST  /times : Create a new times.
     *
     * @param times the times to create
     * @return the ResponseEntity with status 201 (Created) and with body the new times, or with status 400 (Bad Request) if the times has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/times")
    public ResponseEntity<Times> createTimes(@RequestBody Times times) throws URISyntaxException {
        log.debug("REST request to save Times : {}", times);
        if (times.getId() != null) {
            throw new BadRequestAlertException("A new times cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Times result = timesRepository.save(times);
        return ResponseEntity.created(new URI("/api/times/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /times : Updates an existing times.
     *
     * @param times the times to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated times,
     * or with status 400 (Bad Request) if the times is not valid,
     * or with status 500 (Internal Server Error) if the times couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/times")
    public ResponseEntity<Times> updateTimes(@RequestBody Times times) throws URISyntaxException {
        log.debug("REST request to update Times : {}", times);
        if (times.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Times result = timesRepository.save(times);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, times.getId().toString()))
            .body(result);
    }

    /**
     * GET  /times : get all the times.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of times in body
     */
    @GetMapping("/times")
    public List<Times> getAllTimes() {
        log.debug("REST request to get all Times");
        return timesRepository.findAll();
    }

    /**
     * GET  /times/:id : get the "id" times.
     *
     * @param id the id of the times to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the times, or with status 404 (Not Found)
     */
    @GetMapping("/times/{id}")
    public ResponseEntity<Times> getTimes(@PathVariable Long id) {
        log.debug("REST request to get Times : {}", id);
        Optional<Times> times = timesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(times);
    }

    /**
     * DELETE  /times/:id : delete the "id" times.
     *
     * @param id the id of the times to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/times/{id}")
    public ResponseEntity<Void> deleteTimes(@PathVariable Long id) {
        log.debug("REST request to delete Times : {}", id);
        timesRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
