package com.doctor.schedule.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A TypesOfDoctor.
 */
@Entity
@Table(name = "types_of_doctor")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class TypesOfDoctor implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "specialist")
    private String specialist;

    @ManyToOne
    @JsonIgnoreProperties("typeOfDoctors")
    private Doctors doctors;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSpecialist() {
        return specialist;
    }

    public TypesOfDoctor specialist(String specialist) {
        this.specialist = specialist;
        return this;
    }

    public void setSpecialist(String specialist) {
        this.specialist = specialist;
    }

    public Doctors getDoctors() {
        return doctors;
    }

    public TypesOfDoctor doctors(Doctors doctors) {
        this.doctors = doctors;
        return this;
    }

    public void setDoctors(Doctors doctors) {
        this.doctors = doctors;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TypesOfDoctor typesOfDoctor = (TypesOfDoctor) o;
        if (typesOfDoctor.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), typesOfDoctor.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TypesOfDoctor{" +
            "id=" + getId() +
            ", specialist='" + getSpecialist() + "'" +
            "}";
    }
}
