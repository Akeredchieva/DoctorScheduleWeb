import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITimes } from 'app/shared/model/times.model';

type EntityResponseType = HttpResponse<ITimes>;
type EntityArrayResponseType = HttpResponse<ITimes[]>;

@Injectable({ providedIn: 'root' })
export class TimesService {
    public resourceUrl = SERVER_API_URL + 'api/times';

    constructor(protected http: HttpClient) {}

    create(times: ITimes): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(times);
        return this.http
            .post<ITimes>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(times: ITimes): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(times);
        return this.http
            .put<ITimes>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ITimes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITimes[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(times: ITimes): ITimes {
        const copy: ITimes = Object.assign({}, times, {
            date: times.date != null && times.date.isValid() ? times.date.format(DATE_FORMAT) : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.date = res.body.date != null ? moment(res.body.date) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((times: ITimes) => {
                times.date = times.date != null ? moment(times.date) : null;
            });
        }
        return res;
    }
}
