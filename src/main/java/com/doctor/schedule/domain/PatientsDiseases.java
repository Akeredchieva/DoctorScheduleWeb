package com.doctor.schedule.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A PatientsDiseases.
 */
@Entity
@Table(name = "patients_diseases")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class PatientsDiseases implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description")
    private String description;

    @OneToOne
    @JoinColumn(unique = true)
    private Patients patient;

    @OneToOne
    @JoinColumn(unique = true)
    private Diseases diseases;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public PatientsDiseases description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Patients getPatient() {
        return patient;
    }

    public PatientsDiseases patient(Patients patients) {
        this.patient = patients;
        return this;
    }

    public void setPatient(Patients patients) {
        this.patient = patients;
    }

    public Diseases getDiseases() {
        return diseases;
    }

    public PatientsDiseases diseases(Diseases diseases) {
        this.diseases = diseases;
        return this;
    }

    public void setDiseases(Diseases diseases) {
        this.diseases = diseases;
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
        PatientsDiseases patientsDiseases = (PatientsDiseases) o;
        if (patientsDiseases.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), patientsDiseases.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PatientsDiseases{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
