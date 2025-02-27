// src/types.ts
export enum CustomerType {
  WORKS_BUREAU = 'WORKS_BUREAU',
  HUAWEI = 'HUAWEI',
  CONSTRUCTION = 'CONSTRUCTION',
  OTHER = 'OTHER'
}

export enum TemplateType {
  WORKS_BUREAU = 'WORKS_BUREAU',
  HUAWEI = 'HUAWEI',
  CONSTRUCTION = 'CONSTRUCTION',
  OTHER = 'OTHER'
}

export enum GuaranteeTemplateType {
  BANK = 'BANK',
  OTHER = 'OTHER'
}

export enum PaymentType {
  ADVANCE = 'ADVANCE',
  DELIVERY = 'DELIVERY',
  COMPLETION = 'COMPLETION',
  WARRANTY = 'WARRANTY'
}

export enum GuaranteeType {
  ADVANCE = 'ADVANCE',
  PERFORMANCE = 'PERFORMANCE',
  WARRANTY = 'WARRANTY'
}

export interface ContractInfo {
  projectName: string;
  customerName: string;
  amount: number;
  contractName: string;
  contractNo: string;
  signDate: string;
}

export interface ContractData {
  contractNo: string;
  customerName: string;
  projectName: string;
  contractAmount: number;
  signDate: string;
}

export interface PaymentRequest {
  templateType: TemplateType;
  paymentType: PaymentType;
  customerType?: CustomerType;
  contractData: ContractData;
  currentInvestment: number | null;
  previouslyPaid: number | null;
}

export interface GuaranteeRequest {
  templateType: GuaranteeTemplateType;
  guaranteeType: GuaranteeType;
  variables: {
    contractNo: string;
    customerName: string;
    projectName: string;
    contractAmount: number;
    validityPeriod: string;
  };
}

export interface GuaranteeInfo {
  advancePaymentRatio: number;
  advancePaymentValidity: string;
  deliveryPaymentRatio: number;
  deliveryPaymentValidity: string;
  warrantyRatio: number;
  warrantyValidity: string;
}

export interface PaymentTerm {
  type: PaymentType;
  ratio: number;
}

export interface WarrantyDocument {
  id: string;
  name: string;
  selected: boolean;
  type: 'docx' | 'xlsx';
}

export interface WarrantyRequest {
  warrantyStartDate: string;
  contractNo: string;
  contractData: {
    projectName: string;
    contractName: string;
    contractNo: string;
    customerName: string;
    contractAmount: number;
    warrantyAmount: number;
    warrantyPeriod: number;
  };
  selectedDocuments: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}
