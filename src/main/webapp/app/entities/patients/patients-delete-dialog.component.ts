import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPatients } from 'app/shared/model/patients.model';
import { PatientsService } from './patients.service';

@Component({
    selector: 'jhi-patients-delete-dialog',
    templateUrl: './patients-delete-dialog.component.html'
})
export class PatientsDeleteDialogComponent {
    patients: IPatients;

    constructor(protected patientsService: PatientsService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.patientsService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'patientsListModification',
                content: 'Deleted an patients'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-patients-delete-popup',
    template: ''
})
export class PatientsDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ patients }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PatientsDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.patients = patients;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/patients', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/patients', { outlets: { popup: null } }]);
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
