/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { TypesOfDoctorUpdateComponent } from 'app/entities/types-of-doctor/types-of-doctor-update.component';
import { TypesOfDoctorService } from 'app/entities/types-of-doctor/types-of-doctor.service';
import { TypesOfDoctor } from 'app/shared/model/types-of-doctor.model';

describe('Component Tests', () => {
    describe('TypesOfDoctor Management Update Component', () => {
        let comp: TypesOfDoctorUpdateComponent;
        let fixture: ComponentFixture<TypesOfDoctorUpdateComponent>;
        let service: TypesOfDoctorService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [TypesOfDoctorUpdateComponent]
            })
                .overrideTemplate(TypesOfDoctorUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TypesOfDoctorUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TypesOfDoctorService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new TypesOfDoctor(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.typesOfDoctor = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new TypesOfDoctor();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.typesOfDoctor = entity;
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
