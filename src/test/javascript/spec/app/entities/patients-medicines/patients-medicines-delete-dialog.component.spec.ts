/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { DoctorScheduleTestModule } from '../../../test.module';
import { PatientsMedicinesDeleteDialogComponent } from 'app/entities/patients-medicines/patients-medicines-delete-dialog.component';
import { PatientsMedicinesService } from 'app/entities/patients-medicines/patients-medicines.service';

describe('Component Tests', () => {
    describe('PatientsMedicines Management Delete Component', () => {
        let comp: PatientsMedicinesDeleteDialogComponent;
        let fixture: ComponentFixture<PatientsMedicinesDeleteDialogComponent>;
        let service: PatientsMedicinesService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [PatientsMedicinesDeleteDialogComponent]
            })
                .overrideTemplate(PatientsMedicinesDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PatientsMedicinesDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PatientsMedicinesService);
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
