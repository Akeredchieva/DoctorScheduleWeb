/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { TimesUpdateComponent } from 'app/entities/times/times-update.component';
import { TimesService } from 'app/entities/times/times.service';
import { Times } from 'app/shared/model/times.model';

describe('Component Tests', () => {
    describe('Times Management Update Component', () => {
        let comp: TimesUpdateComponent;
        let fixture: ComponentFixture<TimesUpdateComponent>;
        let service: TimesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [TimesUpdateComponent]
            })
                .overrideTemplate(TimesUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TimesUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TimesService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Times(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.times = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Times();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.times = entity;
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