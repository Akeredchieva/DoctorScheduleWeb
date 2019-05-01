/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { DoctorsUpdateComponent } from 'app/entities/doctors/doctors-update.component';
import { DoctorsService } from 'app/entities/doctors/doctors.service';
import { Doctors } from 'app/shared/model/doctors.model';

describe('Component Tests', () => {
    describe('Doctors Management Update Component', () => {
        let comp: DoctorsUpdateComponent;
        let fixture: ComponentFixture<DoctorsUpdateComponent>;
        let service: DoctorsService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [DoctorsUpdateComponent]
            })
                .overrideTemplate(DoctorsUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DoctorsUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DoctorsService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Doctors(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.doctors = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Doctors();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.doctors = entity;
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
