/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { PatientsMedicinesDetailComponent } from 'app/entities/patients-medicines/patients-medicines-detail.component';
import { PatientsMedicines } from 'app/shared/model/patients-medicines.model';

describe('Component Tests', () => {
    describe('PatientsMedicines Management Detail Component', () => {
        let comp: PatientsMedicinesDetailComponent;
        let fixture: ComponentFixture<PatientsMedicinesDetailComponent>;
        const route = ({ data: of({ patientsMedicines: new PatientsMedicines(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [PatientsMedicinesDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PatientsMedicinesDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PatientsMedicinesDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.patientsMedicines).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
