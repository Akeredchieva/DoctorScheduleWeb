import { Moment } from 'moment';
import { IPatients } from 'app/shared/model/patients.model';
import { IDoctors } from 'app/shared/model/doctors.model';

export interface ITimes {
    id?: number;
    date?: Moment;
    patient?: IPatients;
    doctor?: IDoctors;
}

export class Times implements ITimes {
    constructor(public id?: number, public date?: Moment, public patient?: IPatients, public doctor?: IDoctors) {}
}
