export interface IMedicines {
    id?: number;
    name?: string;
    description?: string;
}

export class Medicines implements IMedicines {
    constructor(public id?: number, public name?: string, public description?: string) {}
}
