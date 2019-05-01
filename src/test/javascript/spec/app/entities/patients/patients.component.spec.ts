/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DoctorScheduleTestModule } from '../../../test.module';
import { PatientsComponent } from 'app/entities/patients/patients.component';
import { PatientsService } from 'app/entities/patients/patients.service';
import { Patients } from 'app/shared/model/patients.model';

describe('Component Tests', () => {
    describe('Patients Management Component', () => {
        let comp: PatientsComponent;
        let fixture: ComponentFixture<PatientsComponent>;
        let service: PatientsService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [PatientsComponent],
                providers: []
            })
                .overrideTemplate(PatientsComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PatientsComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PatientsService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Patients(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.patients[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
