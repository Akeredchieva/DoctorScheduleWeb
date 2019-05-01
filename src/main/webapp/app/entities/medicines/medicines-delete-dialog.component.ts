import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMedicines } from 'app/shared/model/medicines.model';
import { MedicinesService } from './medicines.service';

@Component({
    selector: 'jhi-medicines-delete-dialog',
    templateUrl: './medicines-delete-dialog.component.html'
})
export class MedicinesDeleteDialogComponent {
    medicines: IMedicines;

    constructor(
        protected medicinesService: MedicinesService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.medicinesService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'medicinesListModification',
                content: 'Deleted an medicines'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-medicines-delete-popup',
    template: ''
})
export class MedicinesDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ medicines }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(MedicinesDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.medicines = medicines;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/medicines', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/medicines', { outlets: { popup: null } }]);
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
