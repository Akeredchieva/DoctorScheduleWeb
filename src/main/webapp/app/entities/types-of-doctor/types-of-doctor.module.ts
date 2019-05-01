import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { DoctorScheduleSharedModule } from 'app/shared';
import {
    TypesOfDoctorComponent,
    TypesOfDoctorDetailComponent,
    TypesOfDoctorUpdateComponent,
    TypesOfDoctorDeletePopupComponent,
    TypesOfDoctorDeleteDialogComponent,
    typesOfDoctorRoute,
    typesOfDoctorPopupRoute
} from './';

const ENTITY_STATES = [...typesOfDoctorRoute, ...typesOfDoctorPopupRoute];

@NgModule({
    imports: [DoctorScheduleSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TypesOfDoctorComponent,
        TypesOfDoctorDetailComponent,
        TypesOfDoctorUpdateComponent,
        TypesOfDoctorDeleteDialogComponent,
        TypesOfDoctorDeletePopupComponent
    ],
    entryComponents: [
        TypesOfDoctorComponent,
        TypesOfDoctorUpdateComponent,
        TypesOfDoctorDeleteDialogComponent,
        TypesOfDoctorDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorScheduleTypesOfDoctorModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
