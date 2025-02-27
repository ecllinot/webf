// src/services/api.ts
import axios from 'axios';
import type {
  ContractInfo,
  PaymentRequest,
  GuaranteeRequest,
  WarrantyPaymentRequest,
  ApiResponse,
  DocumentGenerationResult,
  ValidationResult,
  WarrantyRequest,
  WarrantyDocumentType
} from '../types';

const API_BASE_URL = '/api';

// 统一的错误处理函数
const handleError = (error: any, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response) {
      throw new Error(`请求失败: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('网络请求失败，请检查网络连接');
    }
  }
  console.error('API Error:', error);
  throw new Error(defaultMessage);
};

export const apiService = {
  payment: {
    generateDocuments: async (data: PaymentRequest): Promise<{ data: Blob }> => {
      try {
        const response = await axios.post(`${API_BASE_URL}/payment/generate`, data, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        });
        return { data: response.data };
      } catch (error) {
        throw handleError(error, '生成付款文档失败');
      }
    }
  },

  guarantee: {
    generateDocuments: async (data: GuaranteeRequest): Promise<{ data: Blob }> => {
      try {
        console.log('Guarantee request data:', data);
        const response = await axios.post(`${API_BASE_URL}/guarantee/generate`, data, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        });
        return { data: response.data };
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          const blob = error.response.data;
          const text = await new Response(blob).text();
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || '生成保函文档失败');
          } catch {
            throw new Error('生成保函文档失败');
          }
        }
        throw error;
      }
    }
  },

  warranty: {
    generateDocuments: async (data: WarrantyRequest): Promise<{ data: Blob }> => {
      try {
        console.log('发送质保金申请数据:', data);
        const response = await axios.post(`${API_BASE_URL}/warranty/generate`, data, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        });
        return { data: response.data };
      } catch (error) {
        console.error('生成质保金文档错误:', error);
        throw handleError(error, '生成质保金文档失败');
      }
    },

    getDocumentTypes: async (): Promise<ApiResponse> => {
      try {
        const response = await axios.get(`${API_BASE_URL}/warranty/document-types`);
        return response.data;
      } catch (error) {
        throw handleError(error, '获取质保金文档类型失败');
      }
    }
  },

  contract: {
    saveContract: async (data: { 
      contractInfo: ContractInfo,
      paymentTerms: any[],
      guaranteeInfo: any 
    }): Promise<ApiResponse> => {
      try {
        const response = await axios.post(`${API_BASE_URL}/contract/save`, data);
        return response.data;
      } catch (error) {
        throw handleError(error, '保存合同信息失败');
      }
    },
    
    validate: async (data: ContractInfo): Promise<ValidationResult> => {
      try {
        const response = await axios.post(`${API_BASE_URL}/contract/validate`, data);
        return response.data;
      } catch (error) {
        throw handleError(error, '验证合同信息失败');
      }
    }
  },

  document: {
    download: async (documentId: string, fileName: string): Promise<void> => {
      try {
        const response = await axios.get(`${API_BASE_URL}/document/download/${documentId}`, {
          responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        throw handleError(error, '下载文档失败');
      }
    }
  }
};