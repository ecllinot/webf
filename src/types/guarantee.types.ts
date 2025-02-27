// src/types/guarantee.types.ts

export interface GuaranteeData {
  customerName: string;
  contractNo: string;
  contractName: string;
  contractDate?: string;
  guaranteeAmount: number;
  guaranteeAmountInWords: string;
  guaranteeRatio?: string;
  validityPeriod: string;
}

export type GuaranteeCustomerType = 'hsbc' | 'works_bureau' | 'construction';

// 统一使用枚举定义
export enum PaymentTemplateType {
  WORKS_BUREAU = 'works_bureau',
  HUAWEI = 'huawei',
  CONSTRUCTION = 'construction',
  OTHER = 'other'
}

export enum GuaranteeTemplateType {
  HSBC = 'hsbc',
  WORKS_BUREAU = 'works_bureau',
  CONSTRUCTION = 'construction'
}

export enum PaymentType {
  ADVANCE = 'advance',
  DELIVERY = 'delivery',
  COMPLETION = 'completion',
  WARRANTY = 'warranty'
}

export enum GuaranteeType {
  ADVANCE = 'advance',
  PERFORMANCE = 'performance',
  WARRANTY = 'warranty',
  DELIVERY = 'delivery'
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

export interface PaymentRequest {
  templateType: PaymentTemplateType;
  paymentType: PaymentType;
  contractData: {
    contractNo: string;
    customerName: string;
    projectName: string;
    contractAmount: number;
    signDate: string;
  };
  currentInvestment: number | null;
  previouslyPaid: number | null;
}

export interface ContractInfo {
  projectName: string;
  customerName: string;
  amount: number;
  contractName: string;
  contractNo: string;
  signDate: string;
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
}

export interface WarrantyPaymentRequest {
  warrantyStartDate: string;
  contractNo: string;
  selectedDocs: string[];
  warrantyPeriod: number;
  warrantyAmount: number;
}