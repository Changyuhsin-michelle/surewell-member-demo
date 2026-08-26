import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Barcode, BrandLogo, Button, Card, Modal, PageHeader, QRBox, SecondaryButton } from '../components/UI';
import { useDemo } from '../store/DemoContext';

export default function MemberCardPage() {
  const { state, checkoutPurchase } = useDemo();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'member' | 'payment'>('member');
  const [bright, setBright] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [amount, setAmount] = useState('200');
  const [useShoppingCredit, setUseShoppingCredit] = useState(true);
  const [creditAmount, setCreditAmount] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [barcodeToken, setBarcodeToken] = useState(() => Math.random().toString(36).slice(2, 10).toUpperCase());
  const payableAmount = Number(amount);
  const requestedCredit = creditAmount ? Number(creditAmount) : payableAmount;
  const creditPreview = useShoppingCredit ? Math.min(state.wallet.shoppingCredit, requestedCredit, Math.max(0, payableAmount)) : 0;
  const storedPreview = Math.min(state.wallet.storedValue, Math.max(0, payableAmount - creditPreview));
  const otherPreview = Math.max(0, payableAmount - creditPreview - storedPreview);
  const progress = Math.min(100, Math.round((state.member.yearlySpend / state.member.nextLevelTarget) * 100));
  const countdown = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const seconds = (secondsLeft % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  useEffect(() => {
    if (searchParams.get('mode') === 'payment') setMode('payment');
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          setBarcodeToken(Math.random().toString(36).slice(2, 10).toUpperCase());
          return 180;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="電子會員卡" subtitle="結帳出示會員碼，即可累點、折抵與核銷優惠。" />
      <section className={`relative overflow-hidden rounded-[34px] p-5 shadow-[0_22px_48px_rgba(7,92,53,0.24)] ${bright ? 'bg-white text-slate-900' : 'bg-gradient-to-br from-brand-deep via-brand-green to-[#2da665] text-white'}`}>
        <div className="absolute right-0 -top-10 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 left-8 h-28 w-28 rounded-full bg-brand-orange/25" />
        <div className="mb-5 inline-flex rounded-2xl bg-white/95 p-2">
          <BrandLogo compact />
        </div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/75">喜互惠會員</p>
            <h1 className="text-2xl font-black">{state.member.name}</h1>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-black ${bright ? 'bg-brand-light text-brand-deep' : 'bg-white/15'}`}>{state.member.level}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-[22px] bg-white/15 p-1">
          {[
            { key: 'member', label: '會員碼' },
            { key: 'payment', label: '付款碼' }
          ].map((item) => (
            <button key={item.key} onClick={() => setMode(item.key as 'member' | 'payment')} className={`rounded-[18px] px-3 py-2 text-sm font-black ${mode === item.key ? 'bg-white text-brand-deep' : bright ? 'text-slate-500' : 'text-white/75'}`}>{item.label}</button>
          ))}
        </div>
        <div className={`relative mt-4 rounded-[30px] bg-white p-4 text-slate-900 shadow-xl ${bright ? 'scale-[1.03]' : ''}`}>
          <p className="mb-3 text-center text-sm font-black text-slate-500">{mode === 'member' ? '結帳時請出示會員碼' : '使用會員錢包付款'}</p>
          <QRBox label={mode === 'member' ? state.member.memberNo : `付款碼 ${barcodeToken}`} />
          <div className="mt-4"><Barcode /></div>
          {mode === 'payment' && <Button onClick={() => setPayOpen(true)} className="mt-4 w-full">使用會員錢包付款</Button>}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <SecondaryButton onClick={() => setBright((value) => !value)} className={bright ? 'bg-brand-green text-white ring-brand-green' : 'bg-white/15 text-white ring-white/20'}>提升亮度</SecondaryButton>
          <SecondaryButton className={bright ? 'bg-slate-50' : 'bg-white/15 text-white ring-white/20'}>條碼 {countdown}</SecondaryButton>
        </div>
      </section>
      <Card className="bg-gradient-to-br from-white to-brand-mint">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-3 shadow-sm"><p className="text-xs text-slate-500">會員點數</p><p className="text-xl font-black">{state.wallet.points.toLocaleString()} 點</p></div>
          <div className="rounded-2xl bg-white p-3 shadow-sm"><p className="text-xs text-slate-500">會員狀態</p><p className="text-xl font-black text-brand-green">{state.member.active ? '有效' : '停用'}</p></div>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">目前：{state.member.level}</p>
            <h2 className="text-xl font-black">下一級：{state.member.nextLevel}</h2>
          </div>
          <p className="text-sm font-black text-brand-green">{progress}%</p>
        </div>
        <div className="mt-4 h-4 overflow-hidden rounded-full bg-emerald-50">
          <div className="h-full rounded-full bg-brand-green transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-sm text-slate-500">年度消費：{state.member.yearlySpend.toLocaleString()} / {state.member.nextLevelTarget.toLocaleString()} 元</p>
        <p className="mt-1 text-sm font-bold text-orange-700">距離升級還差 {state.member.upgradeRemaining.toLocaleString()} 元</p>
      </Card>
      <Card>
        <h2 className="mb-3 text-lg font-black">黃金會員權益</h2>
        <ul className="space-y-3 text-sm">
          {['消費累積點數', '會員專屬價', '生日優惠券', '專屬活動', '儲值優惠'].map((item) => (
            <li key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 font-bold"><span className="h-2.5 w-2.5 rounded-full bg-brand-green" />{item}</li>
          ))}
        </ul>
      </Card>
      {payOpen && (
        <Modal title="會員錢包付款" onClose={() => setPayOpen(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="shadow-none">
                <p className="text-sm text-slate-500">購物金</p>
                <p className="text-2xl font-black">${state.wallet.shoppingCredit.toLocaleString()}</p>
              </Card>
              <Card className="shadow-none">
                <p className="text-sm text-slate-500">儲值金</p>
                <p className="text-2xl font-black">${state.wallet.storedValue.toLocaleString()}</p>
              </Card>
            </div>
            <input value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ''))} className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-green" placeholder="輸入付款金額" />
            <div className="rounded-3xl bg-slate-50 p-4">
              <label className="flex items-center justify-between gap-3 font-black">
                <span>使用購物金</span>
                <input type="checkbox" checked={useShoppingCredit} onChange={(event) => setUseShoppingCredit(event.target.checked)} className="h-5 w-5 accent-brand-green" />
              </label>
              {useShoppingCredit && (
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <input
                    value={creditAmount}
                    onChange={(event) => setCreditAmount(event.target.value.replace(/\D/g, ''))}
                    className="min-w-0 rounded-2xl bg-white px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-green"
                    placeholder="自訂購物金金額"
                  />
                  <SecondaryButton onClick={() => setCreditAmount(String(Math.min(state.wallet.shoppingCredit, payableAmount)))}>全部使用</SecondaryButton>
                </div>
              )}
            </div>
            <div className="rounded-3xl bg-brand-light p-4 text-sm leading-7 text-brand-deep">
              <p className="font-black">付款順序：商品金額 → 購物金 → 儲值金 → 其他支付</p>
              <p>本次預估折抵購物金 ${creditPreview.toLocaleString()}</p>
              <p>本次預估扣儲值金 ${storedPreview.toLocaleString()}</p>
              <p>其他支付補足 ${otherPreview.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SecondaryButton onClick={() => setPayOpen(false)}>取消</SecondaryButton>
              <Button disabled={payableAmount <= 0} onClick={() => {
                checkoutPurchase({
                  originalAmount: payableAmount,
                  useShoppingCredit,
                  shoppingCreditAmount: creditPreview,
                  store: '喜互惠 Demo 店'
                });
                setPayOpen(false);
              }}>確認付款</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
