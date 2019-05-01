package com.doctor.schedule.repository;

import com.doctor.schedule.domain.TypesOfDoctor;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TypesOfDoctor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypesOfDoctorRepository extends JpaRepository<TypesOfDoctor, Long> {

}
