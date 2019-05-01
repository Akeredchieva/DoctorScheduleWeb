import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Patients } from 'app/shared/model/patients.model';
import { PatientsService } from './patients.service';
import { PatientsComponent } from './patients.component';
import { PatientsDetailComponent } from './patients-detail.component';
import { PatientsUpdateComponent } from './patients-update.component';
import { PatientsDeletePopupComponent } from './patients-delete-dialog.component';
import { IPatients } from 'app/shared/model/patients.model';

@Injectable({ providedIn: 'root' })
export class PatientsResolve implements Resolve<IPatients> {
    constructor(private service: PatientsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPatients> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Patients>) => response.ok),
                map((patients: HttpResponse<Patients>) => patients.body)
            );
        }
        return of(new Patients());
    }
}

export const patientsRoute: Routes = [
    {
        path: '',
        component: PatientsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patients.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PatientsDetailComponent,
        resolve: {
            patients: PatientsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patients.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PatientsUpdateComponent,
        resolve: {
            patients: PatientsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patients.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PatientsUpdateComponent,
        resolve: {
            patients: PatientsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patients.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const patientsPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PatientsDeletePopupComponent,
        resolve: {
            patients: PatientsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patients.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
