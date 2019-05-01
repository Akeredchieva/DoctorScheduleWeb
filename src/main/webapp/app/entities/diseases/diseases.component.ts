import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IDiseases } from 'app/shared/model/diseases.model';
import { AccountService } from 'app/core';
import { DiseasesService } from './diseases.service';

@Component({
    selector: 'jhi-diseases',
    templateUrl: './diseases.component.html'
})
export class DiseasesComponent implements OnInit, OnDestroy {
    diseases: IDiseases[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected diseasesService: DiseasesService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.diseasesService
            .query()
            .pipe(
                filter((res: HttpResponse<IDiseases[]>) => res.ok),
                map((res: HttpResponse<IDiseases[]>) => res.body)
            )
            .subscribe(
                (res: IDiseases[]) => {
                    this.diseases = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInDiseases();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IDiseases) {
        return item.id;
    }

    registerChangeInDiseases() {
        this.eventSubscriber = this.eventManager.subscribe('diseasesListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
