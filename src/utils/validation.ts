// src/utils/validation.ts
import { ContractInfo, PaymentRequest, GuaranteeRequest, WarrantyPaymentRequest } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateContractInfo = (info: ContractInfo): ValidationResult => {
  const errors: string[] = [];

  if (!info.contractNo) {
    errors.push('合同编号不能为空');
  }
  if (!info.customerName) {
    errors.push('客户名称不能为空');
  }
  if (!info.projectName) {
    errors.push('项目名称不能为空');
  }
  if (!info.amount || info.amount <= 0) {
    errors.push('合同金额必须大于0');
  }
  if (!info.signDate) {
    errors.push('签订日期不能为空');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePaymentRequest = (request: PaymentRequest): ValidationResult => {
  const errors: string[] = [];

  if (!request.templateType) {
    errors.push('模板类型不能为空');
  }
  if (!request.paymentType) {
    errors.push('付款类型不能为空');
  }
  if (!request.contractData) {
    errors.push('合同数据不能为空');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateGuaranteeRequest = (request: GuaranteeRequest): ValidationResult => {
  const errors: string[] = [];

  if (!request.templateType) {
    errors.push('保函模板类型不能为空');
  }
  if (!request.guaranteeType) {
    errors.push('保函类型不能为空');
  }
  if (!request.variables) {
    errors.push('保函变量不能为空');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateWarrantyRequest = (request: WarrantyPaymentRequest): ValidationResult => {
  const errors: string[] = [];

  if (!request) {
    return {
      isValid: false,
      errors: ['请求数据不能为空']
    };
  }

  if (!request.warrantyStartDate) {
    errors.push('质保期开始日期不能为空');
  }
  if (!request.contractNo) {
    errors.push('合同编号不能为空');
  }
  if (!Array.isArray(request.selectedDocs) || request.selectedDocs.length === 0) {
    errors.push('请至少选择一个文档');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};