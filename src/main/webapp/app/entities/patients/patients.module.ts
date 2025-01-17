import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { DoctorScheduleSharedModule } from 'app/shared';
import {
    PatientsComponent,
    PatientsDetailComponent,
    PatientsUpdateComponent,
    PatientsDeletePopupComponent,
    PatientsDeleteDialogComponent,
    patientsRoute,
    patientsPopupRoute
} from './';
import { PatientDeseaseComponent } from './patient-desease/patient-desease.component';

const ENTITY_STATES = [...patientsRoute, ...patientsPopupRoute];

@NgModule({
    imports: [DoctorScheduleSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PatientsComponent,
        PatientsDetailComponent,
        PatientsUpdateComponent,
        PatientsDeleteDialogComponent,
        PatientsDeletePopupComponent,
        PatientDeseaseComponent
    ],
    entryComponents: [PatientsComponent, PatientsUpdateComponent, PatientsDeleteDialogComponent, PatientsDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorSchedulePatientsModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
