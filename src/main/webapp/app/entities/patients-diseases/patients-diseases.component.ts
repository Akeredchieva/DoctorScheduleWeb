import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPatientsDiseases } from 'app/shared/model/patients-diseases.model';
import { AccountService } from 'app/core';
import { PatientsDiseasesService } from './patients-diseases.service';

@Component({
    selector: 'jhi-patients-diseases',
    templateUrl: './patients-diseases.component.html'
})
export class PatientsDiseasesComponent implements OnInit, OnDestroy {
    patientsDiseases: IPatientsDiseases[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected patientsDiseasesService: PatientsDiseasesService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.patientsDiseasesService
            .query()
            .pipe(
                filter((res: HttpResponse<IPatientsDiseases[]>) => res.ok),
                map((res: HttpResponse<IPatientsDiseases[]>) => res.body)
            )
            .subscribe(
                (res: IPatientsDiseases[]) => {
                    this.patientsDiseases = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPatientsDiseases();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPatientsDiseases) {
        return item.id;
    }

    registerChangeInPatientsDiseases() {
        this.eventSubscriber = this.eventManager.subscribe('patientsDiseasesListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
