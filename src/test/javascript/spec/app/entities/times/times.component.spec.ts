/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DoctorScheduleTestModule } from '../../../test.module';
import { TimesComponent } from 'app/entities/times/times.component';
import { TimesService } from 'app/entities/times/times.service';
import { Times } from 'app/shared/model/times.model';

describe('Component Tests', () => {
    describe('Times Management Component', () => {
        let comp: TimesComponent;
        let fixture: ComponentFixture<TimesComponent>;
        let service: TimesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [TimesComponent],
                providers: []
            })
                .overrideTemplate(TimesComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TimesComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TimesService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Times(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.times[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
