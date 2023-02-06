export interface invoicingSchema{
    id: number;
    client_id: number;
    quotation_id: number;
    serial: string;
    subtotal: number;
    discount: number;
    taxing: number;
    total: number;
    stage: number;
    date: string;
    created_by: number;
    deleted: number;

    client_name?: string;
}

export interface invoicingDetailSchema{
    id: number;
    invoicing_id: number;
    quotation_detail_id: number;
    name: string;
    value: number;
    amount: number;
    dscp: string;
    date_from: string;
    date_to: string;
}

export enum invoicingStagesSchema{
    draft = 1,
    settlement = 2,
    invoicing = 3
}

export enum documentType{
    quotation = 'q',
    invoice = 'i',
    dispatch = 'd',
    return = 'r'
}