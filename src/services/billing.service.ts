import api from './api';
interface TransactionRequest {
  orderId?: string;
  detailed?: boolean;
}
interface CreateTransactionRequest {
  quotaAmount: number;
}
interface TransactionResponse {
  status: boolean;
  message: string;
  data: {
    priceDetails: {
      quotaAmount: number;
      pricePerQuota: number;
      basePrice: number;
      discountPercent: number;
      discountAmount: number;
      finalPrice: number;
      currency: string;
    };
    paymentDetails: {
      basePrice: number;
      pricePerQuota: number;
      discountAmount: number;
      discountPercent: number;
    };
    redirectUrl: string;
    transaction: {
      id: string;
      quotaId: string;
      orderId: string;
      amount: number;
      quotaAmount: number;
      status: string;
      paymentType: string | null;
      midtransId: string | null;
      paymentTime: string | null;
      paidAt: string | null;
      expiredAt: string;
      snapToken: string;
      snapRedirectUrl: string;
      createdAt: string;
      updatedAt: string;
      paymentDetails: {
        basePrice: number;
        pricePerQuota: number;
        discountAmount: number;
        discountPercent: number;
      };
    };
  };
}
interface HistoryTransactionResponse {
  status: boolean;
  message: string;
  data: Array<{
    id: string;
    quotaId: string;
    orderId: string;
    amount: number;
    quotaAmount: number;
    status: string;
    paymentType: string | null;
    midtransId: string | null;
    paymentDetails: {
      bank: string;
      vaNumber: string;
    };
    paymentTime: string | null;
    paidAt: string | null;
    expiredAt: string;
    snapToken: string;
    snapRedirectUrl: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
interface CalculatePriceRequest {
  quotaAmount: number;
}
interface CalculatePriceResponse {
  status: boolean;
  message: string;
  data: {
    quotaAmount: number;
    pricePerQuota: number;
    basePrice: number;
    discountPercent: number;
    discountAmount: number;
    finalPrice: number;
    currency: string;
    formattedBasePrice: string;
    formattedDiscountAmount: string;
    formattedFinalPrice: string;
  };
}
export const billingService = {
  async getTransactions(
    params: TransactionRequest
  ): Promise<HistoryTransactionResponse> {
    try {
      const response = await api.get('/transaction', { params });
      if (!response.data.status) {
        throw new Error(
          response.data.message || 'Failed to fetch transactions'
        );
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async calculatePrice(
    params: CalculatePriceRequest
  ): Promise<CalculatePriceResponse> {
    try {
      const response = await api.get('/price/calculate', { params });
      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to calculate price');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async createTransaction(
    request: CreateTransactionRequest
  ): Promise<TransactionResponse> {
    try {
      const response = await api.post('/transaction/create', request);
      if (!response.data.status) {
        throw new Error(
          response.data.message || 'Failed to create transaction'
        );
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
