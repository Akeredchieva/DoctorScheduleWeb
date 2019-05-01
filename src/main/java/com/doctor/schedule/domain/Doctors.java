package com.doctor.schedule.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Doctors.
 */
@Entity
@Table(name = "doctors")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Doctors implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @OneToMany(mappedBy = "doctors")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<TypesOfDoctor> typeOfDoctors = new HashSet<>();
    @ManyToOne
    @JsonIgnoreProperties("doctors")
    private User user;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "doctors_patients",
               joinColumns = @JoinColumn(name = "doctors_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "patients_id", referencedColumnName = "id"))
    private Set<Patients> patients = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public Doctors firstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public Doctors lastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public Doctors email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public Doctors phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<TypesOfDoctor> getTypeOfDoctors() {
        return typeOfDoctors;
    }

    public Doctors typeOfDoctors(Set<TypesOfDoctor> typesOfDoctors) {
        this.typeOfDoctors = typesOfDoctors;
        return this;
    }

    public Doctors addTypeOfDoctor(TypesOfDoctor typesOfDoctor) {
        this.typeOfDoctors.add(typesOfDoctor);
        typesOfDoctor.setDoctors(this);
        return this;
    }

    public Doctors removeTypeOfDoctor(TypesOfDoctor typesOfDoctor) {
        this.typeOfDoctors.remove(typesOfDoctor);
        typesOfDoctor.setDoctors(null);
        return this;
    }

    public void setTypeOfDoctors(Set<TypesOfDoctor> typesOfDoctors) {
        this.typeOfDoctors = typesOfDoctors;
    }

    public User getUser() {
        return user;
    }

    public Doctors user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Patients> getPatients() {
        return patients;
    }

    public Doctors patients(Set<Patients> patients) {
        this.patients = patients;
        return this;
    }

    public Doctors addPatients(Patients patients) {
        this.patients.add(patients);
        patients.getDoctors().add(this);
        return this;
    }

    public Doctors removePatients(Patients patients) {
        this.patients.remove(patients);
        patients.getDoctors().remove(this);
        return this;
    }

    public void setPatients(Set<Patients> patients) {
        this.patients = patients;
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
        Doctors doctors = (Doctors) o;
        if (doctors.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), doctors.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Doctors{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            "}";
    }
}
