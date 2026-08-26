export type CouponStatus = 'available' | 'expiring' | 'used';
export type TransactionType = 'purchase' | 'topup' | 'payment' | 'points' | 'coupon' | 'stored';
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
  category?: string;
  daysLeft?: number;
  store?: string;
  note?: string;
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
  time?: string;
  invoiceNo?: string;
  originalAmount?: number;
  discount?: number;
  couponUsed?: string;
  paymentMethod?: string;
  status?: string;
}

export interface StoredProduct {
  id: string;
  name: string;
  total: number;
  redeemed: number;
  expireDate: string;
  unit?: string;
  category?: '飲品' | '食品' | '其他';
  color?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  rewardType: 'points' | 'coupon';
  rewardLabel: string;
  rewardPoints?: number;
  rewardCouponTitle?: string;
  claimed: boolean;
}

export interface PointReward {
  id: string;
  title: string;
  pointsCost: number;
  valueLabel: string;
  claimed: boolean;
}

export interface Insight {
  thisMonth: number;
  lastMonth: number;
  categories: { label: string; percent: number }[];
  favorites: string[];
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
  missions: Mission[];
  pointRewards: PointReward[];
  insight: Insight;
}
