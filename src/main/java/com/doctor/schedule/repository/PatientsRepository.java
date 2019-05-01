package com.doctor.schedule.repository;

import com.doctor.schedule.domain.Patients;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Patients entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PatientsRepository extends JpaRepository<Patients, Long> {

    @Query("select patients from Patients patients where patients.user.login = ?#{principal.username}")
    List<Patients> findByUserIsCurrentUser();

}
