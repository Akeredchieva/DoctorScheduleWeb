package com.doctor.schedule.repository;

import com.doctor.schedule.domain.PatientsMedicines;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the PatientsMedicines entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PatientsMedicinesRepository extends JpaRepository<PatientsMedicines, Long> {

}
