import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITypesOfDoctor } from 'app/shared/model/types-of-doctor.model';
import { AccountService } from 'app/core';
import { TypesOfDoctorService } from './types-of-doctor.service';

@Component({
    selector: 'jhi-types-of-doctor',
    templateUrl: './types-of-doctor.component.html'
})
export class TypesOfDoctorComponent implements OnInit, OnDestroy {
    typesOfDoctors: ITypesOfDoctor[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected typesOfDoctorService: TypesOfDoctorService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.typesOfDoctorService
            .query()
            .pipe(
                filter((res: HttpResponse<ITypesOfDoctor[]>) => res.ok),
                map((res: HttpResponse<ITypesOfDoctor[]>) => res.body)
            )
            .subscribe(
                (res: ITypesOfDoctor[]) => {
                    this.typesOfDoctors = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTypesOfDoctors();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITypesOfDoctor) {
        return item.id;
    }

    registerChangeInTypesOfDoctors() {
        this.eventSubscriber = this.eventManager.subscribe('typesOfDoctorListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
