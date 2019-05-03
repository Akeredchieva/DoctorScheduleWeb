import { IDiseases } from 'app/shared/model/diseases.model';
import { IMedicines } from 'app/shared/model/medicines.model';

export interface IPatientDiseaseMedicine {
    id?: number;
    medicine?: IMedicines[];
    disease?: IDiseases;
}

export class IPatientDiseaseMedicine implements IPatientDiseaseMedicine {
    constructor(public disease?: IDiseases, public medicine?: IMedicines[]) {}
}
