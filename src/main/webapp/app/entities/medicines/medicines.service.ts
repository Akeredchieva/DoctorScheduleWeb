import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMedicines } from 'app/shared/model/medicines.model';

type EntityResponseType = HttpResponse<IMedicines>;
type EntityArrayResponseType = HttpResponse<IMedicines[]>;

@Injectable({ providedIn: 'root' })
export class MedicinesService {
    public resourceUrl = SERVER_API_URL + 'api/medicines';

    constructor(protected http: HttpClient) {}

    create(medicines: IMedicines): Observable<EntityResponseType> {
        return this.http.post<IMedicines>(this.resourceUrl, medicines, { observe: 'response' });
    }

    update(medicines: IMedicines): Observable<EntityResponseType> {
        return this.http.put<IMedicines>(this.resourceUrl, medicines, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IMedicines>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMedicines[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
