/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { MedicinesDetailComponent } from 'app/entities/medicines/medicines-detail.component';
import { Medicines } from 'app/shared/model/medicines.model';

describe('Component Tests', () => {
    describe('Medicines Management Detail Component', () => {
        let comp: MedicinesDetailComponent;
        let fixture: ComponentFixture<MedicinesDetailComponent>;
        const route = ({ data: of({ medicines: new Medicines(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [MedicinesDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(MedicinesDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MedicinesDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.medicines).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
