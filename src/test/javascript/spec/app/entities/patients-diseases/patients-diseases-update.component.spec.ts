/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { PatientsDiseasesUpdateComponent } from 'app/entities/patients-diseases/patients-diseases-update.component';
import { PatientsDiseasesService } from 'app/entities/patients-diseases/patients-diseases.service';
import { PatientsDiseases } from 'app/shared/model/patients-diseases.model';

describe('Component Tests', () => {
    describe('PatientsDiseases Management Update Component', () => {
        let comp: PatientsDiseasesUpdateComponent;
        let fixture: ComponentFixture<PatientsDiseasesUpdateComponent>;
        let service: PatientsDiseasesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [PatientsDiseasesUpdateComponent]
            })
                .overrideTemplate(PatientsDiseasesUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PatientsDiseasesUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PatientsDiseasesService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new PatientsDiseases(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.patientsDiseases = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new PatientsDiseases();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.patientsDiseases = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
