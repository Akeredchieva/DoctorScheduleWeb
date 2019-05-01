import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDoctors } from 'app/shared/model/doctors.model';

@Component({
    selector: 'jhi-doctors-detail',
    templateUrl: './doctors-detail.component.html'
})
export class DoctorsDetailComponent implements OnInit {
    doctors: IDoctors;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ doctors }) => {
            this.doctors = doctors;
        });
    }

    previousState() {
        window.history.back();
    }
}
