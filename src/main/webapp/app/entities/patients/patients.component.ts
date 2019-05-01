import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPatients } from 'app/shared/model/patients.model';
import { AccountService } from 'app/core';
import { PatientsService } from './patients.service';

@Component({
    selector: 'jhi-patients',
    templateUrl: './patients.component.html'
})
export class PatientsComponent implements OnInit, OnDestroy {
    patients: IPatients[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected patientsService: PatientsService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.patientsService
            .query()
            .pipe(
                filter((res: HttpResponse<IPatients[]>) => res.ok),
                map((res: HttpResponse<IPatients[]>) => res.body)
            )
            .subscribe(
                (res: IPatients[]) => {
                    this.patients = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPatients();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPatients) {
        return item.id;
    }

    registerChangeInPatients() {
        this.eventSubscriber = this.eventManager.subscribe('patientsListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
