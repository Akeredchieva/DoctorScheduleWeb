import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Doctors } from 'app/shared/model/doctors.model';
import { DoctorsService } from './doctors.service';
import { DoctorsComponent } from './doctors.component';
import { DoctorsDetailComponent } from './doctors-detail.component';
import { DoctorsUpdateComponent } from './doctors-update.component';
import { DoctorsDeletePopupComponent } from './doctors-delete-dialog.component';
import { IDoctors } from 'app/shared/model/doctors.model';

@Injectable({ providedIn: 'root' })
export class DoctorsResolve implements Resolve<IDoctors> {
    constructor(private service: DoctorsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDoctors> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Doctors>) => response.ok),
                map((doctors: HttpResponse<Doctors>) => doctors.body)
            );
        }
        return of(new Doctors());
    }
}

export const doctorsRoute: Routes = [
    {
        path: '',
        component: DoctorsComponent,
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.doctors.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: DoctorsDetailComponent,
        resolve: {
            doctors: DoctorsResolve
        },
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.doctors.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: DoctorsUpdateComponent,
        resolve: {
            doctors: DoctorsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'doctorScheduleApp.doctors.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: DoctorsUpdateComponent,
        resolve: {
            doctors: DoctorsResolve
        },
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.doctors.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const doctorsPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: DoctorsDeletePopupComponent,
        resolve: {
            doctors: DoctorsResolve
        },
        data: {
            authorities: ['ROLE_DOCTOR'],
            pageTitle: 'doctorScheduleApp.doctors.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
