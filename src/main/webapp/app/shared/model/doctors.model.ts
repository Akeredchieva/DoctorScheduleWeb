import { ITypesOfDoctor } from 'app/shared/model/types-of-doctor.model';
import { IUser } from 'app/core/user/user.model';
import { IPatients } from 'app/shared/model/patients.model';

export interface IDoctors {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    typeOfDoctors?: ITypesOfDoctor[];
    user?: IUser;
    patients?: IPatients[];
}

export class Doctors implements IDoctors {
    constructor(
        public id?: number,
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public phone?: string,
        public typeOfDoctors?: ITypesOfDoctor[],
        public user?: IUser,
        public patients?: IPatients[]
    ) {}
}
