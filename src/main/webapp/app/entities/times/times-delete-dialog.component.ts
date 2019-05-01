import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITimes } from 'app/shared/model/times.model';
import { TimesService } from './times.service';

@Component({
    selector: 'jhi-times-delete-dialog',
    templateUrl: './times-delete-dialog.component.html'
})
export class TimesDeleteDialogComponent {
    times: ITimes;

    constructor(protected timesService: TimesService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.timesService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'timesListModification',
                content: 'Deleted an times'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-times-delete-popup',
    template: ''
})
export class TimesDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ times }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TimesDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.times = times;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/times', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/times', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
