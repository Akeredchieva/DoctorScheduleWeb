package com.doctor.schedule.repository;

import com.doctor.schedule.domain.Doctors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Doctors entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DoctorsRepository extends JpaRepository<Doctors, Long> {

    @Query("select doctors from Doctors doctors where doctors.user.login = ?#{principal.username}")
    List<Doctors> findByUserIsCurrentUser();

    @Query(value = "select distinct doctors from Doctors doctors left join fetch doctors.patients",
        countQuery = "select count(distinct doctors) from Doctors doctors")
    Page<Doctors> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct doctors from Doctors doctors left join fetch doctors.patients")
    List<Doctors> findAllWithEagerRelationships();

    @Query("select doctors from Doctors doctors left join fetch doctors.patients where doctors.id =:id")
    Optional<Doctors> findOneWithEagerRelationships(@Param("id") Long id);

}
