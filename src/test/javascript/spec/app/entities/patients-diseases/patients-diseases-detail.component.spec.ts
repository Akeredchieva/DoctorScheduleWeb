/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { PatientsDiseasesDetailComponent } from 'app/entities/patients-diseases/patients-diseases-detail.component';
import { PatientsDiseases } from 'app/shared/model/patients-diseases.model';

describe('Component Tests', () => {
    describe('PatientsDiseases Management Detail Component', () => {
        let comp: PatientsDiseasesDetailComponent;
        let fixture: ComponentFixture<PatientsDiseasesDetailComponent>;
        const route = ({ data: of({ patientsDiseases: new PatientsDiseases(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [PatientsDiseasesDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PatientsDiseasesDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PatientsDiseasesDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.patientsDiseases).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
