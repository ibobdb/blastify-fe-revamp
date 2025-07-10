import api from './api';
interface TransactionRequest {
  orderId?: string;
  detailed?: boolean;
}

interface TransactionResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    quotaId: string;
    orderId: string;
    amount: number;
    quotaAmount: number;
    status: string;
    paymentType: string;
    midtransId: string;
    paymentDetails: {
      transactionType: string;
    };
    paymentTime: string;
    paidAt: string;
    expiredAt: string;
    snapToken: string;
    snapRedirectUrl: string;
    createdAt: string;
    updatedAt: string;
  };
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
  ): Promise<TransactionResponse> {
    try {
      const response = await api.get('/billing/transactions', { params });
      if (!response.data.status) {
        throw new Error(
          response.data.message || 'Failed to fetch transactions'
        );
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
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
      console.error('Error calculating price:', error);
      throw error;
    }
  },
};
