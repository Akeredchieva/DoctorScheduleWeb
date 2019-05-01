import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPatientsMedicines } from 'app/shared/model/patients-medicines.model';
import { AccountService } from 'app/core';
import { PatientsMedicinesService } from './patients-medicines.service';

@Component({
    selector: 'jhi-patients-medicines',
    templateUrl: './patients-medicines.component.html'
})
export class PatientsMedicinesComponent implements OnInit, OnDestroy {
    patientsMedicines: IPatientsMedicines[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected patientsMedicinesService: PatientsMedicinesService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.patientsMedicinesService
            .query()
            .pipe(
                filter((res: HttpResponse<IPatientsMedicines[]>) => res.ok),
                map((res: HttpResponse<IPatientsMedicines[]>) => res.body)
            )
            .subscribe(
                (res: IPatientsMedicines[]) => {
                    this.patientsMedicines = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPatientsMedicines();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPatientsMedicines) {
        return item.id;
    }

    registerChangeInPatientsMedicines() {
        this.eventSubscriber = this.eventManager.subscribe('patientsMedicinesListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
