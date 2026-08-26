import { useNavigate } from 'react-router-dom';
import { ChevronRight, Coins, CreditCard, Gift, Plus, ReceiptText, Ticket, WalletCards } from 'lucide-react';
import { Button, Card, PageHeader, SecondaryButton } from '../components/UI';
import { useDemo } from '../store/DemoContext';

export default function WalletPage() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const activeCoupons = state.coupons.filter((coupon) => coupon.status !== 'used').length;

  const cards = [
    { label: '儲值金', value: `$${state.wallet.storedValue.toLocaleString()}`, icon: WalletCards, to: '/wallet/topup', color: 'text-brand-green bg-brand-light' },
    { label: '購物金', value: `$${state.wallet.shoppingCredit.toLocaleString()}`, icon: CreditCard, to: '/transactions', color: 'text-orange-600 bg-orange-50' },
    { label: '會員點數', value: state.wallet.points.toLocaleString(), icon: Coins, to: '/points', color: 'text-brand-green bg-brand-light' },
    { label: '優惠券', value: `${activeCoupons} 張`, icon: Ticket, to: '/coupons', color: 'text-red-600 bg-red-50' }
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="會員錢包" subtitle="儲值金、購物金、點數與優惠一次查看。" />
      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-brand-deep via-brand-green to-[#2fa769] p-5 text-white shadow-[0_22px_48px_rgba(7,92,53,0.22)]">
        <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-white/10" />
        <p className="text-sm text-white/65">可用餘額</p>
        <h1 className="mt-1 text-4xl font-black">${state.wallet.storedValue.toLocaleString()}</h1>
        <p className="mt-2 text-sm text-white/70">購物金 ${state.wallet.shoppingCredit.toLocaleString()} 可於指定活動折抵</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button onClick={() => navigate('/wallet/topup')} className="bg-white text-brand-deep shadow-none"><Plus size={18} />儲值</Button>
          <SecondaryButton onClick={() => navigate('/member-card')} className="bg-white/15 text-white ring-white/20"><ReceiptText size={18} />付款碼</SecondaryButton>
        </div>
      </section>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((item) => (
          <button key={item.label} onClick={() => navigate(item.to)} className="text-left">
            <Card className="h-full transition active:scale-[0.98]">
              <div className={`mb-3 inline-flex rounded-[20px] p-3 ${item.color}`}><item.icon size={25} strokeWidth={2.4} /></div>
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-2xl font-black">{item.value}</p>
            </Card>
          </button>
        ))}
      </div>
      <button onClick={() => navigate('/stored-products')} className="w-full">
        <Card className="flex items-center justify-between border-orange-100 bg-brand-cream text-left">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-50 p-3 text-orange-600"><Gift size={25} /></div>
            <div>
              <p className="font-black">我的寄存</p>
              <p className="text-sm text-slate-500">共剩 {state.storedProducts.reduce((sum, item) => sum + item.total - item.redeemed, 0)} 份可兌換</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </Card>
      </button>
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black">最近交易</h2>
          <button onClick={() => navigate('/transactions')} className="text-sm font-black text-brand-green">查看全部</button>
        </div>
        <div className="space-y-3">
          {state.transactions.slice(0, 4).map((tx) => (
            <button key={tx.id} onClick={() => navigate('/transactions')} className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-3 text-left">
              <div>
                <p className="font-black">{tx.title}</p>
                <p className="text-xs text-slate-500">{tx.date}｜{tx.store}</p>
              </div>
              {tx.amount !== undefined ? <p className={`font-black ${tx.amount > 0 ? 'text-brand-green' : 'text-slate-900'}`}>{tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}</p> : <ChevronRight size={18} className="text-slate-400" />}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
