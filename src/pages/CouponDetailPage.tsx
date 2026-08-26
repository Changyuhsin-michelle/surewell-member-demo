import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, PageHeader, QRBox } from '../components/UI';
import { useDemo } from '../store/DemoContext';

function couponHero(title: string) {
  if (title.includes('第二件')) return '第 2 件 5 折';
  if (title.includes('95')) return '95 折';
  const match = title.match(/折\s?(\d+)/);
  return match ? `$${match[1]} OFF` : '會員優惠';
}

export default function CouponDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, useCoupon } = useDemo();
  const coupon = state.coupons.find((item) => item.id === id);

  if (!coupon) return <Navigate to="/coupons" replace />;

  return (
    <div className="space-y-4">
      <PageHeader title="優惠券詳細" subtitle="確認使用條件後，結帳時出示核銷碼。" />
      <section className="rounded-[34px] bg-gradient-to-br from-brand-deep to-brand-green p-5 text-white shadow-retail">
        <p className="text-sm text-white/70">{coupon.category ?? '會員限定'}｜剩 {coupon.daysLeft ?? '—'} 天到期</p>
        <h1 className="mt-1 text-4xl font-black">{couponHero(coupon.title)}</h1>
        <p className="mt-2 text-lg font-black">{coupon.title}</p>
        <p className="mt-1 text-sm text-white/75">{coupon.description}</p>
      </section>

      <Card>
        <h2 className="mb-3 text-lg font-black">使用資訊</h2>
        <div className="space-y-3 text-sm leading-6 text-slate-600">
          <p><span className="font-black text-slate-900">使用條件：</span>{coupon.threshold}</p>
          <p><span className="font-black text-slate-900">適用商品：</span>{coupon.product}</p>
          <p><span className="font-black text-slate-900">適用門市：</span>{coupon.store ?? '喜互惠各門市'}</p>
          <p><span className="font-black text-slate-900">有效期限：</span>{coupon.expireDate}</p>
          <p><span className="font-black text-slate-900">注意事項：</span>{coupon.note ?? '依門市結帳結果為準。'}</p>
        </div>
      </Card>

      <Card className="text-center">
        <QRBox label="優惠券核銷碼" />
        <Button disabled={coupon.status === 'used'} onClick={() => { useCoupon(coupon.id); navigate('/coupons'); }} className="mt-4 w-full">
          {coupon.status === 'used' ? '已使用' : '出示優惠券'}
        </Button>
      </Card>
    </div>
  );
}
