// src/config/paymentRatios.ts

import { CustomerType, PaymentType, PaymentRatios } from '../types/payment.types';

export const PAYMENT_RATIOS: PaymentRatios = {
  [CustomerType.WORKS_BUREAU]: {
    [PaymentType.ADVANCE]: 0.30,     // 预付款 30%
    [PaymentType.DELIVERY]: 0.50,    // 发货款 50%
    [PaymentType.COMPLETION]: 0.10,  // 竣工款 10%
    [PaymentType.WARRANTY]: 0.10     // 质保金 10%
  },
  [CustomerType.HUAWEI]: {
    [PaymentType.ADVANCE]: 0.10,     // 预付款 10%
    [PaymentType.DELIVERY]: 0.80,    // 到货款 80%
    [PaymentType.COMPLETION]: 0.07,  // 竣工款 7%
    [PaymentType.WARRANTY]: 0.03     // 质保金 3%
  },
  [CustomerType.CONSTRUCTION]: {
    [PaymentType.ADVANCE]: 0.10,     // 预付款 10%
    [PaymentType.DELIVERY]: 0.80,    // 到货款 80%
    [PaymentType.COMPLETION]: 0.07,  // 竣工款 7%
    [PaymentType.WARRANTY]: 0.03     // 质保金 3%
  }
};