import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'diseases',
                loadChildren: './diseases/diseases.module#DoctorScheduleDiseasesModule'
            },
            {
                path: 'patients',
                loadChildren: './patients/patients.module#DoctorSchedulePatientsModule'
            },
            {
                path: 'doctors',
                loadChildren: './doctors/doctors.module#DoctorScheduleDoctorsModule'
            },
            {
                path: 'times',
                loadChildren: './times/times.module#DoctorScheduleTimesModule'
            },
            {
                path: 'patients-medicines',
                loadChildren: './patients-medicines/patients-medicines.module#DoctorSchedulePatientsMedicinesModule'
            },
            {
                path: 'patients-diseases',
                loadChildren: './patients-diseases/patients-diseases.module#DoctorSchedulePatientsDiseasesModule'
            },
            {
                path: 'medicines',
                loadChildren: './medicines/medicines.module#DoctorScheduleMedicinesModule'
            },
            {
                path: 'types-of-doctor',
                loadChildren: './types-of-doctor/types-of-doctor.module#DoctorScheduleTypesOfDoctorModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorScheduleEntityModule {}
