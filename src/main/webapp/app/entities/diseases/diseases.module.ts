import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { DoctorScheduleSharedModule } from 'app/shared';
import {
    DiseasesComponent,
    DiseasesDetailComponent,
    DiseasesUpdateComponent,
    DiseasesDeletePopupComponent,
    DiseasesDeleteDialogComponent,
    diseasesRoute,
    diseasesPopupRoute
} from './';

const ENTITY_STATES = [...diseasesRoute, ...diseasesPopupRoute];

@NgModule({
    imports: [DoctorScheduleSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        DiseasesComponent,
        DiseasesDetailComponent,
        DiseasesUpdateComponent,
        DiseasesDeleteDialogComponent,
        DiseasesDeletePopupComponent
    ],
    entryComponents: [DiseasesComponent, DiseasesUpdateComponent, DiseasesDeleteDialogComponent, DiseasesDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorScheduleDiseasesModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
