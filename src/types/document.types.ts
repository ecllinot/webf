// src/types/document.types.ts

export interface DocumentTemplate {
  id: string;
  name: string;
  path: string;
  type: 'payment' | 'guarantee' | 'warranty';
  customerType?: string;
}

export interface GenerateDocumentResponse {
  success: boolean;
  data?: {
    previewUrl: string;
    downloadUrl?: string;
  };
  error?: string;
}
