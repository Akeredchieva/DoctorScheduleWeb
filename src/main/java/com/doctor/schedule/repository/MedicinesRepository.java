package com.doctor.schedule.repository;

import com.doctor.schedule.domain.Medicines;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Medicines entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MedicinesRepository extends JpaRepository<Medicines, Long> {

}
