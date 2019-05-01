import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TypesOfDoctor } from 'app/shared/model/types-of-doctor.model';
import { TypesOfDoctorService } from './types-of-doctor.service';
import { TypesOfDoctorComponent } from './types-of-doctor.component';
import { TypesOfDoctorDetailComponent } from './types-of-doctor-detail.component';
import { TypesOfDoctorUpdateComponent } from './types-of-doctor-update.component';
import { TypesOfDoctorDeletePopupComponent } from './types-of-doctor-delete-dialog.component';
import { ITypesOfDoctor } from 'app/shared/model/types-of-doctor.model';

@Injectable({ providedIn: 'root' })
export class TypesOfDoctorResolve implements Resolve<ITypesOfDoctor> {
    constructor(private service: TypesOfDoctorService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITypesOfDoctor> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<TypesOfDoctor>) => response.ok),
                map((typesOfDoctor: HttpResponse<TypesOfDoctor>) => typesOfDoctor.body)
            );
        }
        return of(new TypesOfDoctor());
    }
}

export const typesOfDoctorRoute: Routes = [
    {
        path: '',
        component: TypesOfDoctorComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.typesOfDoctor.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: TypesOfDoctorDetailComponent,
        resolve: {
            typesOfDoctor: TypesOfDoctorResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.typesOfDoctor.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: TypesOfDoctorUpdateComponent,
        resolve: {
            typesOfDoctor: TypesOfDoctorResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.typesOfDoctor.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: TypesOfDoctorUpdateComponent,
        resolve: {
            typesOfDoctor: TypesOfDoctorResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.typesOfDoctor.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const typesOfDoctorPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: TypesOfDoctorDeletePopupComponent,
        resolve: {
            typesOfDoctor: TypesOfDoctorResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.typesOfDoctor.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
