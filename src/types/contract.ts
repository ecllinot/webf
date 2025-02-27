// 合同基本信息接口
export interface ContractInfo {
    projectName: string;          // 项目名称
    contractName: string;         // 合同名称
    contractNo: string;           // 合同编号
    projectNo: string;           // 项目编号
    customerName: string;         // 客户名称
    contractAmount: number;       // 合同金额
    signDate: string;            // 签订日期
    startDate?: string;          // 开始日期
    endDate?: string;            // 结束日期
    warrantyStartDate?: string;   // 质保开始日期
    status?: string;             // 合同状态
    paymentTerms?: PaymentTerm[];    // 付款条款
    guaranteeInfo?: GuaranteeInfo[];  // 保函信息
}

// 付款条款接口
export interface PaymentTerm {
    type: string;    // 付款类型
    ratio: number;   // 付款比例
}

// 保函信息接口
export interface GuaranteeInfo {
    advancePaymentRatio: number;      // 预付款保函比例
    advancePaymentValidity: string;   // 预付款保函有效期
    deliveryPaymentRatio: number;     // 到货款保函比例
    deliveryPaymentValidity: string;  // 到货款保函有效期
    warrantyRatio: number;            // 质保金比例
    warrantyValidity: string;         // 质保金有效期
}

// 质保文档接口
export interface WarrantyDocument {
    id: string;      // 文档ID
    name: string;    // 文档名称
    selected: boolean; // 是否选中
}

// 扩展 express-session 的声明
declare module 'express-session' {
    interface SessionData {
        contractData?: ContractInfo;
    }
}