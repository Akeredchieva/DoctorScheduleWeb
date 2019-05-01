import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITypesOfDoctor } from 'app/shared/model/types-of-doctor.model';

type EntityResponseType = HttpResponse<ITypesOfDoctor>;
type EntityArrayResponseType = HttpResponse<ITypesOfDoctor[]>;

@Injectable({ providedIn: 'root' })
export class TypesOfDoctorService {
    public resourceUrl = SERVER_API_URL + 'api/types-of-doctors';

    constructor(protected http: HttpClient) {}

    create(typesOfDoctor: ITypesOfDoctor): Observable<EntityResponseType> {
        return this.http.post<ITypesOfDoctor>(this.resourceUrl, typesOfDoctor, { observe: 'response' });
    }

    update(typesOfDoctor: ITypesOfDoctor): Observable<EntityResponseType> {
        return this.http.put<ITypesOfDoctor>(this.resourceUrl, typesOfDoctor, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ITypesOfDoctor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ITypesOfDoctor[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
