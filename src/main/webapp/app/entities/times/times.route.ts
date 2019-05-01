import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Times } from 'app/shared/model/times.model';
import { TimesService } from './times.service';
import { TimesComponent } from './times.component';
import { TimesDetailComponent } from './times-detail.component';
import { TimesUpdateComponent } from './times-update.component';
import { TimesDeletePopupComponent } from './times-delete-dialog.component';
import { ITimes } from 'app/shared/model/times.model';

@Injectable({ providedIn: 'root' })
export class TimesResolve implements Resolve<ITimes> {
    constructor(private service: TimesService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITimes> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Times>) => response.ok),
                map((times: HttpResponse<Times>) => times.body)
            );
        }
        return of(new Times());
    }
}

export const timesRoute: Routes = [
    {
        path: '',
        component: TimesComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.times.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: TimesDetailComponent,
        resolve: {
            times: TimesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.times.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: TimesUpdateComponent,
        resolve: {
            times: TimesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.times.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: TimesUpdateComponent,
        resolve: {
            times: TimesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.times.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const timesPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: TimesDeletePopupComponent,
        resolve: {
            times: TimesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.times.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
