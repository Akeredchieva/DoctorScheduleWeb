/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { DoctorScheduleTestModule } from '../../../test.module';
import { DoctorsDeleteDialogComponent } from 'app/entities/doctors/doctors-delete-dialog.component';
import { DoctorsService } from 'app/entities/doctors/doctors.service';

describe('Component Tests', () => {
    describe('Doctors Management Delete Component', () => {
        let comp: DoctorsDeleteDialogComponent;
        let fixture: ComponentFixture<DoctorsDeleteDialogComponent>;
        let service: DoctorsService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [DoctorsDeleteDialogComponent]
            })
                .overrideTemplate(DoctorsDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(DoctorsDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DoctorsService);
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
