/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { DiseasesDetailComponent } from 'app/entities/diseases/diseases-detail.component';
import { Diseases } from 'app/shared/model/diseases.model';

describe('Component Tests', () => {
    describe('Diseases Management Detail Component', () => {
        let comp: DiseasesDetailComponent;
        let fixture: ComponentFixture<DiseasesDetailComponent>;
        const route = ({ data: of({ diseases: new Diseases(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [DiseasesDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(DiseasesDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(DiseasesDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.diseases).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
