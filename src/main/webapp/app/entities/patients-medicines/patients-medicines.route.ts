import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PatientsMedicines } from 'app/shared/model/patients-medicines.model';
import { PatientsMedicinesService } from './patients-medicines.service';
import { PatientsMedicinesComponent } from './patients-medicines.component';
import { PatientsMedicinesDetailComponent } from './patients-medicines-detail.component';
import { PatientsMedicinesUpdateComponent } from './patients-medicines-update.component';
import { PatientsMedicinesDeletePopupComponent } from './patients-medicines-delete-dialog.component';
import { IPatientsMedicines } from 'app/shared/model/patients-medicines.model';

@Injectable({ providedIn: 'root' })
export class PatientsMedicinesResolve implements Resolve<IPatientsMedicines> {
    constructor(private service: PatientsMedicinesService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPatientsMedicines> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<PatientsMedicines>) => response.ok),
                map((patientsMedicines: HttpResponse<PatientsMedicines>) => patientsMedicines.body)
            );
        }
        return of(new PatientsMedicines());
    }
}

export const patientsMedicinesRoute: Routes = [
    {
        path: '',
        component: PatientsMedicinesComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patientsMedicines.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PatientsMedicinesDetailComponent,
        resolve: {
            patientsMedicines: PatientsMedicinesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patientsMedicines.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PatientsMedicinesUpdateComponent,
        resolve: {
            patientsMedicines: PatientsMedicinesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patientsMedicines.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PatientsMedicinesUpdateComponent,
        resolve: {
            patientsMedicines: PatientsMedicinesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patientsMedicines.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const patientsMedicinesPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PatientsMedicinesDeletePopupComponent,
        resolve: {
            patientsMedicines: PatientsMedicinesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.patientsMedicines.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
