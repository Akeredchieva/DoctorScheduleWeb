package com.doctor.schedule.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Times.
 */
@Entity
@Table(name = "times")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Times implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jhi_date")
    private LocalDate date;

    @OneToOne
    @JoinColumn(unique = true)
    private Patients patient;

    @OneToOne
    @JoinColumn(unique = true)
    private Doctors doctor;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public Times date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Patients getPatient() {
        return patient;
    }

    public Times patient(Patients patients) {
        this.patient = patients;
        return this;
    }

    public void setPatient(Patients patients) {
        this.patient = patients;
    }

    public Doctors getDoctor() {
        return doctor;
    }

    public Times doctor(Doctors doctors) {
        this.doctor = doctors;
        return this;
    }

    public void setDoctor(Doctors doctors) {
        this.doctor = doctors;
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
        Times times = (Times) o;
        if (times.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), times.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Times{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
