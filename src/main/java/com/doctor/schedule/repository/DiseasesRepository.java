package com.doctor.schedule.repository;

import com.doctor.schedule.domain.Diseases;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Diseases entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DiseasesRepository extends JpaRepository<Diseases, Long> {

}
