/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { TimesDetailComponent } from 'app/entities/times/times-detail.component';
import { Times } from 'app/shared/model/times.model';

describe('Component Tests', () => {
    describe('Times Management Detail Component', () => {
        let comp: TimesDetailComponent;
        let fixture: ComponentFixture<TimesDetailComponent>;
        const route = ({ data: of({ times: new Times(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [TimesDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TimesDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TimesDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.times).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
