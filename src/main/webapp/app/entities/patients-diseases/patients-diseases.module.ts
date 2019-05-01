import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { DoctorScheduleSharedModule } from 'app/shared';
import {
    PatientsDiseasesComponent,
    PatientsDiseasesDetailComponent,
    PatientsDiseasesUpdateComponent,
    PatientsDiseasesDeletePopupComponent,
    PatientsDiseasesDeleteDialogComponent,
    patientsDiseasesRoute,
    patientsDiseasesPopupRoute
} from './';

const ENTITY_STATES = [...patientsDiseasesRoute, ...patientsDiseasesPopupRoute];

@NgModule({
    imports: [DoctorScheduleSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PatientsDiseasesComponent,
        PatientsDiseasesDetailComponent,
        PatientsDiseasesUpdateComponent,
        PatientsDiseasesDeleteDialogComponent,
        PatientsDiseasesDeletePopupComponent
    ],
    entryComponents: [
        PatientsDiseasesComponent,
        PatientsDiseasesUpdateComponent,
        PatientsDiseasesDeleteDialogComponent,
        PatientsDiseasesDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorSchedulePatientsDiseasesModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
