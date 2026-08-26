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
  transferStoredProduct: (productId: string, quantity: number, phone: string) => void;
  claimMission: (missionId: string) => void;
  redeemPointReward: (rewardId: string) => void;
  payWithWallet: (amount: number) => void;
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
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return {
      ...defaultState,
      ...parsed,
      member: { ...defaultState.member, ...parsed.member },
      wallet: { ...defaultState.wallet, ...parsed.wallet },
      coupons: parsed.coupons?.map((coupon) => ({ ...defaultState.coupons.find((item) => item.id === coupon.id), ...coupon })) ?? defaultState.coupons,
      transactions: parsed.transactions ?? defaultState.transactions,
      storedProducts: defaultState.storedProducts.map((product) => ({ ...product, ...parsed.storedProducts?.find((item) => item.id === product.id) })),
      notifications: parsed.notifications ?? defaultState.notifications,
      missions: defaultState.missions.map((mission) => ({ ...mission, ...parsed.missions?.find((item) => item.id === mission.id) })),
      pointRewards: defaultState.pointRewards.map((reward) => ({ ...reward, ...parsed.pointRewards?.find((item) => item.id === reward.id) })),
      insight: { ...defaultState.insight, ...parsed.insight }
    };
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
      const unit = product.unit ?? '份';
      return {
        ...current,
        storedProducts: current.storedProducts.map((item) => item.id === productId ? { ...item, redeemed: item.redeemed + 1 } : item),
        transactions: [
          newTransaction({
            type: 'stored',
            date: '2026/08/26',
            title: '寄存兌換',
            store: '門市 QR 核銷',
            detail: `${product.name} 完成兌換 1 ${unit}。`,
            status: '兌換成功'
          }),
          ...current.transactions
        ]
      };
    }, '兌換完成，剩餘數量已更新');
  }, [commit]);

  const transferStoredProduct = useCallback((productId: string, quantity: number, phone: string) => {
    commit((current) => {
      const product = current.storedProducts.find((item) => item.id === productId);
      if (!product) return current;
      const remaining = product.total - product.redeemed;
      const safeQuantity = Math.min(quantity, remaining);
      if (safeQuantity <= 0) return current;
      const unit = product.unit ?? '份';
      return {
        ...current,
        storedProducts: current.storedProducts.map((item) => item.id === productId ? { ...item, redeemed: item.redeemed + safeQuantity } : item),
        transactions: [
          newTransaction({
            type: 'stored',
            date: '2026/08/26',
            title: '寄存轉贈',
            store: phone || '分享連結',
            detail: `${product.name} 已轉贈 ${safeQuantity} ${unit}。`,
            status: '轉贈成功'
          }),
          ...current.transactions
        ]
      };
    }, `已成功轉贈 ${quantity} 份`);
  }, [commit]);

  const markNotificationRead = useCallback((id: string) => {
    commit((current) => ({
      ...current,
      notifications: current.notifications.map<NotificationItem>((item) => item.id === id ? { ...item, read: true } : item)
    }));
  }, [commit]);

  const claimMission = useCallback((missionId: string) => {
    commit((current) => {
      const mission = current.missions.find((item) => item.id === missionId);
      if (!mission || mission.claimed || mission.current < mission.target) return current;
      const missionTransactions: Transaction[] = [];
      let wallet = current.wallet;
      let coupons = current.coupons;
      if (mission.rewardType === 'points' && mission.rewardPoints) {
        wallet = { ...wallet, points: wallet.points + mission.rewardPoints };
        missionTransactions.push(newTransaction({
          type: 'points',
          date: '2026/08/26',
          title: '任務獎勵',
          store: '會員任務',
          points: mission.rewardPoints,
          detail: `${mission.title} 已完成，獲得 ${mission.rewardPoints} 點。`,
          status: '已領取'
        }));
      }
      if (mission.rewardType === 'coupon') {
        const coupon: Coupon = {
          id: `mission-${Date.now()}`,
          title: mission.rewardCouponTitle ?? mission.rewardLabel,
          description: '完成會員任務獲得',
          expireDate: '2026/09/30',
          threshold: '消費滿 500 元',
          product: '全館適用',
          status: 'available',
          category: '會員限定',
          daysLeft: 35,
          store: '喜互惠各門市',
          note: '任務獎勵券依門市結帳結果為準。'
        };
        coupons = [coupon, ...coupons];
        missionTransactions.push(newTransaction({
          type: 'coupon',
          date: '2026/08/26',
          title: '任務優惠券',
          store: '會員任務',
          detail: `${mission.title} 已完成，獲得 ${coupon.title}。`,
          status: '已領取'
        }));
      }
      return {
        ...current,
        wallet,
        coupons,
        missions: current.missions.map((item) => item.id === missionId ? { ...item, claimed: true } : item),
        transactions: [...missionTransactions, ...current.transactions]
      };
    }, '任務獎勵已領取');
  }, [commit]);

  const redeemPointReward = useCallback((rewardId: string) => {
    commit((current) => {
      const reward = current.pointRewards.find((item) => item.id === rewardId);
      if (!reward || reward.claimed || current.wallet.points < reward.pointsCost) return current;
      const shoppingCredit = Number(reward.valueLabel.match(/\d+/)?.[0] ?? 0);
      return {
        ...current,
        wallet: {
          ...current.wallet,
          points: current.wallet.points - reward.pointsCost,
          shoppingCredit: current.wallet.shoppingCredit + shoppingCredit
        },
        pointRewards: current.pointRewards.map((item) => item.id === rewardId ? { ...item, claimed: true } : item),
        transactions: [
          newTransaction({
            type: 'points',
            date: '2026/08/26',
            title: '點數兌換',
            store: '點數中心',
            points: -reward.pointsCost,
            detail: `${reward.pointsCost} 點兌換 ${reward.valueLabel}。`,
            status: '兌換成功'
          }),
          ...current.transactions
        ]
      };
    }, '點數兌換完成');
  }, [commit]);

  const payWithWallet = useCallback((amount: number) => {
    commit((current) => {
      const available = current.wallet.storedValue + current.wallet.shoppingCredit;
      if (amount <= 0 || available < amount) return current;
      const creditUsed = Math.min(current.wallet.shoppingCredit, amount);
      const storedUsed = amount - creditUsed;
      return {
        ...current,
        wallet: {
          ...current.wallet,
          shoppingCredit: current.wallet.shoppingCredit - creditUsed,
          storedValue: current.wallet.storedValue - storedUsed
        },
        transactions: [
          newTransaction({
            type: 'payment',
            date: '2026/08/26',
            time: '14:20',
            title: '喜互惠 Demo 店',
            store: 'Demo 店',
            amount: -amount,
            detail: `購物金折抵 ${creditUsed.toLocaleString()} 元，儲值金付款 ${storedUsed.toLocaleString()} 元。`,
            paymentMethod: creditUsed > 0 && storedUsed > 0 ? '購物金 + 儲值金' : creditUsed > 0 ? '購物金' : '儲值金',
            discount: creditUsed,
            status: '付款成功'
          }),
          ...current.transactions
        ]
      };
    }, `付款成功，已使用 $${amount.toLocaleString()}`);
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
    if (q.includes('優惠') || q.includes('券')) return `你目前有 ${availableCoupons.length} 張可用優惠券，最適合先使用「${availableCoupons[0]?.title ?? '會員專屬券'}」。`;
    if (q.includes('咖啡') || q.includes('杯') || q.includes('寄存')) return `你的 ${stored.name} 剩餘 ${remaining} ${stored.unit ?? '份'}，有效期限到 ${stored.expireDate}。`;
    if (q.includes('到期')) return `${state.member.pointsExpiring} 點將於 ${state.member.pointsExpireDate} 到期，另有 2 張優惠券即將到期。`;
    if (q.includes('常買')) return `你最常購買的是 ${state.insight.favorites.join('、')}，這週可優先使用鮮奶與水果相關優惠。`;
    if (q.includes('花') || q.includes('消費') || q.includes('分析')) return `你本月消費 $${state.insight.thisMonth.toLocaleString()}，比上月 $${state.insight.lastMonth.toLocaleString()} 成長約 12%。食品 ${state.insight.categories[0].percent}%、飲品 ${state.insight.categories[1].percent}%、生活用品 ${state.insight.categories[2].percent}%。`;
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
    transferStoredProduct,
    claimMission,
    redeemPointReward,
    payWithWallet,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemo,
    askAI,
    clearToast: () => setToast(null)
  }), [askAI, claimMission, markAllNotificationsRead, markNotificationRead, payWithWallet, redeemPointReward, redeemStoredProduct, resetDemo, state, toast, topUp, transferStoredProduct, useCoupon]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo must be used within DemoProvider');
  return value;
}
