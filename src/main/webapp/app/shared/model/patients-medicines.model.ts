import { Moment } from 'moment';
import { IPatients } from 'app/shared/model/patients.model';
import { IMedicines } from 'app/shared/model/medicines.model';

export interface IPatientsMedicines {
    id?: number;
    startDate?: Moment;
    endDate?: Moment;
    description?: string;
    patient?: IPatients;
    medicine?: IMedicines;
}

export class PatientsMedicines implements IPatientsMedicines {
    constructor(
        public id?: number,
        public startDate?: Moment,
        public endDate?: Moment,
        public description?: string,
        public patient?: IPatients,
        public medicine?: IMedicines
    ) {}
}
