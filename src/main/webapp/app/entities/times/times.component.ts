import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITimes } from 'app/shared/model/times.model';
import { AccountService } from 'app/core';
import { TimesService } from './times.service';

@Component({
    selector: 'jhi-times',
    templateUrl: './times.component.html'
})
export class TimesComponent implements OnInit, OnDestroy {
    times: ITimes[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected timesService: TimesService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.timesService
            .query()
            .pipe(
                filter((res: HttpResponse<ITimes[]>) => res.ok),
                map((res: HttpResponse<ITimes[]>) => res.body)
            )
            .subscribe(
                (res: ITimes[]) => {
                    this.times = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTimes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITimes) {
        return item.id;
    }

    registerChangeInTimes() {
        this.eventSubscriber = this.eventManager.subscribe('timesListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
