import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPatientsDiseases } from 'app/shared/model/patients-diseases.model';
import { PatientsDiseasesService } from './patients-diseases.service';

@Component({
    selector: 'jhi-patients-diseases-delete-dialog',
    templateUrl: './patients-diseases-delete-dialog.component.html'
})
export class PatientsDiseasesDeleteDialogComponent {
    patientsDiseases: IPatientsDiseases;

    constructor(
        protected patientsDiseasesService: PatientsDiseasesService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.patientsDiseasesService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'patientsDiseasesListModification',
                content: 'Deleted an patientsDiseases'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-patients-diseases-delete-popup',
    template: ''
})
export class PatientsDiseasesDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ patientsDiseases }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PatientsDiseasesDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.patientsDiseases = patientsDiseases;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/patients-diseases', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/patients-diseases', { outlets: { popup: null } }]);
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
