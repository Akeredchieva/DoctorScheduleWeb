import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IPatientsMedicines } from 'app/shared/model/patients-medicines.model';
import { PatientsMedicinesService } from './patients-medicines.service';
import { IPatients } from 'app/shared/model/patients.model';
import { PatientsService } from 'app/entities/patients';
import { IMedicines } from 'app/shared/model/medicines.model';
import { MedicinesService } from 'app/entities/medicines';

@Component({
    selector: 'jhi-patients-medicines-update',
    templateUrl: './patients-medicines-update.component.html'
})
export class PatientsMedicinesUpdateComponent implements OnInit {
    patientsMedicines: IPatientsMedicines;
    isSaving: boolean;

    patients: IPatients[];

    medicines: IMedicines[];
    startDateDp: any;
    endDateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected patientsMedicinesService: PatientsMedicinesService,
        protected patientsService: PatientsService,
        protected medicinesService: MedicinesService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ patientsMedicines }) => {
            this.patientsMedicines = patientsMedicines;
        });
        this.patientsService
            .query({ filter: 'patientsmedicines-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IPatients[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPatients[]>) => response.body)
            )
            .subscribe(
                (res: IPatients[]) => {
                    if (!this.patientsMedicines.patient || !this.patientsMedicines.patient.id) {
                        this.patients = res;
                    } else {
                        this.patientsService
                            .find(this.patientsMedicines.patient.id)
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
        this.medicinesService
            .query({ filter: 'patientsmedicines-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IMedicines[]>) => mayBeOk.ok),
                map((response: HttpResponse<IMedicines[]>) => response.body)
            )
            .subscribe(
                (res: IMedicines[]) => {
                    if (!this.patientsMedicines.medicine || !this.patientsMedicines.medicine.id) {
                        this.medicines = res;
                    } else {
                        this.medicinesService
                            .find(this.patientsMedicines.medicine.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IMedicines>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IMedicines>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IMedicines) => (this.medicines = [subRes].concat(res)),
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
        if (this.patientsMedicines.id !== undefined) {
            this.subscribeToSaveResponse(this.patientsMedicinesService.update(this.patientsMedicines));
        } else {
            this.subscribeToSaveResponse(this.patientsMedicinesService.create(this.patientsMedicines));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatientsMedicines>>) {
        result.subscribe((res: HttpResponse<IPatientsMedicines>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackMedicinesById(index: number, item: IMedicines) {
        return item.id;
    }
}
