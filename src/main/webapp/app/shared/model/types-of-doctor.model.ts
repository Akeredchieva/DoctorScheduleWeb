import { IDoctors } from 'app/shared/model/doctors.model';

export interface ITypesOfDoctor {
    id?: number;
    specialist?: string;
    doctors?: IDoctors;
}

export class TypesOfDoctor implements ITypesOfDoctor {
    constructor(public id?: number, public specialist?: string, public doctors?: IDoctors) {}
}
