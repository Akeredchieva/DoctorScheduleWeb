import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPatients } from 'app/shared/model/patients.model';
import { PatientsService } from './patients.service';
import { IUser, UserService } from 'app/core';
import { IDoctors } from 'app/shared/model/doctors.model';
import { DoctorsService } from 'app/entities/doctors';

@Component({
    selector: 'jhi-patients-update',
    templateUrl: './patients-update.component.html'
})
export class PatientsUpdateComponent implements OnInit {
    patients: IPatients;
    isSaving: boolean;

    users: IUser[];

    doctors: IDoctors[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected patientsService: PatientsService,
        protected userService: UserService,
        protected doctorsService: DoctorsService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ patients }) => {
            this.patients = patients;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
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
        if (this.patients.id !== undefined) {
            this.subscribeToSaveResponse(this.patientsService.update(this.patients));
        } else {
            this.subscribeToSaveResponse(this.patientsService.create(this.patients));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatients>>) {
        result.subscribe((res: HttpResponse<IPatients>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackDoctorsById(index: number, item: IDoctors) {
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
