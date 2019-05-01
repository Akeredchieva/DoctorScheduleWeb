/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { DiseasesUpdateComponent } from 'app/entities/diseases/diseases-update.component';
import { DiseasesService } from 'app/entities/diseases/diseases.service';
import { Diseases } from 'app/shared/model/diseases.model';

describe('Component Tests', () => {
    describe('Diseases Management Update Component', () => {
        let comp: DiseasesUpdateComponent;
        let fixture: ComponentFixture<DiseasesUpdateComponent>;
        let service: DiseasesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [DiseasesUpdateComponent]
            })
                .overrideTemplate(DiseasesUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DiseasesUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DiseasesService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Diseases(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.diseases = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Diseases();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.diseases = entity;
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
