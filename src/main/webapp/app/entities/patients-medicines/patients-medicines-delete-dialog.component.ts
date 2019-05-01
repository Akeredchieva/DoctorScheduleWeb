import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPatientsMedicines } from 'app/shared/model/patients-medicines.model';
import { PatientsMedicinesService } from './patients-medicines.service';

@Component({
    selector: 'jhi-patients-medicines-delete-dialog',
    templateUrl: './patients-medicines-delete-dialog.component.html'
})
export class PatientsMedicinesDeleteDialogComponent {
    patientsMedicines: IPatientsMedicines;

    constructor(
        protected patientsMedicinesService: PatientsMedicinesService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.patientsMedicinesService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'patientsMedicinesListModification',
                content: 'Deleted an patientsMedicines'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-patients-medicines-delete-popup',
    template: ''
})
export class PatientsMedicinesDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ patientsMedicines }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PatientsMedicinesDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.patientsMedicines = patientsMedicines;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/patients-medicines', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/patients-medicines', { outlets: { popup: null } }]);
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
