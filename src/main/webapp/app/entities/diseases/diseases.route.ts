import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Diseases } from 'app/shared/model/diseases.model';
import { DiseasesService } from './diseases.service';
import { DiseasesComponent } from './diseases.component';
import { DiseasesDetailComponent } from './diseases-detail.component';
import { DiseasesUpdateComponent } from './diseases-update.component';
import { DiseasesDeletePopupComponent } from './diseases-delete-dialog.component';
import { IDiseases } from 'app/shared/model/diseases.model';

@Injectable({ providedIn: 'root' })
export class DiseasesResolve implements Resolve<IDiseases> {
    constructor(private service: DiseasesService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDiseases> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Diseases>) => response.ok),
                map((diseases: HttpResponse<Diseases>) => diseases.body)
            );
        }
        return of(new Diseases());
    }
}

export const diseasesRoute: Routes = [
    {
        path: '',
        component: DiseasesComponent,
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.diseases.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: DiseasesDetailComponent,
        resolve: {
            diseases: DiseasesResolve
        },
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.diseases.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: DiseasesUpdateComponent,
        resolve: {
            diseases: DiseasesResolve
        },
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.diseases.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: DiseasesUpdateComponent,
        resolve: {
            diseases: DiseasesResolve
        },
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.diseases.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const diseasesPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: DiseasesDeletePopupComponent,
        resolve: {
            diseases: DiseasesResolve
        },
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.diseases.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
