import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { defaultState } from '../data/mockData';
import type { Coupon, DemoState, NotificationItem, Transaction } from '../types';

const STORAGE_KEY = 'surewell-member-demo-state-v1';

interface DemoContextValue {
  state: DemoState;
  unreadCount: number;
  toast: string | null;
  useCoupon: (couponId: string) => void;
  topUp: (amount: number, bonus: number, method: string) => void;
  redeemStoredProduct: (productId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemo: () => void;
  askAI: (question: string) => string;
  clearToast: () => void;
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as DemoState : defaultState;
  } catch {
    return defaultState;
  }
}

function persist(next: DemoState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function newTransaction(tx: Omit<Transaction, 'id'>): Transaction {
  return { ...tx, id: `t-${Date.now()}-${Math.random().toString(16).slice(2)}` };
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(() => loadState());
  const [toast, setToast] = useState<string | null>(null);

  const commit = useCallback((updater: (current: DemoState) => DemoState, message?: string) => {
    setState((current) => {
      const next = updater(current);
      persist(next);
      return next;
    });
    if (message) {
      setToast(message);
      window.setTimeout(() => setToast(null), 2400);
    }
  }, []);

  const useCoupon = useCallback((couponId: string) => {
    commit((current) => {
      const coupon = current.coupons.find((item) => item.id === couponId);
      if (!coupon || coupon.status === 'used') return current;
      const coupons = current.coupons.map<Coupon>((item) => item.id === couponId ? { ...item, status: 'used' } : item);
      return {
        ...current,
        coupons,
        transactions: [
          newTransaction({
            type: 'coupon',
            date: '2026/08/26',
            title: coupon.title,
            store: '會員券匣',
            detail: `${coupon.title} 已完成核銷。`
          }),
          ...current.transactions
        ]
      };
    }, '優惠券已移至已使用');
  }, [commit]);

  const topUp = useCallback((amount: number, bonus: number, method: string) => {
    commit((current) => ({
      ...current,
      wallet: {
        ...current.wallet,
        storedValue: current.wallet.storedValue + amount,
        shoppingCredit: current.wallet.shoppingCredit + bonus
      },
      transactions: [
        newTransaction({
          type: 'topup',
          date: '2026/08/26',
          title: '會員儲值',
          store: method,
          amount,
          detail: `使用 ${method} 儲值 ${amount.toLocaleString()} 元${bonus ? `，加贈 ${bonus} 元購物金` : ''}。`
        }),
        ...current.transactions
      ]
    }), `儲值成功，已增加 $${amount.toLocaleString()}`);
  }, [commit]);

  const redeemStoredProduct = useCallback((productId: string) => {
    commit((current) => {
      const product = current.storedProducts.find((item) => item.id === productId);
      if (!product || product.redeemed >= product.total) return current;
      return {
        ...current,
        storedProducts: current.storedProducts.map((item) => item.id === productId ? { ...item, redeemed: item.redeemed + 1 } : item),
        transactions: [
          newTransaction({
            type: 'stored',
            date: '2026/08/26',
            title: '寄杯兌換',
            store: '門市 QR 核銷',
            detail: `${product.name} 完成兌換 1 杯。`
          }),
          ...current.transactions
        ]
      };
    }, '兌換完成，剩餘數量已更新');
  }, [commit]);

  const markNotificationRead = useCallback((id: string) => {
    commit((current) => ({
      ...current,
      notifications: current.notifications.map<NotificationItem>((item) => item.id === id ? { ...item, read: true } : item)
    }));
  }, [commit]);

  const markAllNotificationsRead = useCallback(() => {
    commit((current) => ({
      ...current,
      notifications: current.notifications.map((item) => ({ ...item, read: true }))
    }), '已全部標為已讀');
  }, [commit]);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
    setToast('展示資料已重置');
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const askAI = useCallback((question: string) => {
    const q = question.toLowerCase();
    const stored = state.storedProducts[0];
    const remaining = stored.total - stored.redeemed;
    const availableCoupons = state.coupons.filter((coupon) => coupon.status !== 'used');
    if (q.includes('點')) return `你目前共有 ${state.wallet.points.toLocaleString()} 點，其中 ${state.member.pointsExpiring} 點將於 ${state.member.pointsExpireDate} 到期。`;
    if (q.includes('儲值') || q.includes('餘額')) return `你的儲值金目前剩 $${state.wallet.storedValue.toLocaleString()}，購物金還有 $${state.wallet.shoppingCredit.toLocaleString()}。`;
    if (q.includes('優惠') || q.includes('券')) return `你目前有 ${availableCoupons.length} 張可用優惠券，包含「${availableCoupons[0]?.title ?? '會員專屬券'}」。`;
    if (q.includes('咖啡') || q.includes('杯')) return `你的 ${stored.name} 剩餘 ${remaining} 杯，有效期限到 ${stored.expireDate}。`;
    if (q.includes('到期')) return `${state.member.pointsExpiring} 點將於 ${state.member.pointsExpireDate} 到期，另有 2 張優惠券即將到期。`;
    if (q.includes('花') || q.includes('消費')) return `你本月累積消費 $${state.member.monthlySpend.toLocaleString()}，距離 ${state.member.nextLevel} 還差 $${state.member.upgradeRemaining.toLocaleString()}。`;
    if (q.includes('推薦') || q.includes('最近')) return '依你的常買紀錄，這週推薦鮮奶第二件 5 折、穀王吐司會員價 49 元與水果滿 199 折 30。';
    return '我可以幫你查點數、儲值金、優惠券、咖啡剩餘杯數、交易紀錄與本週推薦優惠。';
  }, [state]);

  const value = useMemo<DemoContextValue>(() => ({
    state,
    unreadCount: state.notifications.filter((item) => !item.read).length,
    toast,
    useCoupon,
    topUp,
    redeemStoredProduct,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemo,
    askAI,
    clearToast: () => setToast(null)
  }), [askAI, markAllNotificationsRead, markNotificationRead, redeemStoredProduct, resetDemo, state, toast, topUp, useCoupon]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo must be used within DemoProvider');
  return value;
}
