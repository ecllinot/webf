// src/constants/labels.ts
import {
  PaymentTemplateType,
  GuaranteeTemplateType,
  PaymentType,
  GuaranteeType
} from '../types/guarantee.types';

// 付款申请的模板类型标签
export const PAYMENT_TEMPLATE_LABELS: Record<PaymentTemplateType, string> = {
  [PaymentTemplateType.WORKS_BUREAU]: '工务署',
  [PaymentTemplateType.HUAWEI]: '华为客户',
  [PaymentTemplateType.CONSTRUCTION]: '基建客户',
  [PaymentTemplateType.OTHER]: '其他客户'
};

// 保函申请的模板类型标签
export const GUARANTEE_TEMPLATE_LABELS: Record<GuaranteeTemplateType, string> = {
  [GuaranteeTemplateType.HSBC]: '汇丰银行模板',
  [GuaranteeTemplateType.WORKS_BUREAU]: '工务署',
  [GuaranteeTemplateType.CONSTRUCTION]: '基建客户'
};

// 付款类型标签
export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  [PaymentType.ADVANCE]: '预付款申请',
  [PaymentType.DELIVERY]: '到货款申请',
  [PaymentType.COMPLETION]: '竣工款申请',
  [PaymentType.WARRANTY]: '质保金申请'
};

// 保函种类标签
export const GUARANTEE_TYPE_LABELS: Record<GuaranteeType, string> = {
  [GuaranteeType.ADVANCE]: '预付款保函',
  [GuaranteeType.PERFORMANCE]: '履约保函',
  [GuaranteeType.WARRANTY]: '质保金保函',
  [GuaranteeType.DELIVERY]: '发货款保函'
};