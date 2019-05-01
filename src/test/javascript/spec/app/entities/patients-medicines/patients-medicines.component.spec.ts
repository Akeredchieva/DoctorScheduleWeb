/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DoctorScheduleTestModule } from '../../../test.module';
import { PatientsMedicinesComponent } from 'app/entities/patients-medicines/patients-medicines.component';
import { PatientsMedicinesService } from 'app/entities/patients-medicines/patients-medicines.service';
import { PatientsMedicines } from 'app/shared/model/patients-medicines.model';

describe('Component Tests', () => {
    describe('PatientsMedicines Management Component', () => {
        let comp: PatientsMedicinesComponent;
        let fixture: ComponentFixture<PatientsMedicinesComponent>;
        let service: PatientsMedicinesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [PatientsMedicinesComponent],
                providers: []
            })
                .overrideTemplate(PatientsMedicinesComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PatientsMedicinesComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PatientsMedicinesService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new PatientsMedicines(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.patientsMedicines[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
