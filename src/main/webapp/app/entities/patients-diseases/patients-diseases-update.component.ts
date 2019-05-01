import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPatientsDiseases } from 'app/shared/model/patients-diseases.model';
import { PatientsDiseasesService } from './patients-diseases.service';
import { IPatients } from 'app/shared/model/patients.model';
import { PatientsService } from 'app/entities/patients';
import { IDiseases } from 'app/shared/model/diseases.model';
import { DiseasesService } from 'app/entities/diseases';

@Component({
    selector: 'jhi-patients-diseases-update',
    templateUrl: './patients-diseases-update.component.html'
})
export class PatientsDiseasesUpdateComponent implements OnInit {
    patientsDiseases: IPatientsDiseases;
    isSaving: boolean;

    patients: IPatients[];

    diseases: IDiseases[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected patientsDiseasesService: PatientsDiseasesService,
        protected patientsService: PatientsService,
        protected diseasesService: DiseasesService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ patientsDiseases }) => {
            this.patientsDiseases = patientsDiseases;
        });
        this.patientsService
            .query({ filter: 'patientsdiseases-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IPatients[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPatients[]>) => response.body)
            )
            .subscribe(
                (res: IPatients[]) => {
                    if (!this.patientsDiseases.patient || !this.patientsDiseases.patient.id) {
                        this.patients = res;
                    } else {
                        this.patientsService
                            .find(this.patientsDiseases.patient.id)
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
        this.diseasesService
            .query({ filter: 'patientsdiseases-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IDiseases[]>) => mayBeOk.ok),
                map((response: HttpResponse<IDiseases[]>) => response.body)
            )
            .subscribe(
                (res: IDiseases[]) => {
                    if (!this.patientsDiseases.diseases || !this.patientsDiseases.diseases.id) {
                        this.diseases = res;
                    } else {
                        this.diseasesService
                            .find(this.patientsDiseases.diseases.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IDiseases>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IDiseases>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IDiseases) => (this.diseases = [subRes].concat(res)),
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
        if (this.patientsDiseases.id !== undefined) {
            this.subscribeToSaveResponse(this.patientsDiseasesService.update(this.patientsDiseases));
        } else {
            this.subscribeToSaveResponse(this.patientsDiseasesService.create(this.patientsDiseases));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatientsDiseases>>) {
        result.subscribe((res: HttpResponse<IPatientsDiseases>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackDiseasesById(index: number, item: IDiseases) {
        return item.id;
    }
}
