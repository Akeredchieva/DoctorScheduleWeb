/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DoctorScheduleTestModule } from '../../../test.module';
import { TypesOfDoctorComponent } from 'app/entities/types-of-doctor/types-of-doctor.component';
import { TypesOfDoctorService } from 'app/entities/types-of-doctor/types-of-doctor.service';
import { TypesOfDoctor } from 'app/shared/model/types-of-doctor.model';

describe('Component Tests', () => {
    describe('TypesOfDoctor Management Component', () => {
        let comp: TypesOfDoctorComponent;
        let fixture: ComponentFixture<TypesOfDoctorComponent>;
        let service: TypesOfDoctorService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [TypesOfDoctorComponent],
                providers: []
            })
                .overrideTemplate(TypesOfDoctorComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TypesOfDoctorComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TypesOfDoctorService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new TypesOfDoctor(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.typesOfDoctors[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
