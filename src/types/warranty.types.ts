// frontend/src/types/warranty.types.ts
export interface WarrantyDocument {
    id: string;
    name: string;
    selected: boolean;
}

// src/types/warranty.types.ts
export interface WarrantyDocRequest {
    warrantyStartDate: string;
    contractData: {
        contractNo: string;
        contractName: string;
        customerName: string;
        projectName: string;
        contractAmount: number;
        warrantyAmount?: number;
    };
    selectedDocs: string[];
    warrantyPeriod?: number;
}



export interface WarrantyResponse {
    success: boolean;
    message?: string;
    data?: {
        downloadUrl?: string;
        previewUrl?: string;
    };
}