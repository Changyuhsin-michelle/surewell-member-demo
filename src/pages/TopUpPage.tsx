import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal, PageHeader, SecondaryButton } from '../components/UI';
import { useDemo } from '../store/DemoContext';

const plans = [
  { amount: 500, bonus: 0 },
  { amount: 1000, bonus: 50 },
  { amount: 2000, bonus: 120 }
];

export default function TopUpPage() {
  const { state, topUp } = useDemo();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<{ amount: number; bonus: number } | null>(null);
  const [custom, setCustom] = useState('');
  const [method, setMethod] = useState('信用卡');
  const [loading, setLoading] = useState(false);

  const confirm = () => {
    if (!selected) return;
    setLoading(true);
    window.setTimeout(() => {
      topUp(selected.amount, selected.bonus, method);
      setLoading(false);
      setSelected(null);
      navigate('/wallet');
    }, 800);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="儲值" subtitle={`目前儲值金 $${state.wallet.storedValue.toLocaleString()}`} />
      <section className="rounded-[32px] bg-gradient-to-br from-brand-deep to-brand-green p-5 text-white shadow-retail">
        <p className="text-sm text-white/65">目前可用儲值金</p>
        <h1 className="mt-1 text-4xl font-black">${state.wallet.storedValue.toLocaleString()}</h1>
        <p className="mt-2 text-sm text-white/70">儲值後可於門市結帳使用，活動購物金將自動加入錢包。</p>
      </section>
      <div className="space-y-3">
        {plans.map((plan) => (
          <button key={plan.amount} onClick={() => setSelected(plan)} className="w-full">
            <Card className={`flex items-center justify-between text-left transition active:scale-[0.98] ${plan.bonus ? 'bg-brand-cream' : ''}`}>
              <div>
                <p className="text-xl font-black">儲值 {plan.amount.toLocaleString()} 元</p>
                <p className="text-sm text-slate-500">{plan.bonus ? `加贈 ${plan.bonus} 元購物金` : '一般儲值方案'}</p>
              </div>
              {plan.bonus > 0 && <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">加碼</span>}
            </Card>
          </button>
        ))}
      </div>
      <Card>
        <p className="mb-2 font-black text-brand-ink">自訂金額</p>
        <div className="flex gap-2">
          <input value={custom} onChange={(event) => setCustom(event.target.value.replace(/\D/g, ''))} placeholder="輸入金額" className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-green" />
          <Button disabled={Number(custom) <= 0} onClick={() => setSelected({ amount: Number(custom), bonus: 0 })}>儲值</Button>
        </div>
      </Card>
      {selected && (
        <Modal title="付款確認" onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <Card className="shadow-none">
              <p className="text-sm text-slate-500">儲值金額</p>
              <p className="text-3xl font-black">${selected.amount.toLocaleString()}</p>
              {selected.bonus > 0 && <p className="mt-1 font-bold text-orange-700">加贈購物金 ${selected.bonus}</p>}
            </Card>
            <div>
              <p className="mb-2 font-black">付款方式</p>
              <div className="grid grid-cols-3 gap-2">
                {['信用卡', 'LINE Pay', '街口支付'].map((item) => (
                  <button key={item} onClick={() => setMethod(item)} className={`rounded-2xl border px-2 py-3 text-sm font-bold ${method === item ? 'border-brand-green bg-brand-light text-brand-deep' : 'border-slate-200'}`}>{item}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SecondaryButton onClick={() => setSelected(null)}>取消</SecondaryButton>
              <Button loading={loading} onClick={confirm}>確認付款</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
