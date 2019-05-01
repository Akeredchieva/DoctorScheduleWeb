/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { DoctorScheduleTestModule } from '../../../test.module';
import { TypesOfDoctorDeleteDialogComponent } from 'app/entities/types-of-doctor/types-of-doctor-delete-dialog.component';
import { TypesOfDoctorService } from 'app/entities/types-of-doctor/types-of-doctor.service';

describe('Component Tests', () => {
    describe('TypesOfDoctor Management Delete Component', () => {
        let comp: TypesOfDoctorDeleteDialogComponent;
        let fixture: ComponentFixture<TypesOfDoctorDeleteDialogComponent>;
        let service: TypesOfDoctorService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [TypesOfDoctorDeleteDialogComponent]
            })
                .overrideTemplate(TypesOfDoctorDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TypesOfDoctorDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TypesOfDoctorService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
