import { useMemo, useState } from 'react';
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
  const [tab, setTab] = useState<CouponStatus>('available');
  const [selected, setSelected] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const coupons = useMemo(() => state.coupons.filter((coupon) => coupon.status === tab), [state.coupons, tab]);

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
      <div className="rounded-[30px] bg-white p-4 shadow-soft">
        <h1 className="text-[26px] font-black text-brand-ink">優惠券</h1>
        <p className="text-sm text-slate-500">查看可用、即將到期與已使用優惠券。</p>
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-[22px] bg-emerald-50 p-1">
        {tabs.map((item) => (
          <button key={item.key} onClick={() => setTab(item.key)} className={`rounded-[18px] px-3 py-2.5 text-sm font-black ${tab === item.key ? 'bg-white text-brand-deep shadow-sm' : 'text-slate-500'}`}>{item.label}</button>
        ))}
      </div>
      {coupons.length === 0 ? <EmptyState title="目前沒有優惠券" body="切換其他分類看看。" /> : coupons.map((coupon) => (
        <Card key={coupon.id} className="relative overflow-hidden border-l-0 pl-5">
          <div className={`absolute left-0 top-0 h-full w-2 ${coupon.status === 'expiring' ? 'bg-brand-orange' : coupon.status === 'used' ? 'bg-slate-300' : 'bg-brand-green'}`} />
          <div className="absolute right-5 top-5 h-14 w-14 rounded-full border-2 border-dashed border-emerald-100" />
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-black">{coupon.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{coupon.description}</p>
            </div>
            {coupon.status === 'expiring' && <Badge tone="red">快到期</Badge>}
            {coupon.status === 'used' && <Badge tone="gray">已使用</Badge>}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <p>期限：{coupon.expireDate}</p>
            <p>門檻：{coupon.threshold}</p>
            <p className="col-span-2">適用商品：{coupon.product}</p>
          </div>
          <Button onClick={() => setSelected(coupon)} disabled={coupon.status === 'used'} className="mt-4 w-full py-2.5">{coupon.status === 'used' ? '已使用' : '立即使用'}</Button>
        </Card>
      ))}
      {selected && (
        <Modal title="優惠券詳細資料" onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black">{selected.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{selected.description}</p>
            </div>
            <QRBox label="優惠券核銷碼" />
            <div className="rounded-3xl bg-slate-50 p-4 text-sm leading-7">
              <p>使用期限：{selected.expireDate}</p>
              <p>使用門檻：{selected.threshold}</p>
              <p>適用商品：{selected.product}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SecondaryButton onClick={() => setSelected(null)}>取消</SecondaryButton>
              <Button loading={loading} onClick={handleUse}>模擬使用</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
