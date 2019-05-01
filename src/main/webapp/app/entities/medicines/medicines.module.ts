import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { DoctorScheduleSharedModule } from 'app/shared';
import {
    MedicinesComponent,
    MedicinesDetailComponent,
    MedicinesUpdateComponent,
    MedicinesDeletePopupComponent,
    MedicinesDeleteDialogComponent,
    medicinesRoute,
    medicinesPopupRoute
} from './';

const ENTITY_STATES = [...medicinesRoute, ...medicinesPopupRoute];

@NgModule({
    imports: [DoctorScheduleSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MedicinesComponent,
        MedicinesDetailComponent,
        MedicinesUpdateComponent,
        MedicinesDeleteDialogComponent,
        MedicinesDeletePopupComponent
    ],
    entryComponents: [MedicinesComponent, MedicinesUpdateComponent, MedicinesDeleteDialogComponent, MedicinesDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorScheduleMedicinesModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
