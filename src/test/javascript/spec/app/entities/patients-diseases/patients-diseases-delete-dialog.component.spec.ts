/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { DoctorScheduleTestModule } from '../../../test.module';
import { PatientsDiseasesDeleteDialogComponent } from 'app/entities/patients-diseases/patients-diseases-delete-dialog.component';
import { PatientsDiseasesService } from 'app/entities/patients-diseases/patients-diseases.service';

describe('Component Tests', () => {
    describe('PatientsDiseases Management Delete Component', () => {
        let comp: PatientsDiseasesDeleteDialogComponent;
        let fixture: ComponentFixture<PatientsDiseasesDeleteDialogComponent>;
        let service: PatientsDiseasesService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [PatientsDiseasesDeleteDialogComponent]
            })
                .overrideTemplate(PatientsDiseasesDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PatientsDiseasesDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PatientsDiseasesService);
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
