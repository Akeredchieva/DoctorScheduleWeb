/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DoctorScheduleTestModule } from '../../../test.module';
import { PatientsDiseasesComponent } from 'app/entities/patients-diseases/patients-diseases.component';
import { PatientsDiseasesService } from 'app/entities/patients-diseases/patients-diseases.service';
import { PatientsDiseases } from 'app/shared/model/patients-diseases.model';

describe('Component Tests', () => {
    describe('PatientsDiseases Management Component', () => {
        let comp: PatientsDiseasesComponent;
        let fixture: ComponentFixture<PatientsDiseasesComponent>;
        let service: PatientsDiseasesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [PatientsDiseasesComponent],
                providers: []
            })
                .overrideTemplate(PatientsDiseasesComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PatientsDiseasesComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PatientsDiseasesService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new PatientsDiseases(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.patientsDiseases[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
