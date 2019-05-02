import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Medicines } from 'app/shared/model/medicines.model';
import { MedicinesService } from './medicines.service';
import { MedicinesComponent } from './medicines.component';
import { MedicinesDetailComponent } from './medicines-detail.component';
import { MedicinesUpdateComponent } from './medicines-update.component';
import { MedicinesDeletePopupComponent } from './medicines-delete-dialog.component';
import { IMedicines } from 'app/shared/model/medicines.model';

@Injectable({ providedIn: 'root' })
export class MedicinesResolve implements Resolve<IMedicines> {
    constructor(private service: MedicinesService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMedicines> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Medicines>) => response.ok),
                map((medicines: HttpResponse<Medicines>) => medicines.body)
            );
        }
        return of(new Medicines());
    }
}

export const medicinesRoute: Routes = [
    {
        path: '',
        component: MedicinesComponent,
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.medicines.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: MedicinesDetailComponent,
        resolve: {
            medicines: MedicinesResolve
        },
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.medicines.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: MedicinesUpdateComponent,
        resolve: {
            medicines: MedicinesResolve
        },
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.medicines.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: MedicinesUpdateComponent,
        resolve: {
            medicines: MedicinesResolve
        },
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.medicines.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const medicinesPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: MedicinesDeletePopupComponent,
        resolve: {
            medicines: MedicinesResolve
        },
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.medicines.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
