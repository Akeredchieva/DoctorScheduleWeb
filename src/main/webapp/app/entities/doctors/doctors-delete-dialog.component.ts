import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDoctors } from 'app/shared/model/doctors.model';
import { DoctorsService } from './doctors.service';

@Component({
    selector: 'jhi-doctors-delete-dialog',
    templateUrl: './doctors-delete-dialog.component.html'
})
export class DoctorsDeleteDialogComponent {
    doctors: IDoctors;

    constructor(protected doctorsService: DoctorsService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.doctorsService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'doctorsListModification',
                content: 'Deleted an doctors'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-doctors-delete-popup',
    template: ''
})
export class DoctorsDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ doctors }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(DoctorsDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.doctors = doctors;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/doctors', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/doctors', { outlets: { popup: null } }]);
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
