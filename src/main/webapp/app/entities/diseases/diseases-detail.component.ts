import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDiseases } from 'app/shared/model/diseases.model';

@Component({
    selector: 'jhi-diseases-detail',
    templateUrl: './diseases-detail.component.html'
})
export class DiseasesDetailComponent implements OnInit {
    diseases: IDiseases;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ diseases }) => {
            this.diseases = diseases;
        });
    }

    previousState() {
        window.history.back();
    }
}
