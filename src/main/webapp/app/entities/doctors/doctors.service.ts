import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IDoctors } from 'app/shared/model/doctors.model';

type EntityResponseType = HttpResponse<IDoctors>;
type EntityArrayResponseType = HttpResponse<IDoctors[]>;

@Injectable({ providedIn: 'root' })
export class DoctorsService {
    public resourceUrl = SERVER_API_URL + 'api/doctors';

    constructor(protected http: HttpClient) {}

    create(doctors: IDoctors): Observable<EntityResponseType> {
        return this.http.post<IDoctors>(this.resourceUrl, doctors, { observe: 'response' });
    }

    update(doctors: IDoctors): Observable<EntityResponseType> {
        return this.http.put<IDoctors>(this.resourceUrl, doctors, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IDoctors>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IDoctors[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
