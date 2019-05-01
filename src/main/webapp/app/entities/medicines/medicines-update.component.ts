import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IMedicines } from 'app/shared/model/medicines.model';
import { MedicinesService } from './medicines.service';

@Component({
    selector: 'jhi-medicines-update',
    templateUrl: './medicines-update.component.html'
})
export class MedicinesUpdateComponent implements OnInit {
    medicines: IMedicines;
    isSaving: boolean;

    constructor(protected medicinesService: MedicinesService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ medicines }) => {
            this.medicines = medicines;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.medicines.id !== undefined) {
            this.subscribeToSaveResponse(this.medicinesService.update(this.medicines));
        } else {
            this.subscribeToSaveResponse(this.medicinesService.create(this.medicines));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedicines>>) {
        result.subscribe((res: HttpResponse<IMedicines>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
