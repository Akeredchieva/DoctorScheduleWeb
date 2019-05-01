import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PatientsDiseases } from 'app/shared/model/patients-diseases.model';
import { PatientsDiseasesService } from './patients-diseases.service';
import { PatientsDiseasesComponent } from './patients-diseases.component';
import { PatientsDiseasesDetailComponent } from './patients-diseases-detail.component';
import { PatientsDiseasesUpdateComponent } from './patients-diseases-update.component';
import { PatientsDiseasesDeletePopupComponent } from './patients-diseases-delete-dialog.component';
import { IPatientsDiseases } from 'app/shared/model/patients-diseases.model';

@Injectable({ providedIn: 'root' })
export class PatientsDiseasesResolve implements Resolve<IPatientsDiseases> {
    constructor(private service: PatientsDiseasesService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPatientsDiseases> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<PatientsDiseases>) => response.ok),
                map((patientsDiseases: HttpResponse<PatientsDiseases>) => patientsDiseases.body)
            );
        }
        return of(new PatientsDiseases());
    }
}

export const patientsDiseasesRoute: Routes = [
    {
        path: '',
        component: PatientsDiseasesComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patientsDiseases.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PatientsDiseasesDetailComponent,
        resolve: {
            patientsDiseases: PatientsDiseasesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patientsDiseases.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PatientsDiseasesUpdateComponent,
        resolve: {
            patientsDiseases: PatientsDiseasesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patientsDiseases.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PatientsDiseasesUpdateComponent,
        resolve: {
            patientsDiseases: PatientsDiseasesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patientsDiseases.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const patientsDiseasesPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PatientsDiseasesDeletePopupComponent,
        resolve: {
            patientsDiseases: PatientsDiseasesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patientsDiseases.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
