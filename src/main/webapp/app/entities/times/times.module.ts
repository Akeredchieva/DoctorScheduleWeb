import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { DoctorScheduleSharedModule } from 'app/shared';
import {
    TimesComponent,
    TimesDetailComponent,
    TimesUpdateComponent,
    TimesDeletePopupComponent,
    TimesDeleteDialogComponent,
    timesRoute,
    timesPopupRoute
} from './';

const ENTITY_STATES = [...timesRoute, ...timesPopupRoute];

@NgModule({
    imports: [DoctorScheduleSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [TimesComponent, TimesDetailComponent, TimesUpdateComponent, TimesDeleteDialogComponent, TimesDeletePopupComponent],
    entryComponents: [TimesComponent, TimesUpdateComponent, TimesDeleteDialogComponent, TimesDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorScheduleTimesModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
