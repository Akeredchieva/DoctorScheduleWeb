/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { PatientsUpdateComponent } from 'app/entities/patients/patients-update.component';
import { PatientsService } from 'app/entities/patients/patients.service';
import { Patients } from 'app/shared/model/patients.model';

describe('Component Tests', () => {
    describe('Patients Management Update Component', () => {
        let comp: PatientsUpdateComponent;
        let fixture: ComponentFixture<PatientsUpdateComponent>;
        let service: PatientsService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [PatientsUpdateComponent]
            })
                .overrideTemplate(PatientsUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PatientsUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PatientsService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Patients(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.patients = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Patients();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.patients = entity;
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
