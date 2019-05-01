import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITimes } from 'app/shared/model/times.model';

@Component({
    selector: 'jhi-times-detail',
    templateUrl: './times-detail.component.html'
})
export class TimesDetailComponent implements OnInit {
    times: ITimes;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ times }) => {
            this.times = times;
        });
    }

    previousState() {
        window.history.back();
    }
}
