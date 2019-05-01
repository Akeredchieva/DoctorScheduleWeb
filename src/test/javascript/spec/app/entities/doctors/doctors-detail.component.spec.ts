/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { DoctorsDetailComponent } from 'app/entities/doctors/doctors-detail.component';
import { Doctors } from 'app/shared/model/doctors.model';

describe('Component Tests', () => {
    describe('Doctors Management Detail Component', () => {
        let comp: DoctorsDetailComponent;
        let fixture: ComponentFixture<DoctorsDetailComponent>;
        const route = ({ data: of({ doctors: new Doctors(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [DoctorsDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(DoctorsDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(DoctorsDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.doctors).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
