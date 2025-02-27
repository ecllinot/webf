import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Search, Menu, Globe, User, FileText, CreditCard, Shield, Flag } from 'lucide-react';
import { apiService } from './services/api';
import type {
  ContractInfo,
  GuaranteeInfo,
  PaymentTerm,
  WarrantyDocument,
  PaymentRequest,
  GuaranteeRequest,
  WarrantyPaymentRequest
} from './types';
import {
  PaymentTemplateType,
  PaymentType,
  GuaranteeType,
  GuaranteeTemplateType
} from './types/enums';  // 创建新文件存放枚举类型
import {
  validateContractInfo,
  validatePaymentRequest,
  validateGuaranteeRequest,
  validateWarrantyRequest
} from './utils/validation';
import {
  PAYMENT_TEMPLATE_LABELS,
  GUARANTEE_TEMPLATE_LABELS,
  PAYMENT_TYPE_LABELS,
  GUARANTEE_TYPE_LABELS
} from './constants/labels';



function App() {
  // 1. 首先声明所有的状态
  // 基础状态
  const [activeSection, setActiveSection] = useState('contract');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [warrantyStartDate, setWarrantyStartDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [investmentValue, setInvestmentValue] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // 合同信息状态
  const [contractInfo, setContractInfo] = useState<ContractInfo>({
    projectName: '',
    customerName: '',
    amount: 0,
    contractName: '',
    contractNo: '',
    signDate: ''
  });

  // 保函信息状态 - 移到这里
  const [guaranteeInfo, setGuaranteeInfo] = useState<GuaranteeInfo>({
    advancePaymentRatio: 0,
    advancePaymentValidity: '',
    deliveryPaymentRatio: 0,
    deliveryPaymentValidity: '',
    warrantyRatio: 0,
    warrantyValidity: ''
  });

  // 付款条款状态
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([
    { type: PaymentType.ADVANCE, ratio: 0 },
    { type: PaymentType.DELIVERY, ratio: 0 },
    { type: PaymentType.COMPLETION, ratio: 0 },
    { type: PaymentType.WARRANTY, ratio: 0 }
  ]);

  // 付款申请状态
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>({
    templateType: PaymentTemplateType.WORKS_BUREAU,
    paymentType: PaymentType.ADVANCE,
    contractData: {
      contractNo: '',
      customerName: '',
      projectName: '',
      contractAmount: 0,
      signDate: ''
    },
    currentInvestment: null,
    previouslyPaid: null
  });

  // 保函申请状态
  const [guaranteeRequest, setGuaranteeRequest] = useState<GuaranteeRequest>({
    templateType: GuaranteeTemplateType.HSBC,
    guaranteeType: GuaranteeType.ADVANCE,
    variables: {
      contractNo: '',
      customerName: '',
      projectName: '',
      contractAmount: 0,
      validityPeriod: ''
    }
  });

  // 质保金申请状态
  const [warrantyPaymentRequest, setWarrantyPaymentRequest] = useState<WarrantyPaymentRequest>({
    warrantyStartDate: '',
    contractNo: '',
    selectedDocs: [],
    warrantyPeriod: 0,
    warrantyAmount: 0
  });

  // 质保文档状态
  const [warrantyDocuments, setWarrantyDocuments] = useState<WarrantyDocument[]>([
  { 
    id: 'warranty_certificate', 
    name: '华为基建工程合同保修期满证书',
    selected: false,
    type: 'docx'
  },
  { 
    id: 'warranty_payment_application', 
    name: '华为基建工程合同保修款申请表-保修期通用',
    selected: false,
    type: 'docx'
  },
  { 
    id: 'warranty_payment_approval', 
    name: '华为基建工程合同保修款审批表',
    selected: false,
    type: 'docx'
  },
  { 
    id: 'warranty_equipment_evaluation', 
    name: '质保期设备设施使用评估表',
    selected: false,
    type: 'docx'
  },
  { 
    id: 'warranty_issue_statistics', 
    name: '承包商保修事项及遗留问题统计表',
    selected: false,
    type: 'xlsx'
  },
  { 
    id: 'warranty_deduction_list', 
    name: '华为基建工程合同保修期问题扣款清单',
    selected: false,
    type: 'xlsx'
  }
]);

  // 2. 然后是所有的 useEffect
// 添加新的 useEffect 用于清理数据
useEffect(() => {
  const handleBeforeUnload = () => {
    // 清理所有状态
    setContractInfo({
      projectName: '',
      customerName: '',
      amount: 0,
      contractName: '',
      contractNo: '',
      signDate: ''
    });
    setGuaranteeInfo({
      advancePaymentRatio: 0,
      advancePaymentValidity: '',
      deliveryPaymentRatio: 0,
      deliveryPaymentValidity: '',
      warrantyRatio: 0,
      warrantyValidity: ''
    });
    setPaymentTerms([
      { type: PaymentType.ADVANCE, ratio: 0 },
      { type: PaymentType.DELIVERY, ratio: 0 },
      { type: PaymentType.COMPLETION, ratio: 0 },
      { type: PaymentType.WARRANTY, ratio: 0 }
    ]);
    setWarrantyStartDate('');
    setInvestmentValue(0);
    setPaidAmount(0);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    handleBeforeUnload(); // 组件卸载时也清理数据
  };
}, []);

  useEffect(() => {
    if (activeSection === 'payment') {
      setPaymentRequest(prev => ({
        ...prev,
        contractData: {
          contractNo: contractInfo.contractNo,
          customerName: contractInfo.customerName,
          projectName: contractInfo.projectName,
          contractAmount: contractInfo.amount,
          signDate: contractInfo.signDate
        }
      }));
    } else if (activeSection === 'guarantee') {
      setGuaranteeRequest(prev => ({
        ...prev,
        variables: {
          contractNo: contractInfo.contractNo,
          customerName: contractInfo.customerName,
          projectName: contractInfo.projectName,
          contractAmount: contractInfo.amount,
          validityPeriod: guaranteeInfo.advancePaymentValidity
        }
      }));
    } else if (activeSection === 'warranty') {
      setWarrantyPaymentRequest(prev => ({
        ...prev,
        contractNo: contractInfo.contractNo
      }));
    }
  }, [activeSection, contractInfo, guaranteeInfo]);

  

  // 计算总付款比例
  const totalPaymentRatio = paymentTerms.reduce((sum, term) => sum + term.ratio, 0);

// 添加新的处理函数
const handlePaymentTemplateTypeSelect = (type: PaymentTemplateType) => {
  console.log('Selected customer type:', type);
  setPaymentRequest(prev => ({
    ...prev,
    templateType: type,
    contractData: {
      ...contractInfo,
      contractAmount: contractInfo.amount,
      currentInvestment: investmentValue,
      previouslyPaid: paidAmount
    }
  }));
};

const handleGuaranteeTemplateTypeSelect = (type: GuaranteeTemplateType) => {
  setGuaranteeRequest(prev => ({
    ...prev,
    templateType: type,
  }));
};


  // 处理函数
  const handlePaymentTermChange = (index: number, field: 'type' | 'ratio', value: PaymentType | number) => {
    const newPaymentTerms = [...paymentTerms];
    if (field === 'ratio') {
      const newRatio = Number(value);
      if (totalPaymentRatio - paymentTerms[index].ratio + newRatio > 100) {
        alert('付款比例总和不能超过100%');
        return;
      }
      newPaymentTerms[index].ratio = newRatio;
    } else {
      newPaymentTerms[index].type = value as PaymentType;
    }
    setPaymentTerms(newPaymentTerms);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleWarrantyDocumentSelect = (id: string) => {
    setWarrantyDocuments(docs =>
      docs.map(doc =>
        doc.id === id ? { ...doc, selected: !doc.selected } : doc
      )
    );
  };



  const handlePaymentTypeSelect = (type: PaymentType) => {
    setPaymentRequest(prev => ({ ...prev, paymentType: type }));
  };

  const handleGuaranteeTypeSelect = (type: GuaranteeType) => {
    setGuaranteeRequest(prev => ({ ...prev, guaranteeType: type }));
  };

const handleSave = async () => {
  setIsLoading(true);
  try {
    const validation = validateContractInfo(contractInfo);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    const dataToSave = {
      contractInfo,
      paymentTerms,
      guaranteeInfo
    };


    const result = await apiService.contract.saveContract(dataToSave);
    alert('保存成功！');
    
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert('保存时发生未知错误');
    }
    console.error('Error saving contract info:', error);
  } finally {
    setIsLoading(false);
  }
};




  const handleReset = () => {
    setContractInfo({
      projectName: '',
      customerName: '',
      amount: 0,
      contractName: '',
      contractNo: '',
      signDate: ''
    });
    setGuaranteeInfo({
      advancePaymentRatio: 0,
      advancePaymentValidity: '',
      deliveryPaymentRatio: 0,
      deliveryPaymentValidity: '',
      warrantyRatio: 0,
      warrantyValidity: ''
    });
    setPaymentTerms([
      { type: PaymentType.ADVANCE, ratio: 0 },
      { type: PaymentType.DELIVERY, ratio: 0 },
      { type: PaymentType.COMPLETION, ratio: 0 },
      { type: PaymentType.WARRANTY, ratio: 0 }
    ]);
  };

const handleGeneratePaymentDocs = async () => {
  setIsLoading(true);
  try {
    const updatedPaymentRequest = {
      ...paymentRequest,
      contractData: {
        contractNo: contractInfo.contractNo,
        customerName: contractInfo.customerName,
        projectName: contractInfo.projectName,
        contractAmount: contractInfo.amount,
        signDate: contractInfo.signDate,
        currentInvestment: investmentValue,
        previouslyPaid: paidAmount
      }
    };

    const validation = validatePaymentRequest(updatedPaymentRequest);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    const result = await apiService.payment.generateDocuments(updatedPaymentRequest);

    if (result.data instanceof Blob) {
      const url = URL.createObjectURL(result.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `付款申请_${new Date().getTime()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      throw new Error('生成文档失败');
    }
  } catch (error) {
    console.error('Error generating payment documents:', error);
    alert(error instanceof Error ? error.message : '生成文档失败');
  } finally {
    setIsLoading(false);
  }
};


const handleGenerateGuaranteeDocs = async () => {
  setIsLoading(true);
  try {
    if (!contractInfo.contractNo) {
      throw new Error('请先保存合同信息');
    }

    // 获取有效期和比例
    let validityPeriod = '';
    let guaranteeRatio = 0;
    switch (guaranteeRequest.guaranteeType) {
      case GuaranteeType.ADVANCE:
        validityPeriod = guaranteeInfo.advancePaymentValidity;
        guaranteeRatio = guaranteeInfo.advancePaymentRatio;
        break;
      case GuaranteeType.DELIVERY:
        validityPeriod = guaranteeInfo.deliveryPaymentValidity;
        guaranteeRatio = guaranteeInfo.deliveryPaymentRatio;
        break;
      case GuaranteeType.PERFORMANCE:
        validityPeriod = guaranteeInfo.deliveryPaymentValidity;
        guaranteeRatio = guaranteeInfo.deliveryPaymentRatio;
        break;
      case GuaranteeType.WARRANTY:
        validityPeriod = guaranteeInfo.warrantyValidity;
        guaranteeRatio = guaranteeInfo.warrantyRatio;
        break;
    }

    if (!validityPeriod) {
      const guaranteeTypeLabel = {
        [GuaranteeType.ADVANCE]: '预付款保函',
        [GuaranteeType.DELIVERY]: '发货款保函',
        [GuaranteeType.PERFORMANCE]: '履约保函',
        [GuaranteeType.WARRANTY]: '质保金保函'
      }[guaranteeRequest.guaranteeType];
      throw new Error(`请在合同信息中填写${guaranteeTypeLabel}的有效期`);
    }

    // 计算保函金额
    const guaranteeAmount = (contractInfo.amount * guaranteeRatio) / 100;

    // 构建请求数据
    const requestData = {
      templateType: guaranteeRequest.templateType,
      guaranteeType: guaranteeRequest.guaranteeType,
      contractData: {
        contractNo: contractInfo.contractNo,
        contractName: contractInfo.contractName,
        customerName: contractInfo.customerName,
        projectName: contractInfo.projectName,
        contractAmount: contractInfo.amount,
        signDate: contractInfo.signDate,
        validityPeriod: validityPeriod,
       guaranteeInfo: {
      advancePaymentRatio: guaranteeInfo.advancePaymentRatio,
      performanceRatio: guaranteeInfo.deliveryPaymentRatio,
      warrantyRatio: guaranteeInfo.warrantyRatio,
      advancePaymentValidity: guaranteeInfo.advancePaymentValidity,
      deliveryPaymentValidity: guaranteeInfo.deliveryPaymentValidity,
      warrantyValidity: guaranteeInfo.warrantyValidity
    }
  }
};

    console.log('Guarantee request data:', requestData);

    const result = await apiService.guarantee.generateDocuments(requestData);
    if (result.data instanceof Blob) {
      const url = URL.createObjectURL(result.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `保函申请_${new Date().getTime()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      throw new Error('生成文档失败');
    }

  } catch (error) {
    console.error('Error generating guarantee documents:', error);
    alert(error instanceof Error ? error.message : '生成文档失败');
  } finally {
    setIsLoading(false);
  }
};



const handleGenerateWarrantyDocs = async () => {
  setIsLoading(true);
  try {
    if (!contractInfo || !contractInfo.contractNo) {
      throw new Error('请先保存合同信息');
    }

    if (!warrantyStartDate) {
      throw new Error('请选择质保期开始日期');
    }

    const selectedDocs = warrantyDocuments.filter(doc => doc.selected);
    if (selectedDocs.length === 0) {
      throw new Error('请至少选择一个文档');
    }

    // 计算质保金相关金额
    const contractAmount = Number(contractInfo.amount);
    const warrantyRatio = 0.03; // 3%的质保金比例
    const warrantyAmount = contractAmount * warrantyRatio;

    // 计算质保期结束日期（开始日期加24个月）
    const startDate = new Date(warrantyStartDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 24);

    // 格式化日期
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
    };

    const requestData = {
      warrantyStartDate: formatDate(startDate),
      warrantyEndDate: formatDate(endDate),
      contractData: {
        contractNo: contractInfo.contractNo,
        contractName: contractInfo.contractName,
        customerName: contractInfo.customerName,
        projectName: contractInfo.projectName,
        contractAmount: contractAmount,
        warrantyAmount: warrantyAmount,
        warrantyRatio: `${warrantyRatio * 100}%`,
        // 添加付款相关信息
        paymentTerms: paymentTerms.map(term => ({
          type: term.type,
          ratio: term.ratio,
          amount: (contractAmount * term.ratio) / 100
        })),
        // 添加投资和已付金额信息
        currentInvestment: investmentValue,
        previouslyPaid: paidAmount,
        // 添加签订日期
        signDate: contractInfo.signDate,
        // 添加质保期信息
        warrantyPeriod: '24个月',
        warrantyStartDate: formatDate(startDate),
        warrantyEndDate: formatDate(endDate)
      },
      selectedDocs: selectedDocs.map(doc => doc.id)
    };

    console.log('Sending warranty request:', requestData);

    const result = await apiService.warranty.generateDocuments(requestData);
    
    if (result.data instanceof Blob) {
      const url = URL.createObjectURL(result.data);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().getTime();
      const fileExtension = selectedDocs.length === 1 ? 
        `.${selectedDocs[0].type}` : '.zip';
      link.download = `质保金申请_${contractInfo.contractNo}_${timestamp}${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      throw new Error('生成文档失败');
    }

  } catch (error) {
    console.error('Error generating warranty documents:', error);
    alert(error instanceof Error ? error.message : '生成质保金文档失败');
  } finally {
    setIsLoading(false);
  }
};


const handleDocumentDownload = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // 清理URL对象
};

// 添加在组件内部，处理函数部分
const calculatePaymentAmount = () => {
  // 工务署客户的付款计算
  if (paymentRequest.templateType === PaymentTemplateType.WORKS_BUREAU) {
    switch (paymentRequest.paymentType) {
      case PaymentType.ADVANCE:
        return contractInfo.amount * 0.3; // 30%预付款
      case PaymentType.DELIVERY:
        return contractInfo.amount * 0.5; // 50%到货款
      case PaymentType.COMPLETION:
        return contractInfo.amount * 0.1; // 10%竣工款
      case PaymentType.WARRANTY:
        return contractInfo.amount * 0.1; // 10%质保金
      default:
        return 0;
    }
  }
  
  // 华为和基建客户的累计计算
  if ([PaymentTemplateType.HUAWEI, PaymentTemplateType.CONSTRUCTION].includes(paymentRequest.templateType)) {
    switch (paymentRequest.paymentType) {
      case PaymentType.ADVANCE:
        return contractInfo.amount * 0.1; // 10%预付款
      case PaymentType.DELIVERY:
        return investmentValue * 0.8 - paidAmount; // 80%到货款
      case PaymentType.COMPLETION:
        return investmentValue * 0.97 - paidAmount; // 97%竣工款
      case PaymentType.WARRANTY:
        return investmentValue - paidAmount; // 100%质保金
      default:
        return 0;
    }
  }

  return 0;
};

const calculateGuaranteeAmount = () => {
  // 工务署保函金额计算
  if (guaranteeRequest.templateType === GuaranteeTemplateType.WORKS_BUREAU) {
    switch (guaranteeRequest.guaranteeType) {
      case GuaranteeType.ADVANCE:
        return contractInfo.amount * 0.3; // 30%预付款保函
      case GuaranteeType.DELIVERY:
        return contractInfo.amount * 0.5; // 50%发货款保函
      default:
        return 0;
    }
  }
  
  // 汇丰银行保函金额计算（使用用户录入的比例）
  if (guaranteeRequest.templateType === GuaranteeTemplateType.HSBC) {
    switch (guaranteeRequest.guaranteeType) {
      case GuaranteeType.ADVANCE:
        return contractInfo.amount * (guaranteeInfo.advancePaymentRatio / 100);
      case GuaranteeType.PERFORMANCE:
        return contractInfo.amount * (guaranteeInfo.deliveryPaymentRatio / 100);
      case GuaranteeType.WARRANTY:
        return contractInfo.amount * (guaranteeInfo.warrantyRatio / 100);
      default:
        return 0;
    }
  }
  
  // 基建客户保函金额计算
  if (guaranteeRequest.templateType === GuaranteeTemplateType.CONSTRUCTION) {
    switch (guaranteeRequest.guaranteeType) {
      case GuaranteeType.ADVANCE:
        return contractInfo.amount * 0.1; // 10%预付款保函
      case GuaranteeType.WARRANTY:
        return contractInfo.amount * 0.03; // 3%质保函
      default:
        return 0;
    }
  }

  return 0;
};

// 质保金金额计算保持不变，统一为3%
const calculateWarrantyAmount = () => {
  return contractInfo.amount * 0.03; // 3%质保金
};

// 添加一个用于显示计算公式的函数
const generateCalculationFormula = () => {
  if ([PaymentTemplateType.HUAWEI, PaymentTemplateType.CONSTRUCTION].includes(paymentRequest.templateType)) {
    switch (paymentRequest.paymentType) {
      case PaymentType.ADVANCE:
        return `预付款金额 = 合同金额(${contractInfo.amount}) × 10%`;
      case PaymentType.DELIVERY:
        return `到货款金额 = 本期投资估值(${investmentValue}) × 80% - 已付款金额(${paidAmount})`;
      case PaymentType.COMPLETION:
        return `竣工款金额 = 本期投资估值(${investmentValue}) × 97% - 已付款金额(${paidAmount})`;
      case PaymentType.WARRANTY:
        return `质保金金额 = 本期投资估值(${investmentValue}) × 100% - 已付款金额(${paidAmount})`;
      default:
        return '';
    }
  }
  
  // 工务署的计算公式
  if (paymentRequest.templateType === PaymentTemplateType.WORKS_BUREAU) {
    const ratios = {
      [PaymentType.ADVANCE]: '30%',
      [PaymentType.DELIVERY]: '50%',
      [PaymentType.COMPLETION]: '10%',
      [PaymentType.WARRANTY]: '10%'
    };
    return `付款金额 = 合同金额(${contractInfo.amount}) × ${ratios[paymentRequest.paymentType]}`;
  }

  return '';
};


// 在显示计算结果的地方
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount);
};


// 获取可用的保函种类
const getAvailableGuaranteeTypes = (templateType: GuaranteeTemplateType) => {
  const guaranteeTypes = {
    [GuaranteeTemplateType.HSBC]: [
      { id: GuaranteeType.ADVANCE, label: '预付款保函' },
      { id: GuaranteeType.PERFORMANCE, label: '履约保函' },
      { id: GuaranteeType.WARRANTY, label: '质保金保函' }
    ],
    [GuaranteeTemplateType.WORKS_BUREAU]: [
      { id: GuaranteeType.ADVANCE, label: '预付款保函' },
      { id: GuaranteeType.DELIVERY, label: '发货款保函' }
    ],
    [GuaranteeTemplateType.CONSTRUCTION]: [
      { id: GuaranteeType.ADVANCE, label: '预付款保函' },
      { id: GuaranteeType.WARRANTY, label: '质保金保函' }
    ]
  };

  return guaranteeTypes[templateType] || [];
};
return (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <header className="bg-white fixed w-full top-0 z-50">
      <div className="bg-[#FF000D] text-white">
        <div className="w-full px-4">
          <div className="flex justify-between h-12 items-center">
            <div className="flex space-x-6">
              <button 
                onClick={toggleSidebar}
                className="hover:bg-[#CC000A] p-2 rounded"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button className="hover:bg-[#CC000A] p-2 rounded">
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="flex space-x-6">
              <button className="hover:bg-[#CC000A] p-2 rounded">
                <Globe className="w-5 h-5" />
              </button>
              <button className="hover:bg-[#CC000A] p-2 rounded">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <div className="w-full px-4">
          <div className="flex h-20 items-center">
            <div className="text-2xl font-light text-gray-900">智能合同信息系统</div>
          
          </div>
        </div>
      </div>
    </header>

    {/* Sidebar */}
    <aside className={`fixed left-0 top-32 h-[calc(100vh-8rem)] bg-white border-r border-gray-200 transition-all duration-300 ${
      isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
    }`}>
      <nav className="h-full py-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveSection('contract')}
              className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-[#FF000D] ${
                activeSection === 'contract' ? 'bg-red-50 text-[#FF000D]' : ''
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              <span>合同信息录入</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('payment')}
              className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-[#FF000D] ${
                activeSection === 'payment' ? 'bg-red-50 text-[#FF000D]' : ''
              }`}
            >
              <CreditCard className="w-5 h-5 mr-3" />
              <span>付款申请</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('guarantee')}
              className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-[#FF000D] ${
                activeSection === 'guarantee' ? 'bg-red-50 text-[#FF000D]' : ''
              }`}
            >
              <Shield className="w-5 h-5 mr-3" />
              <span>保函申请</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('warranty')}
              className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-[#FF000D] ${
                activeSection === 'warranty' ? 'bg-red-50 text-[#FF000D]' : ''
              }`}
            >
              <Flag className="w-5 h-5 mr-3" />
              <span>质保金申付材料</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    {/* Main Content */}
    <main className="pt-32 pl-64 pr-4 pb-4">
      <div className="max-w-7xl mx-auto">
        {activeSection === 'contract' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* 第一行：签订日期和合同金额 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">签订日期</label>
                <input
                  type="date"
                  value={contractInfo.signDate}
                  onChange={(e) => setContractInfo({ ...contractInfo, signDate: e.target.value })}
                  className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                  placeholder="请输入签订日期（必填）"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">合同金额</label>
                <input
                  type="number"
                  value={contractInfo.amount || ''}
                  onChange={(e) => setContractInfo({ ...contractInfo, amount: Number(e.target.value) })}
                  className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                  placeholder="请输入合同金额"
                  required
                />
              </div>

              {/* 第二行：合同名称和客户名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">合同名称</label>
                <input
                  type="text"
                  value={contractInfo.contractName}
                  onChange={(e) => setContractInfo({ ...contractInfo, contractName: e.target.value })}
                  className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                  placeholder="请输入合同名称"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">客户名称</label>
                <input
                  type="text"
                  value={contractInfo.customerName || ''}
                  onChange={(e) => setContractInfo({ ...contractInfo, customerName: e.target.value })}
                  className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                  placeholder="请输入客户名称"
                  required
                />
              </div>

              {/* 第三行：项目名称和合同编号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">项目名称</label>
                <input
                  type="text"
                  value={contractInfo.projectName}
                  onChange={(e) => setContractInfo({ ...contractInfo, projectName: e.target.value })}
                  className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                  placeholder="请输入项目名称"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">合同编号</label>
                <input
                  type="text"
                  value={contractInfo.contractNo}
                  onChange={(e) => setContractInfo({ ...contractInfo, contractNo: e.target.value })}
                  className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                  placeholder="请输入合同编号"
                  required
                />
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mt-12 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">付款条款信息录入</h3>
              <div className="space-y-4">
                {paymentTerms.map((term, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <select
                        value={term.type}
                        onChange={(e) => handlePaymentTermChange(index, 'type', e.target.value as PaymentType)}
                        className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                      >
                        <option value="">选择付款类型</option>
                        {Object.values(PaymentType).map((type) => (
                          <option key={type} value={type}>{PAYMENT_TYPE_LABELS[type]}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32 flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={term.ratio}
                        onChange={(e) => handlePaymentTermChange(index, 'ratio', Number(e.target.value))}
                        className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">保函信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">预付款保函比例</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={guaranteeInfo.advancePaymentRatio}
                      onChange={(e) => setGuaranteeInfo({ ...guaranteeInfo, advancePaymentRatio: Number(e.target.value) })}
                      className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">预付款保函有效期</label>
                  <input
                    type="date"
                    value={guaranteeInfo.advancePaymentValidity}
                    onChange={(e) => setGuaranteeInfo({ ...guaranteeInfo, advancePaymentValidity: e.target.value })}
                    className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">履约保函比例</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={guaranteeInfo.deliveryPaymentRatio}
                      onChange={(e) => setGuaranteeInfo({ ...guaranteeInfo, deliveryPaymentRatio: Number(e.target.value) })}
                      className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">履约保函有效期</label>
                  <input
                    type="date"
                    value={guaranteeInfo.deliveryPaymentValidity}
                    onChange={(e) => setGuaranteeInfo({ ...guaranteeInfo, deliveryPaymentValidity: e.target.value })}
                    className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">质保金保函比例</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={guaranteeInfo.warrantyRatio}
                      onChange={(e) => setGuaranteeInfo({ ...guaranteeInfo, warrantyRatio: Number(e.target.value) })}
                      className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">质保金保函有效期</label>
                  <input
                    type="date"
                    value={guaranteeInfo.warrantyValidity}
                    onChange={(e) => setGuaranteeInfo({ ...guaranteeInfo, warrantyValidity: e.target.value })}
                    className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 h-12 text-white bg-[#FF000D] rounded-lg hover:bg-[#CC000A] transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {isLoading ? '保存中...' : '保存'}
              </button>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="flex-1 h-12 text-[#FF000D] border border-[#FF000D] rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                重置
              </button>
            </div>
          </div>
        )}

{activeSection === 'payment' && (
  <div className="bg-white rounded-lg shadow-sm p-8">
    {/* Template Type Selection */}
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">客户类型选择</h3>
      <div className="grid grid-cols-3 gap-4">
        {Object.values(PaymentTemplateType).map((type) => (
          <button
            key={type}
            onClick={() => handlePaymentTemplateTypeSelect(type)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              paymentRequest.templateType === type
                ? 'bg-red-50 text-[#FF000D] border-[#FF000D]'
                : 'border-gray-300 hover:bg-red-50 hover:border-[#FF000D]'
            }`}
          >
            {PAYMENT_TEMPLATE_LABELS[type]}
          </button>
        ))}
      </div>
    </div>

    {/* Payment Type Selection */}
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">付款类型选择</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.values(PaymentType).map((type) => (
          <button
            key={type}
            onClick={() => handlePaymentTypeSelect(type)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              paymentRequest.paymentType === type
                ? 'bg-red-50 text-[#FF000D] border-[#FF000D]'
                : 'border-gray-300 hover:bg-red-50 hover:border-[#FF000D]'
            }`}
          >
            {PAYMENT_TYPE_LABELS[type]}
          </button>
        ))}
      </div>
    </div>

    {/* Investment Value and Paid Amount */}
    {[PaymentTemplateType.HUAWEI, PaymentTemplateType.CONSTRUCTION].includes(paymentRequest.templateType) && (
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            本期完成投资估值
          </label>
          <input
            type="number"
            value={investmentValue}
            onChange={(e) => setInvestmentValue(Number(e.target.value))}
            className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            已付款金额
          </label>
          <input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
            className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
          />
        </div>
      </div>
    )}

    {/* Generate Button */}
    <div className="mt-8">
      <button
        onClick={handleGeneratePaymentDocs}
        disabled={isLoading}
        className="w-full px-6 py-3 text-white bg-[#FF000D] rounded-lg hover:bg-[#CC000A] transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {isLoading ? (
          <span className="mr-2">生成中...</span>
        ) : (
          <>
            <FileText className="w-5 h-5 mr-2" />
            <span>生成付款申请文档</span>
          </>
        )}
      </button>
    </div>
  </div>
)}

 {activeSection === 'guarantee' && (
  <div className="bg-white rounded-lg shadow-sm p-8">
    {/* Template Type Selection */}
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">保函类型选择</h3>
      <div className="grid grid-cols-3 gap-4">
        {Object.values(GuaranteeTemplateType).map((type) => (
          <button
            key={type}
            onClick={() => handleGuaranteeTemplateTypeSelect(type)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              guaranteeRequest.templateType === type
                ? 'bg-red-50 text-[#FF000D] border-[#FF000D]'
                : 'border-gray-300 hover:bg-red-50 hover:border-[#FF000D]'
            }`}
          >
            {GUARANTEE_TEMPLATE_LABELS[type]}
          </button>
        ))}
      </div>
    </div>

    {/* Guarantee Type Selection */}
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">保函种类选择</h3>
      <div className="grid grid-cols-2 gap-4">
        {getAvailableGuaranteeTypes(guaranteeRequest.templateType).map((type) => (
          <button
            key={type.id}
            onClick={() => handleGuaranteeTypeSelect(type.id)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              guaranteeRequest.guaranteeType === type.id
                ? 'bg-red-50 text-[#FF000D] border-[#FF000D]'
                : 'border-gray-300 hover:bg-red-50 hover:border-[#FF000D]'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>

    {/* Generate Button */}
    <div className="mt-8">
      <button
        onClick={handleGenerateGuaranteeDocs}
        disabled={isLoading}
        className="w-full px-6 py-3 text-white bg-[#FF000D] rounded-lg hover:bg-[#CC000A] transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {isLoading ? (
          <span className="mr-2">生成中...</span>
        ) : (
          <>
            <Shield className="w-5 h-5 mr-2" />
            <span>生成保函申请文档</span>
          </>
        )}
      </button>
    </div>
  </div>
)}

  {activeSection === 'warranty' && (
  <div className="bg-white rounded-lg shadow-sm p-8">
    {/* Warranty Start Date */}
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">质保期开始日</label>
      <input
        type="date"
        value={warrantyStartDate}
        onChange={(e) => setWarrantyStartDate(e.target.value)}
        className="block w-full h-12 px-4 rounded-lg border focus:ring-2 transition-colors"
      />
    </div>

    {/* Document Selection */}
    <div className="space-y-4 mb-8">
      {warrantyDocuments.map(doc => (
        <div key={doc.id} className="flex items-center">
          <input
            type="checkbox"
            id={`doc-${doc.id}`}
            checked={doc.selected}
            onChange={() => handleWarrantyDocumentSelect(doc.id)}
            className="w-4 h-4 text-[#FF000D] border-gray-300 rounded focus:ring-[#FF000D]"
          />
          <label htmlFor={`doc-${doc.id}`} className="ml-3 text-sm text-gray-700">
            {doc.name}
          </label>
        </div>
      ))}
    </div>

    {/* Generate Button */}
    <div className="mt-8">
      <button
        onClick={handleGenerateWarrantyDocs}
        disabled={isLoading}
        className="w-full px-6 py-3 text-white bg-[#FF000D] rounded-lg hover:bg-[#CC000A] transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {isLoading ? (
          <span className="mr-2">生成中...</span>
        ) : (
          <>
            <Flag className="w-5 h-5 mr-2" />
            <span>生成质保金申请文档</span>
         </>
        )}
      </button>
    </div>
  </div>
)}
      </div>
    </main>
  </div>
);
}

export default App;