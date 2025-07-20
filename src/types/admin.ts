export interface UserWithBalance {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  currentBalance: number;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface UsersWithBalanceResponse {
  success: boolean;
  message: string;
  data: UserWithBalance[];
}

export interface AddCreditsResponse {
  success: boolean;
  message: string;
}
export interface addQuotaRequest {
  userId: string;
  amount: number;
}
export interface addQuotaResponse {
  status: boolean;
  message: string;
  data: {
    userId: string;
    addedAmount: number;
  };
}
export interface checkQuotaResponse {
  status: boolean;
  message: string;
  data: {
    userId: string;
    balance: number;
    lockedAmount: number;
    availableBalance: number;
  };
}
