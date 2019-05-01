/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DoctorScheduleTestModule } from '../../../test.module';
import { DoctorsComponent } from 'app/entities/doctors/doctors.component';
import { DoctorsService } from 'app/entities/doctors/doctors.service';
import { Doctors } from 'app/shared/model/doctors.model';

describe('Component Tests', () => {
    describe('Doctors Management Component', () => {
        let comp: DoctorsComponent;
        let fixture: ComponentFixture<DoctorsComponent>;
        let service: DoctorsService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [DoctorsComponent],
                providers: []
            })
                .overrideTemplate(DoctorsComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DoctorsComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DoctorsService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Doctors(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.doctors[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
