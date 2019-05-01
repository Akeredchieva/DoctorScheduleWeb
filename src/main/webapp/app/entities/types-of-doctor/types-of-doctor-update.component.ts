import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ITypesOfDoctor } from 'app/shared/model/types-of-doctor.model';
import { TypesOfDoctorService } from './types-of-doctor.service';
import { IDoctors } from 'app/shared/model/doctors.model';
import { DoctorsService } from 'app/entities/doctors';

@Component({
    selector: 'jhi-types-of-doctor-update',
    templateUrl: './types-of-doctor-update.component.html'
})
export class TypesOfDoctorUpdateComponent implements OnInit {
    typesOfDoctor: ITypesOfDoctor;
    isSaving: boolean;

    doctors: IDoctors[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected typesOfDoctorService: TypesOfDoctorService,
        protected doctorsService: DoctorsService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ typesOfDoctor }) => {
            this.typesOfDoctor = typesOfDoctor;
        });
        this.doctorsService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IDoctors[]>) => mayBeOk.ok),
                map((response: HttpResponse<IDoctors[]>) => response.body)
            )
            .subscribe((res: IDoctors[]) => (this.doctors = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.typesOfDoctor.id !== undefined) {
            this.subscribeToSaveResponse(this.typesOfDoctorService.update(this.typesOfDoctor));
        } else {
            this.subscribeToSaveResponse(this.typesOfDoctorService.create(this.typesOfDoctor));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypesOfDoctor>>) {
        result.subscribe((res: HttpResponse<ITypesOfDoctor>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackDoctorsById(index: number, item: IDoctors) {
        return item.id;
    }
}
