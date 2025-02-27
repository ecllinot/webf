import { useRef, useState } from 'react';
import { message } from 'antd';
import { apiService } from '../services/api';

export function useDocumentPreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreview = async (type: string, params: any) => {
    setIsLoading(true);
    try {
      // 预览功能将在后续实现
      console.log('Preview:', type, params);
      
      switch (type) {
        case 'payment':
          // 付款文档预览逻辑
          break;
        case 'guarantee':
          // 保函文档预览逻辑
          break;
        case 'warranty':
          // 质保金文档预览逻辑
          break;
        default:
          throw new Error('未知的文档类型');
      }
    } catch (error) {
      console.error('Preview error:', error);
      message.error('预览失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (type: string, params: any) => {
    setIsLoading(true);
    try {
      console.log('Download:', type, params);
      let blob: Blob;
      
      switch (type) {
        case 'payment':
          blob = await apiService.payment.downloadPayment(params.fileName);
          break;
        case 'guarantee':
          blob = await apiService.guarantee.downloadGuarantee(params.fileName);
          break;
        case 'warranty':
          blob = await apiService.warranty.downloadWarranty(params.fileName);
          break;
        default:
          throw new Error('未知的文档类型');
      }

      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = params.fileName;
      document.body.appendChild(a);
      a.click();
      
      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      message.success('文件下载成功');
    } catch (error) {
      console.error('Download error:', error);
      message.error(error instanceof Error ? error.message : '文件下载失败');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    previewRef,
    isLoading,
    handlePreview,
    handleDownload
  };
}

export default useDocumentPreview;