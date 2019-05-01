/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { DoctorScheduleTestModule } from '../../../test.module';
import { DiseasesDeleteDialogComponent } from 'app/entities/diseases/diseases-delete-dialog.component';
import { DiseasesService } from 'app/entities/diseases/diseases.service';

describe('Component Tests', () => {
    describe('Diseases Management Delete Component', () => {
        let comp: DiseasesDeleteDialogComponent;
        let fixture: ComponentFixture<DiseasesDeleteDialogComponent>;
        let service: DiseasesService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DoctorScheduleTestModule],
                declarations: [DiseasesDeleteDialogComponent]
            })
                .overrideTemplate(DiseasesDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(DiseasesDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DiseasesService);
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
