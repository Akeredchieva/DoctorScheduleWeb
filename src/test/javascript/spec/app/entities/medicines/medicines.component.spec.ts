/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DoctorScheduleTestModule } from '../../../test.module';
import { MedicinesComponent } from 'app/entities/medicines/medicines.component';
import { MedicinesService } from 'app/entities/medicines/medicines.service';
import { Medicines } from 'app/shared/model/medicines.model';

describe('Component Tests', () => {
    describe('Medicines Management Component', () => {
        let comp: MedicinesComponent;
        let fixture: ComponentFixture<MedicinesComponent>;
        let service: MedicinesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [MedicinesComponent],
                providers: []
            })
                .overrideTemplate(MedicinesComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MedicinesComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MedicinesService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Medicines(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.medicines[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
