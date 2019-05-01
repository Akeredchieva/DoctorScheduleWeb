/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { PatientsMedicinesUpdateComponent } from 'app/entities/patients-medicines/patients-medicines-update.component';
import { PatientsMedicinesService } from 'app/entities/patients-medicines/patients-medicines.service';
import { PatientsMedicines } from 'app/shared/model/patients-medicines.model';

describe('Component Tests', () => {
    describe('PatientsMedicines Management Update Component', () => {
        let comp: PatientsMedicinesUpdateComponent;
        let fixture: ComponentFixture<PatientsMedicinesUpdateComponent>;
        let service: PatientsMedicinesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [PatientsMedicinesUpdateComponent]
            })
                .overrideTemplate(PatientsMedicinesUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PatientsMedicinesUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PatientsMedicinesService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new PatientsMedicines(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.patientsMedicines = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new PatientsMedicines();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.patientsMedicines = entity;
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
