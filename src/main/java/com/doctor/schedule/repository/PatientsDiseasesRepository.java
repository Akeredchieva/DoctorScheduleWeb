package com.doctor.schedule.repository;

import com.doctor.schedule.domain.PatientsDiseases;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the PatientsDiseases entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PatientsDiseasesRepository extends JpaRepository<PatientsDiseases, Long> {

}
