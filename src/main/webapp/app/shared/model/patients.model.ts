import { IUser } from 'app/core/user/user.model';
import { IDoctors } from 'app/shared/model/doctors.model';

export interface IPatients {
    id?: number;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phone?: string;
    personalId?: string;
    address?: string;
    email?: string;
    user?: IUser;
    doctors?: IDoctors[];
}

export class Patients implements IPatients {
    constructor(
        public id?: number,
        public firstName?: string,
        public middleName?: string,
        public lastName?: string,
        public phone?: string,
        public personalId?: string,
        public address?: string,
        public email?: string,
        public user?: IUser,
        public doctors?: IDoctors[]
    ) {}
}
