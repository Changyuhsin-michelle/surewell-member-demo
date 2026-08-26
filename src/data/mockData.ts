import type { DemoState } from '../types';

export const defaultState: DemoState = {
  member: {
    id: 'm-001',
    name: '張玉莘',
    level: '黃金會員',
    nextLevel: '白金會員',
    memberNo: 'SW20260826001',
    points: 1280,
    monthlySpend: 3680,
    yearlySpend: 13680,
    nextLevelTarget: 20000,
    upgradeRemaining: 6320,
    pointsExpiring: 320,
    pointsExpireDate: '2026/08/31',
    active: true
  },
  wallet: {
    storedValue: 1850,
    shoppingCredit: 120,
    points: 1280
  },
  coupons: [
    { id: 'c1', title: '滿 159 元折 20 元', description: '熟食與鮮食專屬回購券', expireDate: '2026/08/31', threshold: '消費滿 159 元', product: '熟食、便當、鮮食', status: 'available' },
    { id: 'c2', title: '指定鮮奶第二件 5 折', description: '依最近購買紀錄推薦', expireDate: '2026/08/30', threshold: '指定鮮奶第二件', product: '鮮奶', status: 'available' },
    { id: 'c3', title: '水果滿 199 元折 30 元', description: '本週水果會員限定', expireDate: '2026/08/29', threshold: '水果滿 199 元', product: '水果', status: 'expiring' },
    { id: 'c4', title: '穀王吐司會員價 49 元', description: '早餐補貨推薦', expireDate: '2026/09/05', threshold: '會員專屬價', product: '穀王吐司', status: 'available' },
    { id: 'c5', title: '滿 500 元折 50 元', description: '高客單回饋券', expireDate: '2026/08/28', threshold: '消費滿 500 元', product: '全館適用', status: 'expiring' },
    { id: 'c6', title: '飲品 95 折', description: '夏季飲品活動', expireDate: '2026/09/10', threshold: '指定飲品', product: '飲料、茶飲', status: 'available' }
  ],
  storedProducts: [
    { id: 'sp1', name: '美式咖啡 10 杯組', total: 10, redeemed: 6, expireDate: '2026/10/31' }
  ],
  notifications: [
    { id: 'n1', type: 'offer', title: '鮮奶第二件 5 折', body: '你常買的鮮奶本週第二件 5 折。', date: '2026/08/26', read: false },
    { id: 'n2', type: 'coupon', title: '優惠券即將到期', body: '你有 2 張優惠券即將到期。', date: '2026/08/26', read: false },
    { id: 'n3', type: 'points', title: '點數到期提醒', body: '會員點數 320 點將於月底到期。', date: '2026/08/25', read: false },
    { id: 'n4', type: 'offer', title: '水果會員限定優惠', body: '本週水果會員限定優惠。', date: '2026/08/24', read: true },
    { id: 'n5', type: 'wallet', title: '儲值加碼活動', body: '儲值 1,000 元加贈 50 元。', date: '2026/08/23', read: true }
  ],
  transactions: [
    { id: 't1', type: 'purchase', date: '2026/08/25', title: '喜互惠羅東店', store: '羅東店', amount: -682, points: 20, detail: '購買鮮奶、雞蛋、熟食便當，獲得 20 點。' },
    { id: 't2', type: 'topup', date: '2026/08/23', title: '儲值', store: '會員錢包', amount: 1000, detail: '儲值 1,000 元。' },
    { id: 't3', type: 'stored', date: '2026/08/20', title: '咖啡兌換', store: '羅東店', detail: '美式咖啡兌換 -1 杯。' },
    { id: 't4', type: 'coupon', date: '2026/08/18', title: '優惠券', store: '會員券匣', amount: 50, detail: '滿 500 折 50 已使用。' },
    { id: 't5', type: 'points', date: '2026/08/17', title: '點數折抵', store: '員山店', points: -300, detail: '使用 300 點折抵 30 元。' },
    { id: 't6', type: 'purchase', date: '2026/08/15', title: '喜互惠宜蘭店', store: '宜蘭店', amount: -1280, points: 38, detail: '購買米、衛生紙、水果。' },
    { id: 't7', type: 'coupon', date: '2026/08/14', title: '生日券領取', store: '會員中心', amount: 100, detail: '生日月 100 元禮券已發送。' },
    { id: 't8', type: 'purchase', date: '2026/08/12', title: '喜互惠羅東店', store: '羅東店', amount: -520, points: 15, detail: '購買鮮奶、吐司。' },
    { id: 't9', type: 'stored', date: '2026/08/10', title: '咖啡兌換', store: '羅東店', detail: '美式咖啡兌換 -1 杯。' },
    { id: 't10', type: 'purchase', date: '2026/08/08', title: '喜互惠礁溪店', store: '礁溪店', amount: -236, points: 7, detail: '購買餅乾與飲品。' },
    { id: 't11', type: 'topup', date: '2026/08/05', title: '儲值', store: '會員錢包', amount: 2000, detail: '儲值 2,000 元，加贈 120 元購物金。' },
    { id: 't12', type: 'purchase', date: '2026/08/03', title: '喜互惠宜蘭店', store: '宜蘭店', amount: -760, points: 22, detail: '購買水果、熟食、飲品。' },
    { id: 't13', type: 'coupon', date: '2026/08/01', title: '鮮奶券領取', store: '會員券匣', detail: '指定鮮奶第二件 5 折已領取。' },
    { id: 't14', type: 'points', date: '2026/07/31', title: '點數到期提醒', store: '會員中心', points: 320, detail: '320 點將於 8/31 到期。' },
    { id: 't15', type: 'purchase', date: '2026/07/29', title: '喜互惠羅東店', store: '羅東店', amount: -930, points: 28, detail: '購買生鮮、日用品。' }
  ]
};
