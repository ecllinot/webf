export enum CustomerType {
  WORKS_BUREAU = 'WORKS_BUREAU',
  HUAWEI = 'HUAWEI',
  CONSTRUCTION = 'CONSTRUCTION',
  OTHER = 'OTHER'
}

export enum PaymentType {
  ADVANCE = 'ADVANCE',
  DELIVERY = 'DELIVERY',
  COMPLETION = 'COMPLETION',
  WARRANTY = 'WARRANTY'
}

export interface PaymentRequest {
  customerType: CustomerType;
  paymentType: PaymentType;
  contractName: string;
  contractNumber: string;
  contractAmount: number;
  currentInvestment: number;
  previouslyPaid: number;
}

// 前端特有的状态类型
export interface PaymentFormState {
  customerType: CustomerType;
  paymentType: PaymentType;
  contractName: string;
  contractNumber: string;
  contractAmount: number;
  currentInvestment: number;
  previouslyPaid: number;
}

export interface PaymentUIState {
  isLoading: boolean;
  error?: string;
  previewUrl?: string;
}
