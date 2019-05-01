import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITypesOfDoctor } from 'app/shared/model/types-of-doctor.model';
import { TypesOfDoctorService } from './types-of-doctor.service';

@Component({
    selector: 'jhi-types-of-doctor-delete-dialog',
    templateUrl: './types-of-doctor-delete-dialog.component.html'
})
export class TypesOfDoctorDeleteDialogComponent {
    typesOfDoctor: ITypesOfDoctor;

    constructor(
        protected typesOfDoctorService: TypesOfDoctorService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.typesOfDoctorService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'typesOfDoctorListModification',
                content: 'Deleted an typesOfDoctor'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-types-of-doctor-delete-popup',
    template: ''
})
export class TypesOfDoctorDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ typesOfDoctor }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TypesOfDoctorDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.typesOfDoctor = typesOfDoctor;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/types-of-doctor', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/types-of-doctor', { outlets: { popup: null } }]);
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
