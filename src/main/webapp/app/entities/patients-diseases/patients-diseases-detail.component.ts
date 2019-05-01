import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPatientsDiseases } from 'app/shared/model/patients-diseases.model';

@Component({
    selector: 'jhi-patients-diseases-detail',
    templateUrl: './patients-diseases-detail.component.html'
})
export class PatientsDiseasesDetailComponent implements OnInit {
    patientsDiseases: IPatientsDiseases;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ patientsDiseases }) => {
            this.patientsDiseases = patientsDiseases;
        });
    }

    previousState() {
        window.history.back();
    }
}
