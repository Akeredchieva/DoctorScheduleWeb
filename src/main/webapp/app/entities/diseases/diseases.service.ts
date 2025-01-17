import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IDiseases } from 'app/shared/model/diseases.model';

type EntityResponseType = HttpResponse<IDiseases>;
type EntityArrayResponseType = HttpResponse<IDiseases[]>;

@Injectable({ providedIn: 'root' })
export class DiseasesService {
    public resourceUrl = SERVER_API_URL + 'api/diseases';

    constructor(protected http: HttpClient) {}

    create(diseases: IDiseases): Observable<EntityResponseType> {
        return this.http.post<IDiseases>(this.resourceUrl, diseases, { observe: 'response' });
    }

    update(diseases: IDiseases): Observable<EntityResponseType> {
        return this.http.put<IDiseases>(this.resourceUrl, diseases, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IDiseases>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IDiseases[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
