import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, EmptyState, Modal, QRBox, SecondaryButton } from '../components/UI';
import { useDemo } from '../store/DemoContext';
import type { Coupon, CouponStatus } from '../types';

const tabs: { key: CouponStatus; label: string }[] = [
  { key: 'available', label: '可使用' },
  { key: 'expiring', label: '即將到期' },
  { key: 'used', label: '已使用' }
];

export default function CouponsPage() {
  const { state, useCoupon } = useDemo();
  const navigate = useNavigate();
  const [tab, setTab] = useState<CouponStatus>('available');
  const [selected, setSelected] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const coupons = useMemo(() => state.coupons.filter((coupon) => coupon.status === tab), [state.coupons, tab]);
  const activeCount = state.coupons.filter((coupon) => coupon.status !== 'used').length;

  const couponHero = (coupon: Coupon) => {
    if (coupon.title.includes('第二件')) return '第 2 件 5 折';
    if (coupon.title.includes('95')) return '95 折';
    const match = coupon.title.match(/折\s?(\d+)/);
    return match ? `$${match[1]} OFF` : '會員優惠';
  };

  const expiryTone = (coupon: Coupon) => {
    if (coupon.status === 'used') return 'bg-slate-100 text-slate-500';
    if ((coupon.daysLeft ?? 99) <= 3) return 'bg-red-50 text-red-700';
    if ((coupon.daysLeft ?? 99) <= 7) return 'bg-orange-50 text-orange-700';
    return 'bg-brand-light text-brand-deep';
  };

  const handleUse = () => {
    if (!selected) return;
    setLoading(true);
    window.setTimeout(() => {
      useCoupon(selected.id);
      setLoading(false);
      setSelected(null);
    }, 700);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[32px] bg-gradient-to-br from-brand-deep to-brand-green p-5 text-white shadow-retail">
        <p className="text-sm text-white/70">我的優惠券</p>
        <div className="mt-1 flex items-end justify-between">
          <h1 className="text-[30px] font-black">{activeCount} 張可用</h1>
          <Badge tone="orange">會員專屬</Badge>
        </div>
        <p className="mt-2 text-sm text-white/70">依消費習慣推薦，結帳前可先查看適用優惠。</p>
      </div>
      <div className="flex gap-2">
        <div className="flex min-h-11 flex-1 items-center gap-2 rounded-[18px] bg-white px-3 text-slate-400 shadow-soft">
          <Search size={18} />
          <span className="text-sm font-bold">搜尋優惠券</span>
        </div>
        <button className="flex min-h-11 w-11 items-center justify-center rounded-[18px] bg-white text-brand-green shadow-soft">
          <SlidersHorizontal size={19} />
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['全部', '食品', '飲品', '日用品', '會員限定'].map((item, index) => (
          <span key={item} className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${index === 0 ? 'bg-brand-green text-white' : 'bg-white text-slate-500 shadow-soft'}`}>{item}</span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-[22px] bg-emerald-50 p-1">
        {tabs.map((item) => (
          <button key={item.key} onClick={() => setTab(item.key)} className={`rounded-[18px] px-3 py-2.5 text-sm font-black ${tab === item.key ? 'bg-white text-brand-deep shadow-sm' : 'text-slate-500'}`}>{item.label}</button>
        ))}
      </div>
      {coupons.length === 0 ? <EmptyState title="目前沒有優惠券" body="新的會員好康會出現在這裡。" /> : coupons.map((coupon) => (
        <Card key={coupon.id} className="relative overflow-hidden p-0">
          <div className="grid grid-cols-[110px_1fr]">
            <div className={`flex min-h-[156px] flex-col items-center justify-center px-3 text-center text-white ${coupon.status === 'expiring' ? 'bg-brand-orange' : coupon.status === 'used' ? 'bg-slate-400' : 'bg-brand-green'}`}>
              <p className="text-[11px] font-bold opacity-80">COUPON</p>
              <p className="mt-1 text-2xl font-black leading-tight">{couponHero(coupon)}</p>
            </div>
            <div className="relative p-4">
              <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f7f7f4]" />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black">{coupon.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{coupon.description}</p>
                </div>
                {coupon.status === 'used' && <Badge tone="gray">已使用</Badge>}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-black ${expiryTone(coupon)}`}>
                  {coupon.status === 'used' ? '已使用' : `剩 ${coupon.daysLeft ?? '—'} 天`}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{coupon.category ?? '會員限定'}</span>
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>門檻：{coupon.threshold}</p>
                <p>適用商品：{coupon.product}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button onClick={() => navigate(`/coupons/${coupon.id}`)} className="py-2.5">詳情</Button>
                <Button onClick={() => setSelected(coupon)} disabled={coupon.status === 'used'} className="py-2.5">{coupon.status === 'used' ? '已使用' : '立即使用'}</Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
      {selected && (
        <Modal title="優惠券內容" onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div className="rounded-[26px] bg-brand-light p-4">
              <p className="text-sm font-black text-brand-deep">{couponHero(selected)}</p>
              <h3 className="text-xl font-black">{selected.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{selected.description}</p>
            </div>
            <QRBox label="優惠券核銷碼" />
            <div className="rounded-3xl bg-slate-50 p-4 text-sm leading-7">
              <p>使用期限：{selected.expireDate}</p>
              <p>使用門檻：{selected.threshold}</p>
              <p>適用商品：{selected.product}</p>
              <p>適用門市：喜互惠各門市</p>
              <p>注意事項：不可與部分活動併用，依門市結帳結果為準。</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SecondaryButton onClick={() => setSelected(null)}>取消</SecondaryButton>
              <Button loading={loading} onClick={handleUse}>出示優惠券</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
