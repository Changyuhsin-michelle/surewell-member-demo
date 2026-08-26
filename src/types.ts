export type CouponStatus = 'available' | 'expiring' | 'used';
export type TransactionType = 'purchase' | 'topup' | 'points' | 'coupon' | 'stored';
export type NotificationType = 'offer' | 'coupon' | 'points' | 'wallet';

export interface Member {
  id: string;
  name: string;
  level: string;
  nextLevel: string;
  memberNo: string;
  points: number;
  monthlySpend: number;
  yearlySpend: number;
  nextLevelTarget: number;
  upgradeRemaining: number;
  pointsExpiring: number;
  pointsExpireDate: string;
  active: boolean;
}

export interface Wallet {
  storedValue: number;
  shoppingCredit: number;
  points: number;
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  expireDate: string;
  threshold: string;
  product: string;
  status: CouponStatus;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  title: string;
  store: string;
  amount?: number;
  points?: number;
  detail: string;
}

export interface StoredProduct {
  id: string;
  name: string;
  total: number;
  redeemed: number;
  expireDate: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export interface DemoState {
  member: Member;
  wallet: Wallet;
  coupons: Coupon[];
  transactions: Transaction[];
  storedProducts: StoredProduct[];
  notifications: NotificationItem[];
}
