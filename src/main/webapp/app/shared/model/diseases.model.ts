export interface IDiseases {
    id?: number;
    diseaseName?: string;
    description?: string;
}

export class Diseases implements IDiseases {
    constructor(public id?: number, public diseaseName?: string, public description?: string) {}
}
