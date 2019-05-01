/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { DoctorScheduleTestModule } from '../../../test.module';
import { DiseasesComponent } from 'app/entities/diseases/diseases.component';
import { DiseasesService } from 'app/entities/diseases/diseases.service';
import { Diseases } from 'app/shared/model/diseases.model';

describe('Component Tests', () => {
    describe('Diseases Management Component', () => {
        let comp: DiseasesComponent;
        let fixture: ComponentFixture<DiseasesComponent>;
        let service: DiseasesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [DiseasesComponent],
                providers: []
            })
                .overrideTemplate(DiseasesComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DiseasesComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DiseasesService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Diseases(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.diseases[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
