import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPatients } from 'app/shared/model/patients.model';

@Component({
    selector: 'jhi-patients-detail',
    templateUrl: './patients-detail.component.html'
})
export class PatientsDetailComponent implements OnInit {
    patients: IPatients;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ patients }) => {
            this.patients = patients;
        });
    }

    previousState() {
        window.history.back();
    }
}
