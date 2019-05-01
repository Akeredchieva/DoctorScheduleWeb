import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPatientsDiseases } from 'app/shared/model/patients-diseases.model';

type EntityResponseType = HttpResponse<IPatientsDiseases>;
type EntityArrayResponseType = HttpResponse<IPatientsDiseases[]>;

@Injectable({ providedIn: 'root' })
export class PatientsDiseasesService {
    public resourceUrl = SERVER_API_URL + 'api/patients-diseases';

    constructor(protected http: HttpClient) {}

    create(patientsDiseases: IPatientsDiseases): Observable<EntityResponseType> {
        return this.http.post<IPatientsDiseases>(this.resourceUrl, patientsDiseases, { observe: 'response' });
    }

    update(patientsDiseases: IPatientsDiseases): Observable<EntityResponseType> {
        return this.http.put<IPatientsDiseases>(this.resourceUrl, patientsDiseases, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPatientsDiseases>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPatientsDiseases[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
