import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IDiseases } from 'app/shared/model/diseases.model';
import { DiseasesService } from './diseases.service';

@Component({
    selector: 'jhi-diseases-update',
    templateUrl: './diseases-update.component.html'
})
export class DiseasesUpdateComponent implements OnInit {
    diseases: IDiseases;
    isSaving: boolean;

    constructor(protected diseasesService: DiseasesService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ diseases }) => {
            this.diseases = diseases;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.diseases.id !== undefined) {
            this.subscribeToSaveResponse(this.diseasesService.update(this.diseases));
        } else {
            this.subscribeToSaveResponse(this.diseasesService.create(this.diseases));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiseases>>) {
        result.subscribe((res: HttpResponse<IDiseases>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
