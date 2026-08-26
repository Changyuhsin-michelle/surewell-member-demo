import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { defaultState } from '../data/mockData';
import type { Coupon, DemoState, NotificationItem, ShoppingCreditRecord, Transaction } from '../types';

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
  checkoutPurchase: (input: CheckoutInput) => boolean;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemo: () => void;
  askAI: (question: string) => string;
  clearToast: () => void;
}

export interface CheckoutInput {
  originalAmount: number;
  couponId?: string | null;
  useShoppingCredit?: boolean;
  shoppingCreditAmount?: number;
  store?: string;
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
      shoppingCreditRecords: parsed.shoppingCreditRecords ?? defaultState.shoppingCreditRecords,
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

function newShoppingCreditRecord(record: Omit<ShoppingCreditRecord, 'id'>): ShoppingCreditRecord {
  return { ...record, id: `sc-${Date.now()}-${Math.random().toString(16).slice(2)}` };
}

function nowInTaiwan() {
  const parts = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(new Date()).reduce<Record<string, string>>((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});
  return {
    date: `${parts.year}/${parts.month}/${parts.day}`,
    time: `${parts.hour}:${parts.minute}`
  };
}

function firstMoneyNumber(text: string) {
  return Number(text.match(/\d+/)?.[0] ?? 0);
}

function getCouponResult(coupon: Coupon | undefined, amount: number) {
  if (!coupon || coupon.status === 'used') return { eligible: true, discount: 0, minimum: 0 };
  const minimum = coupon.threshold.includes('滿') ? firstMoneyNumber(coupon.threshold) : 0;
  if (minimum > 0 && amount < minimum) return { eligible: false, discount: 0, minimum };
  if (coupon.title.includes('95')) return { eligible: true, discount: Math.round(amount * 0.05), minimum };
  if (coupon.title.includes('第二件')) return { eligible: true, discount: 50, minimum };
  const discount = firstMoneyNumber(coupon.title.replace(/^滿\s?\d+\s?元?/, ''));
  return { eligible: true, discount: Math.min(discount, amount), minimum };
}

function updateMissionsAfterPurchase(state: DemoState, amount: number) {
  return state.missions.map((mission) => {
    if (mission.claimed) return mission;
    if (mission.title.includes('消費滿')) return { ...mission, current: Math.min(mission.target, mission.current + amount) };
    if (mission.title.includes('消費')) return { ...mission, current: Math.min(mission.target, mission.current + 1) };
    return mission;
  });
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
    const coupon = state.coupons.find((item) => item.id === couponId);
    if (coupon) {
      setToast('請先進入結帳流程，付款成功後才會核銷優惠券');
      window.setTimeout(() => setToast(null), 2400);
    }
  }, [state.coupons]);

  const topUp = useCallback((amount: number, bonus: number, method: string) => {
    commit((current) => {
      const now = nowInTaiwan();
      const creditRecord = bonus > 0 ? newShoppingCreditRecord({
        ...now,
        title: '儲值活動贈送',
        amount: bonus,
        detail: `儲值 ${amount.toLocaleString()} 元加贈購物金。`,
        source: 'topup'
      }) : null;
      return {
        ...current,
        wallet: {
          ...current.wallet,
          storedValue: current.wallet.storedValue + amount,
          shoppingCredit: current.wallet.shoppingCredit + bonus
        },
        shoppingCreditRecords: creditRecord ? [creditRecord, ...current.shoppingCreditRecords] : current.shoppingCreditRecords,
        transactions: [
          newTransaction({
            type: 'topup',
            ...now,
            title: '會員儲值',
            store: method,
            amount,
            detail: `使用 ${method} 儲值 ${amount.toLocaleString()} 元${bonus ? `，加贈 ${bonus} 元購物金` : ''}。`,
            paymentMethod: method,
            status: '儲值成功'
          }),
          ...current.transactions
        ]
      };
    }, `儲值成功，已增加 $${amount.toLocaleString()}`);
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
            ...nowInTaiwan(),
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
            ...nowInTaiwan(),
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
      const now = nowInTaiwan();
      let wallet = current.wallet;
      let coupons = current.coupons;
      if (mission.rewardType === 'points' && mission.rewardPoints) {
        wallet = { ...wallet, points: wallet.points + mission.rewardPoints };
        missionTransactions.push(newTransaction({
          type: 'points',
          ...now,
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
          ...now,
          title: '任務優惠券',
          store: '會員任務',
          detail: `${mission.title} 已完成，獲得 ${coupon.title}。`,
          status: '已領取'
        }));
      }
      return {
        ...current,
        member: { ...current.member, points: current.member.points + (mission.rewardType === 'points' && mission.rewardPoints ? mission.rewardPoints : 0) },
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
      if (!reward || (reward.oneTime && reward.claimed) || current.wallet.points < reward.pointsCost) return current;
      const shoppingCredit = Number(reward.valueLabel.match(/\d+/)?.[0] ?? 0);
      const now = nowInTaiwan();
      const creditRecord = shoppingCredit > 0 ? newShoppingCreditRecord({
        ...now,
        title: '點數兌換',
        amount: shoppingCredit,
        detail: `使用 ${reward.pointsCost.toLocaleString()} 點兌換 ${reward.valueLabel}。`,
        source: 'points'
      }) : null;
      return {
        ...current,
        member: { ...current.member, points: current.member.points - reward.pointsCost },
        wallet: {
          ...current.wallet,
          points: current.wallet.points - reward.pointsCost,
          shoppingCredit: current.wallet.shoppingCredit + shoppingCredit
        },
        pointRewards: current.pointRewards.map((item) => item.id === rewardId && reward.oneTime ? { ...item, claimed: true } : item),
        shoppingCreditRecords: creditRecord ? [creditRecord, ...current.shoppingCreditRecords] : current.shoppingCreditRecords,
        transactions: [
          newTransaction({
            type: 'points',
            ...now,
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

  const checkoutPurchase = useCallback((input: CheckoutInput) => {
    let success = false;
    commit((current) => {
      const originalAmount = Math.max(0, Math.round(input.originalAmount));
      const coupon = input.couponId ? current.coupons.find((item) => item.id === input.couponId) : undefined;
      const couponResult = getCouponResult(coupon, originalAmount);
      if (originalAmount <= 0 || !couponResult.eligible) return current;

      const now = nowInTaiwan();
      const couponDiscount = Math.min(couponResult.discount, originalAmount);
      const afterCoupon = Math.max(0, originalAmount - couponDiscount);
      const desiredCredit = input.useShoppingCredit === false ? 0 : Math.max(0, Math.round(input.shoppingCreditAmount ?? afterCoupon));
      const creditUsed = Math.min(current.wallet.shoppingCredit, desiredCredit, afterCoupon);
      const afterCredit = afterCoupon - creditUsed;
      const storedUsed = Math.min(current.wallet.storedValue, afterCredit);
      const otherPaid = Math.max(0, afterCredit - storedUsed);
      const pointsEarned = Math.floor(originalAmount * 0.03);
      const yearlySpend = current.member.yearlySpend + originalAmount;
      const upgraded = yearlySpend >= current.member.nextLevelTarget;
      const store = input.store ?? '喜互惠 Demo 店';
      const creditRecord = creditUsed > 0 ? newShoppingCreditRecord({
        ...now,
        title: '門市消費折抵',
        amount: -creditUsed,
        detail: `${store} 結帳使用購物金折抵 ${creditUsed.toLocaleString()} 元。`,
        source: 'payment'
      }) : null;
      const paymentParts = [
        couponDiscount > 0 ? `優惠券折 ${couponDiscount.toLocaleString()} 元` : '',
        creditUsed > 0 ? `購物金折抵 ${creditUsed.toLocaleString()} 元` : '',
        storedUsed > 0 ? `儲值金付款 ${storedUsed.toLocaleString()} 元` : '',
        otherPaid > 0 ? `其他支付 ${otherPaid.toLocaleString()} 元` : ''
      ].filter(Boolean);
      success = true;
      return {
        ...current,
        member: {
          ...current.member,
          level: upgraded ? current.member.nextLevel : current.member.level,
          points: current.member.points + pointsEarned,
          monthlySpend: current.member.monthlySpend + originalAmount,
          yearlySpend,
          upgradeRemaining: Math.max(0, current.member.nextLevelTarget - yearlySpend)
        },
        wallet: {
          ...current.wallet,
          points: current.wallet.points + pointsEarned,
          shoppingCredit: current.wallet.shoppingCredit - creditUsed,
          storedValue: current.wallet.storedValue - storedUsed
        },
        coupons: coupon ? current.coupons.map<Coupon>((item) => item.id === coupon.id ? { ...item, status: 'used' } : item) : current.coupons,
        missions: updateMissionsAfterPurchase(current, originalAmount),
        shoppingCreditRecords: creditRecord ? [creditRecord, ...current.shoppingCreditRecords] : current.shoppingCreditRecords,
        insight: {
          ...current.insight,
          thisMonth: current.insight.thisMonth + originalAmount
        },
        transactions: [
          newTransaction({
            type: 'purchase',
            ...now,
            title: store,
            store,
            amount: -(storedUsed + otherPaid),
            points: pointsEarned,
            detail: `商品金額 ${originalAmount.toLocaleString()} 元，${paymentParts.join('，')}，獲得 ${pointsEarned} 點。`,
            originalAmount,
            discount: couponDiscount + creditUsed,
            couponUsed: couponDiscount > 0 ? coupon?.title : undefined,
            paymentMethod: [creditUsed > 0 ? '購物金' : '', storedUsed > 0 ? '儲值金' : '', otherPaid > 0 ? '其他支付' : ''].filter(Boolean).join(' + '),
            status: '付款成功'
          }),
          ...current.transactions
        ]
      };
    }, '付款成功，會員資料已同步更新');
    return success;
  }, [commit]);

  const payWithWallet = useCallback((amount: number) => {
    checkoutPurchase({ originalAmount: amount, useShoppingCredit: true, shoppingCreditAmount: amount, store: '喜互惠 Demo 店' });
  }, [checkoutPurchase]);

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
    const storedSummary = state.storedProducts
      .map((item) => `${item.name}剩 ${item.total - item.redeemed}${item.unit ?? '份'}`)
      .join('、');
    const stored = state.storedProducts[0];
    const expiringCoupons = state.coupons.filter((coupon) => coupon.status !== 'used' && (coupon.daysLeft ?? 99) <= 7);
    const availableCoupons = state.coupons.filter((coupon) => coupon.status !== 'used');
    const latestTx = state.transactions[0];
    if (q.includes('點')) return `你目前共有 ${state.wallet.points.toLocaleString()} 點，其中 ${state.member.pointsExpiring} 點將於 ${state.member.pointsExpireDate} 到期。`;
    if (q.includes('購物金')) return `你目前購物金還有 $${state.wallet.shoppingCredit.toLocaleString()}，最近一筆購物金異動是「${state.shoppingCreditRecords[0]?.title ?? '尚無異動'}」。`;
    if (q.includes('儲值') || q.includes('餘額') || q.includes('資產')) return `你的儲值金目前剩 $${state.wallet.storedValue.toLocaleString()}，購物金 $${state.wallet.shoppingCredit.toLocaleString()}，會員點數 ${state.wallet.points.toLocaleString()} 點。`;
    if (q.includes('優惠') || q.includes('券')) return `你目前有 ${availableCoupons.length} 張可用優惠券，最適合先使用「${availableCoupons[0]?.title ?? '會員專屬券'}」。`;
    if (q.includes('咖啡') || q.includes('杯') || q.includes('寄存')) return `你的寄存商品目前有：${storedSummary}。其中 ${stored.name} 有效期限到 ${stored.expireDate}。`;
    if (q.includes('到期')) return `${state.member.pointsExpiring} 點將於 ${state.member.pointsExpireDate} 到期，另有 ${expiringCoupons.length} 張優惠券即將到期。`;
    if (q.includes('常買')) return `你最常購買的是 ${state.insight.favorites.join('、')}，這週可優先使用鮮奶與水果相關優惠。`;
    if (q.includes('花') || q.includes('消費') || q.includes('分析')) return `你本月消費 $${state.insight.thisMonth.toLocaleString()}，比上月 $${state.insight.lastMonth.toLocaleString()} 成長約 12%。食品 ${state.insight.categories[0].percent}%、飲品 ${state.insight.categories[1].percent}%、生活用品 ${state.insight.categories[2].percent}%。`;
    if (q.includes('交易') || q.includes('明細')) return latestTx ? `最近一筆交易是 ${latestTx.date} ${latestTx.title}，內容為：${latestTx.detail}` : '目前還沒有交易紀錄。';
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
    checkoutPurchase,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemo,
    askAI,
    clearToast: () => setToast(null)
  }), [askAI, checkoutPurchase, claimMission, markAllNotificationsRead, markNotificationRead, payWithWallet, redeemPointReward, redeemStoredProduct, resetDemo, state, toast, topUp, transferStoredProduct, useCoupon]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo must be used within DemoProvider');
  return value;
}
