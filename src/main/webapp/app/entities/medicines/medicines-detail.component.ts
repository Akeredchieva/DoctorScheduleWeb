import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMedicines } from 'app/shared/model/medicines.model';

@Component({
    selector: 'jhi-medicines-detail',
    templateUrl: './medicines-detail.component.html'
})
export class MedicinesDetailComponent implements OnInit {
    medicines: IMedicines;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ medicines }) => {
            this.medicines = medicines;
        });
    }

    previousState() {
        window.history.back();
    }
}
