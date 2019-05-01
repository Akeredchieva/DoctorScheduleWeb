import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { ITimes } from 'app/shared/model/times.model';
import { TimesService } from './times.service';
import { IPatients } from 'app/shared/model/patients.model';
import { PatientsService } from 'app/entities/patients';
import { IDoctors } from 'app/shared/model/doctors.model';
import { DoctorsService } from 'app/entities/doctors';

@Component({
    selector: 'jhi-times-update',
    templateUrl: './times-update.component.html'
})
export class TimesUpdateComponent implements OnInit {
    times: ITimes;
    isSaving: boolean;

    patients: IPatients[];

    doctors: IDoctors[];
    dateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected timesService: TimesService,
        protected patientsService: PatientsService,
        protected doctorsService: DoctorsService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ times }) => {
            this.times = times;
        });
        this.patientsService
            .query({ filter: 'times-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IPatients[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPatients[]>) => response.body)
            )
            .subscribe(
                (res: IPatients[]) => {
                    if (!this.times.patient || !this.times.patient.id) {
                        this.patients = res;
                    } else {
                        this.patientsService
                            .find(this.times.patient.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IPatients>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IPatients>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IPatients) => (this.patients = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        this.doctorsService
            .query({ filter: 'times-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IDoctors[]>) => mayBeOk.ok),
                map((response: HttpResponse<IDoctors[]>) => response.body)
            )
            .subscribe(
                (res: IDoctors[]) => {
                    if (!this.times.doctor || !this.times.doctor.id) {
                        this.doctors = res;
                    } else {
                        this.doctorsService
                            .find(this.times.doctor.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IDoctors>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IDoctors>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IDoctors) => (this.doctors = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.times.id !== undefined) {
            this.subscribeToSaveResponse(this.timesService.update(this.times));
        } else {
            this.subscribeToSaveResponse(this.timesService.create(this.times));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITimes>>) {
        result.subscribe((res: HttpResponse<ITimes>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackPatientsById(index: number, item: IPatients) {
        return item.id;
    }

    trackDoctorsById(index: number, item: IDoctors) {
        return item.id;
    }
}
