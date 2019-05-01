import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMedicines } from 'app/shared/model/medicines.model';
import { AccountService } from 'app/core';
import { MedicinesService } from './medicines.service';

@Component({
    selector: 'jhi-medicines',
    templateUrl: './medicines.component.html'
})
export class MedicinesComponent implements OnInit, OnDestroy {
    medicines: IMedicines[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected medicinesService: MedicinesService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.medicinesService
            .query()
            .pipe(
                filter((res: HttpResponse<IMedicines[]>) => res.ok),
                map((res: HttpResponse<IMedicines[]>) => res.body)
            )
            .subscribe(
                (res: IMedicines[]) => {
                    this.medicines = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInMedicines();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IMedicines) {
        return item.id;
    }

    registerChangeInMedicines() {
        this.eventSubscriber = this.eventManager.subscribe('medicinesListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
