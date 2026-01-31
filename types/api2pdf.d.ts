declare module 'api2pdf' {
  class Api2Pdf {
    constructor(apiKey: string);
    
    convertHtmlToPdf(html: string, options?: {
      fileName?: string;
      orientation?: 'portrait' | 'landscape';
      pageSize?: 'letter' | 'a4' | 'legal';
      margins?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
      };
    }): Promise<{
      pdfUrl: string;
      pdfId: string;
    }>;
    
    convertUrlToPdf(url: string, options?: {
      fileName?: string;
      orientation?: 'portrait' | 'landscape';
      pageSize?: 'letter' | 'a4' | 'legal';
      margins?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
      };
    }): Promise<{
      pdfUrl: string;
      pdfId: string;
    }>;
    
    chromeHtmlToPdf(html: string, options?: {
      inline?: boolean;
      fileName?: string;
      orientation?: 'portrait' | 'landscape';
      pageSize?: 'letter' | 'a4' | 'legal';
      margins?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
      };
    }): Promise<{
      Success: boolean;
      FileUrl?: string;
      FileId?: string;
      Error?: string;
    }>;
  }
  
  export default Api2Pdf;
}
