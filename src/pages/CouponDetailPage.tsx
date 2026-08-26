import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, PageHeader, QRBox, SecondaryButton } from '../components/UI';
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
  const { state, checkoutPurchase } = useDemo();
  const [amount, setAmount] = useState('500');
  const [useShoppingCredit, setUseShoppingCredit] = useState(true);
  const [creditAmount, setCreditAmount] = useState('');
  const coupon = state.coupons.find((item) => item.id === id);

  if (!coupon) return <Navigate to="/coupons" replace />;

  const checkoutAmount = Number(amount);
  const minimum = coupon.threshold.includes('滿') ? Number(coupon.threshold.match(/\d+/)?.[0] ?? 0) : 0;
  const minimumPassed = checkoutAmount >= minimum;
  const discount = coupon.title.includes('95') ? Math.round(checkoutAmount * 0.05) : Number(coupon.title.replace(/^滿\s?\d+\s?元?/, '').match(/\d+/)?.[0] ?? (coupon.title.includes('第二件') ? 50 : 0));
  const creditPreview = useShoppingCredit ? Math.min(state.wallet.shoppingCredit, creditAmount ? Number(creditAmount) : checkoutAmount, Math.max(0, checkoutAmount - discount)) : 0;
  const storedPreview = Math.min(state.wallet.storedValue, Math.max(0, checkoutAmount - discount - creditPreview));
  const otherPreview = Math.max(0, checkoutAmount - discount - creditPreview - storedPreview);

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
        <QRBox label="優惠券結帳碼" />
        <div className="mt-4 space-y-3 text-left">
          <input value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ''))} className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-green" placeholder="模擬消費金額" />
          {!minimumPassed && <p className="text-sm font-bold text-red-600">未達最低消費門檻，需滿 ${minimum.toLocaleString()} 才可使用。</p>}
          <label className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 font-black">
            <span>使用購物金</span>
            <input type="checkbox" checked={useShoppingCredit} onChange={(event) => setUseShoppingCredit(event.target.checked)} className="h-5 w-5 accent-brand-green" />
          </label>
          {useShoppingCredit && (
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <input value={creditAmount} onChange={(event) => setCreditAmount(event.target.value.replace(/\D/g, ''))} className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-green" placeholder="自訂購物金" />
              <SecondaryButton onClick={() => setCreditAmount(String(Math.min(state.wallet.shoppingCredit, Math.max(0, checkoutAmount - discount))))}>全部使用</SecondaryButton>
            </div>
          )}
          <div className="rounded-2xl bg-brand-light p-3 text-sm leading-7 text-brand-deep">
            <p>優惠券折抵 -${minimumPassed ? discount.toLocaleString() : '0'}</p>
            <p>購物金折抵 -${minimumPassed ? creditPreview.toLocaleString() : '0'}</p>
            <p>儲值金付款 ${minimumPassed ? storedPreview.toLocaleString() : '0'}</p>
            <p>其他支付 ${minimumPassed ? otherPreview.toLocaleString() : '0'}</p>
          </div>
        </div>
        <Button disabled={coupon.status === 'used' || !minimumPassed || checkoutAmount <= 0} onClick={() => {
          checkoutPurchase({
            originalAmount: checkoutAmount,
            couponId: coupon.id,
            useShoppingCredit,
            shoppingCreditAmount: creditPreview,
            store: '喜互惠羅東店'
          });
          navigate('/coupons');
        }} className="mt-4 w-full">
          {coupon.status === 'used' ? '已使用' : '確認付款並核銷'}
        </Button>
      </Card>
    </div>
  );
}
