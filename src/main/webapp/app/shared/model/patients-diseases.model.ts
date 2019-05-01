import { IPatients } from 'app/shared/model/patients.model';
import { IDiseases } from 'app/shared/model/diseases.model';

export interface IPatientsDiseases {
    id?: number;
    description?: string;
    patient?: IPatients;
    diseases?: IDiseases;
}

export class PatientsDiseases implements IPatientsDiseases {
    constructor(public id?: number, public description?: string, public patient?: IPatients, public diseases?: IDiseases) {}
}
