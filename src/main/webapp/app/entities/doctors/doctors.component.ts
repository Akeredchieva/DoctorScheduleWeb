import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IDoctors } from 'app/shared/model/doctors.model';
import { AccountService } from 'app/core';
import { DoctorsService } from './doctors.service';

@Component({
    selector: 'jhi-doctors',
    templateUrl: './doctors.component.html'
})
export class DoctorsComponent implements OnInit, OnDestroy {
    doctors: IDoctors[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected doctorsService: DoctorsService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.doctorsService
            .query()
            .pipe(
                filter((res: HttpResponse<IDoctors[]>) => res.ok),
                map((res: HttpResponse<IDoctors[]>) => res.body)
            )
            .subscribe(
                (res: IDoctors[]) => {
                    this.doctors = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInDoctors();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IDoctors) {
        return item.id;
    }

    registerChangeInDoctors() {
        this.eventSubscriber = this.eventManager.subscribe('doctorsListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
