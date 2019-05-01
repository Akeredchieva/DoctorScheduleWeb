import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDoctors } from 'app/shared/model/doctors.model';
import { DoctorsService } from './doctors.service';
import { IUser, UserService } from 'app/core';
import { IPatients } from 'app/shared/model/patients.model';
import { PatientsService } from 'app/entities/patients';

@Component({
    selector: 'jhi-doctors-update',
    templateUrl: './doctors-update.component.html'
})
export class DoctorsUpdateComponent implements OnInit {
    doctors: IDoctors;
    isSaving: boolean;

    users: IUser[];

    patients: IPatients[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected doctorsService: DoctorsService,
        protected userService: UserService,
        protected patientsService: PatientsService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ doctors }) => {
            this.doctors = doctors;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.patientsService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IPatients[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPatients[]>) => response.body)
            )
            .subscribe((res: IPatients[]) => (this.patients = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.doctors.id !== undefined) {
            this.subscribeToSaveResponse(this.doctorsService.update(this.doctors));
        } else {
            this.subscribeToSaveResponse(this.doctorsService.create(this.doctors));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IDoctors>>) {
        result.subscribe((res: HttpResponse<IDoctors>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    trackPatientsById(index: number, item: IPatients) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
