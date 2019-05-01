import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypesOfDoctor } from 'app/shared/model/types-of-doctor.model';

@Component({
    selector: 'jhi-types-of-doctor-detail',
    templateUrl: './types-of-doctor-detail.component.html'
})
export class TypesOfDoctorDetailComponent implements OnInit {
    typesOfDoctor: ITypesOfDoctor;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ typesOfDoctor }) => {
            this.typesOfDoctor = typesOfDoctor;
        });
    }

    previousState() {
        window.history.back();
    }
}
