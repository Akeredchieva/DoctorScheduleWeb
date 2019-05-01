import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { DoctorScheduleSharedModule } from 'app/shared';
import {
    DoctorsComponent,
    DoctorsDetailComponent,
    DoctorsUpdateComponent,
    DoctorsDeletePopupComponent,
    DoctorsDeleteDialogComponent,
    doctorsRoute,
    doctorsPopupRoute
} from './';

const ENTITY_STATES = [...doctorsRoute, ...doctorsPopupRoute];

@NgModule({
    imports: [DoctorScheduleSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        DoctorsComponent,
        DoctorsDetailComponent,
        DoctorsUpdateComponent,
        DoctorsDeleteDialogComponent,
        DoctorsDeletePopupComponent
    ],
    entryComponents: [DoctorsComponent, DoctorsUpdateComponent, DoctorsDeleteDialogComponent, DoctorsDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorScheduleDoctorsModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
