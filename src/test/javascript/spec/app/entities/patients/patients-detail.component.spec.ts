/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { PatientsDetailComponent } from 'app/entities/patients/patients-detail.component';
import { Patients } from 'app/shared/model/patients.model';

describe('Component Tests', () => {
    describe('Patients Management Detail Component', () => {
        let comp: PatientsDetailComponent;
        let fixture: ComponentFixture<PatientsDetailComponent>;
        const route = ({ data: of({ patients: new Patients(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [PatientsDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PatientsDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PatientsDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.patients).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
