import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPatientsMedicines } from 'app/shared/model/patients-medicines.model';

@Component({
    selector: 'jhi-patients-medicines-detail',
    templateUrl: './patients-medicines-detail.component.html'
})
export class PatientsMedicinesDetailComponent implements OnInit {
    patientsMedicines: IPatientsMedicines;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ patientsMedicines }) => {
            this.patientsMedicines = patientsMedicines;
        });
    }

    previousState() {
        window.history.back();
    }
}
