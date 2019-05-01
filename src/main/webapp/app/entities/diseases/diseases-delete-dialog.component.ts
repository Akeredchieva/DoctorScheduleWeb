import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDiseases } from 'app/shared/model/diseases.model';
import { DiseasesService } from './diseases.service';

@Component({
    selector: 'jhi-diseases-delete-dialog',
    templateUrl: './diseases-delete-dialog.component.html'
})
export class DiseasesDeleteDialogComponent {
    diseases: IDiseases;

    constructor(protected diseasesService: DiseasesService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.diseasesService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'diseasesListModification',
                content: 'Deleted an diseases'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-diseases-delete-popup',
    template: ''
})
export class DiseasesDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ diseases }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(DiseasesDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.diseases = diseases;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/diseases', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/diseases', { outlets: { popup: null } }]);
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
