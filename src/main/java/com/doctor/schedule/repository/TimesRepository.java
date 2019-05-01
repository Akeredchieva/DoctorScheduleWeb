package com.doctor.schedule.repository;

import com.doctor.schedule.domain.Times;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Times entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TimesRepository extends JpaRepository<Times, Long> {

}
