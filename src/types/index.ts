// src/types/index.ts

export enum PaymentTemplateType {
    WORKS_BUREAU = 'works_bureau',
    HUAWEI = 'huawei',
    CONSTRUCTION = 'construction'
  }
  
  export enum PaymentType {
    ADVANCE = 'advance',
    DELIVERY = 'delivery',
    COMPLETION = 'completion',
    WARRANTY = 'warranty'
  }
  
  export enum GuaranteeTemplateType {
    HSBC = 'hsbc',
    WORKS_BUREAU = 'works_bureau',
    CONSTRUCTION = 'construction'
  }
  
  export enum GuaranteeType {
    ADVANCE = 'advance',
    PERFORMANCE = 'performance',
    WARRANTY = 'warranty',
    DELIVERY = 'delivery'
  }
  
  export interface ContractInfo {
    projectName: string;
    customerName: string;
    amount: number;
    contractName: string;
    contractNo: string;
    signDate: string;
  }
  
  export interface PaymentRequest {
    templateType: PaymentTemplateType;
    paymentType: PaymentType;
    contractData: {
      contractNo: string;
      contractName: string;
      customerName: string;
      projectName: string;
      contractAmount: number;
      signDate: string;
      currentInvestment?: number;
      previouslyPaid?: number;
    };
    paymentAmount?: number;
    paymentRatio?: number;
  }
  
  export interface ContractData {
      contractNo: string;
      contractName: string;
      contractAmount: number;
      currentInvestment?: number;
      customerName: string;
      projectName: string;
      signDate: string;
  }
  
  export interface PaymentInfo {
      templateType: string;
      paymentType: string;
      currentInvestment?: number;
      paymentAmount: number;
  }
  
  // 更新后的保函申请请求接口
  export interface GuaranteeRequest {
      templateType: GuaranteeTemplateType;
      guaranteeType: GuaranteeType;
      contractData: {
          contractNo: string;
          contractName: string;
          customerName: string;
          projectName: string;
          contractAmount: number;
          signDate: string;
          validityPeriod: string;
          guaranteeInfo: GuaranteeInfo;
      };
  }
  
  // 更新后的保函信息接口
  export interface GuaranteeInfo {
      advancePaymentRatio: number;
      advancePaymentValidity: string;
      deliveryPaymentRatio: number;
      deliveryPaymentValidity: string;
      performanceRatio: number;
      warrantyRatio: number;
      warrantyValidity: string;
  }
  
  export interface PaymentTerm {
      type: PaymentType;
      ratio: number;
  }
  
  export interface WarrantyInfo {
      warrantyStartDate: string;
      selectedDocuments: string[];
  }
  
  export interface WarrantyPaymentRequest {
      warrantyStartDate: string;
      contractNo: string;
      selectedDocs: string[];
      warrantyPeriod: number;
      warrantyAmount: number;
  }
  
  export interface WarrantyDocument {
      id: string;
      name: string;
      selected: boolean;
      type?: string;
  }
  
  export interface ApiResponse {
      success: boolean;
      message?: string;
      data?: any;
  }
  
  export interface FileProcessResult {
      success: boolean;
      message?: string;
      data?: {
          path: string;
          name: string;
      }[];
  }
  
  export interface DocumentRequest {
      type: string;
      data: any;
  }
  
  export interface ValidationResult {
      isValid: boolean;
      errors: string[];
  }
  
  export interface DocumentGenerationResult {
      success: boolean;
      message?: string;
      previewUrl?: string;
      downloadUrl?: string;
  }
  
  export interface DocumentTemplate {
      id: string;
      name: string;
      type: string;
      variables: string[];
  }
  
  export interface GenerationOptions {
      template: DocumentTemplate;
      data: Record<string, any>;
      outputFormat: 'docx' | 'pdf';
  }