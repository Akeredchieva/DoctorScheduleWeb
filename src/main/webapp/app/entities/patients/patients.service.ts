import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPatients } from 'app/shared/model/patients.model';
import { IPatientDiseaseMedicine } from 'app/shared/model/patient-disease-medicine.model';

type EntityResponseType = HttpResponse<IPatients>;
type EntityArrayResponseType = HttpResponse<IPatients[]>;

@Injectable({ providedIn: 'root' })
export class PatientsService {
    public resourceUrl = SERVER_API_URL + 'api/patients';

    constructor(protected http: HttpClient) {}

    create(patients: IPatients): Observable<EntityResponseType> {
        return this.http.post<IPatients>(this.resourceUrl, patients, { observe: 'response' });
    }

    update(patients: IPatients): Observable<EntityResponseType> {
        return this.http.put<IPatients>(this.resourceUrl, patients, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPatients>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    findDiseaseMedicine(id: number): Observable<EntityResponseType> {
        return this.http.get<IPatientDiseaseMedicine>(`${this.resourceUrl}/diseaseMedicine/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPatients[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
