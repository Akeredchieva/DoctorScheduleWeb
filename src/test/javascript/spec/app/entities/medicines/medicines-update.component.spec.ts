/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { MedicinesUpdateComponent } from 'app/entities/medicines/medicines-update.component';
import { MedicinesService } from 'app/entities/medicines/medicines.service';
import { Medicines } from 'app/shared/model/medicines.model';

describe('Component Tests', () => {
    describe('Medicines Management Update Component', () => {
        let comp: MedicinesUpdateComponent;
        let fixture: ComponentFixture<MedicinesUpdateComponent>;
        let service: MedicinesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [MedicinesUpdateComponent]
            })
                .overrideTemplate(MedicinesUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MedicinesUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MedicinesService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Medicines(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.medicines = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Medicines();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.medicines = entity;
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
