import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { DoctorScheduleSharedModule } from 'app/shared';
import {
    PatientsMedicinesComponent,
    PatientsMedicinesDetailComponent,
    PatientsMedicinesUpdateComponent,
    PatientsMedicinesDeletePopupComponent,
    PatientsMedicinesDeleteDialogComponent,
    patientsMedicinesRoute,
    patientsMedicinesPopupRoute
} from './';

const ENTITY_STATES = [...patientsMedicinesRoute, ...patientsMedicinesPopupRoute];

@NgModule({
    imports: [DoctorScheduleSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PatientsMedicinesComponent,
        PatientsMedicinesDetailComponent,
        PatientsMedicinesUpdateComponent,
        PatientsMedicinesDeleteDialogComponent,
        PatientsMedicinesDeletePopupComponent
    ],
    entryComponents: [
        PatientsMedicinesComponent,
        PatientsMedicinesUpdateComponent,
        PatientsMedicinesDeleteDialogComponent,
        PatientsMedicinesDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctorSchedulePatientsMedicinesModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
