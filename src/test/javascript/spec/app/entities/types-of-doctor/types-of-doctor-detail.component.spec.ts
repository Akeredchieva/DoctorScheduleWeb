/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DoctorScheduleTestModule } from '../../../test.module';
import { TypesOfDoctorDetailComponent } from 'app/entities/types-of-doctor/types-of-doctor-detail.component';
import { TypesOfDoctor } from 'app/shared/model/types-of-doctor.model';

describe('Component Tests', () => {
    describe('TypesOfDoctor Management Detail Component', () => {
        let comp: TypesOfDoctorDetailComponent;
        let fixture: ComponentFixture<TypesOfDoctorDetailComponent>;
        const route = ({ data: of({ typesOfDoctor: new TypesOfDoctor(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [TypesOfDoctorDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TypesOfDoctorDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TypesOfDoctorDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.typesOfDoctor).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
