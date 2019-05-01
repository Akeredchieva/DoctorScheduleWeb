import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPatientsMedicines } from 'app/shared/model/patients-medicines.model';

type EntityResponseType = HttpResponse<IPatientsMedicines>;
type EntityArrayResponseType = HttpResponse<IPatientsMedicines[]>;

@Injectable({ providedIn: 'root' })
export class PatientsMedicinesService {
    public resourceUrl = SERVER_API_URL + 'api/patients-medicines';

    constructor(protected http: HttpClient) {}

    create(patientsMedicines: IPatientsMedicines): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(patientsMedicines);
        return this.http
            .post<IPatientsMedicines>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(patientsMedicines: IPatientsMedicines): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(patientsMedicines);
        return this.http
            .put<IPatientsMedicines>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IPatientsMedicines>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPatientsMedicines[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(patientsMedicines: IPatientsMedicines): IPatientsMedicines {
        const copy: IPatientsMedicines = Object.assign({}, patientsMedicines, {
            startDate:
                patientsMedicines.startDate != null && patientsMedicines.startDate.isValid()
                    ? patientsMedicines.startDate.format(DATE_FORMAT)
                    : null,
            endDate:
                patientsMedicines.endDate != null && patientsMedicines.endDate.isValid()
                    ? patientsMedicines.endDate.format(DATE_FORMAT)
                    : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.startDate = res.body.startDate != null ? moment(res.body.startDate) : null;
            res.body.endDate = res.body.endDate != null ? moment(res.body.endDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((patientsMedicines: IPatientsMedicines) => {
                patientsMedicines.startDate = patientsMedicines.startDate != null ? moment(patientsMedicines.startDate) : null;
                patientsMedicines.endDate = patientsMedicines.endDate != null ? moment(patientsMedicines.endDate) : null;
            });
        }
        return res;
    }
}
