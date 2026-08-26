import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Bot, ChevronRight, Coffee, Gift, History, IdCard, Milk, Sandwich, Apple, Cookie, Settings, WalletCards, Coins, Ticket } from 'lucide-react';
import { Badge, BrandLogo, Button, Card } from '../components/UI';
import { useDemo } from '../store/DemoContext';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 11) return '早安';
  if (hour < 17) return '午安';
  return '晚安';
}

export default function HomePage() {
  const { state, unreadCount } = useDemo();
  const navigate = useNavigate();
  const expiringCount = useMemo(() => state.coupons.filter((coupon) => coupon.status === 'expiring').length, [state.coupons]);
  const activeCouponCount = useMemo(() => state.coupons.filter((coupon) => coupon.status !== 'used').length, [state.coupons]);
  const remainingCups = state.storedProducts[0].total - state.storedProducts[0].redeemed;
  const progress = Math.min(100, Math.round((state.member.yearlySpend / state.member.nextLevelTarget) * 100));
  const memberLast4 = state.member.memberNo.slice(-4);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <BrandLogo />
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/notifications')} className="relative rounded-2xl bg-white p-3 text-brand-deep shadow-soft">
            <Bell size={22} />
            {unreadCount > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
          </button>
          <button onClick={() => navigate('/me')} className="rounded-2xl bg-white p-3 text-slate-500 shadow-soft">
            <Settings size={21} />
          </button>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-brand-deep via-brand-green to-[#35a86d] p-5 text-white shadow-[0_20px_44px_rgba(7,92,53,0.24)]">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-white/10" />
        <div className="absolute -bottom-16 left-8 h-36 w-36 rounded-full bg-brand-orange/25" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/80">{state.member.name}，{greeting()}</p>
            <h1 className="mt-1 text-2xl font-black">{state.member.level}</h1>
            <p className="mt-1 text-xs font-bold text-white/60">會員編號末四碼 {memberLast4}</p>
          </div>
          <Badge tone="orange">專屬會員</Badge>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-xs text-white/75">會員點數</p>
            <p className="text-xl font-black">{state.wallet.points.toLocaleString()} 點</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-xs text-white/75">儲值金</p>
            <p className="text-xl font-black">${state.wallet.storedValue.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-xs text-white/75">優惠券</p>
            <p className="text-xl font-black">{activeCouponCount} 張</p>
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-white/12 p-3">
          <div className="flex items-center justify-between text-xs font-bold text-white/80">
            <span>距離 {state.member.nextLevel} 還差 ${state.member.upgradeRemaining.toLocaleString()}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-brand-orange" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-black">我的會員資產</h2>
          <button onClick={() => navigate('/wallet')} className="text-sm font-black text-brand-green">查看錢包</button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '點數', value: state.wallet.points.toLocaleString(), icon: Coins, to: '/wallet' },
            { label: '儲值金', value: `$${state.wallet.storedValue.toLocaleString()}`, icon: WalletCards, to: '/wallet' },
            { label: '優惠券', value: String(activeCouponCount), icon: Ticket, to: '/coupons' },
            { label: '寄杯', value: String(remainingCups), icon: Coffee, to: '/stored-products' }
          ].map((item) => (
            <button key={item.label} onClick={() => navigate(item.to)} className="rounded-[24px] bg-white px-2 py-3 text-center shadow-soft transition active:scale-[0.97]">
              <item.icon className="mx-auto text-brand-green" size={20} />
              <p className="mt-2 text-lg font-black leading-none">{item.value}</p>
              <p className="mt-1 text-[11px] font-bold text-slate-500">{item.label}</p>
            </button>
          ))}
        </div>
      </section>

      <button onClick={() => navigate('/member-card')} className="w-full">
        <Card className="flex items-center justify-between bg-white/90 text-left">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-light p-3 text-brand-deep"><IdCard size={25} /></div>
            <div>
              <p className="font-black">電子會員卡</p>
              <p className="text-sm text-slate-500">結帳出示即可累點與核銷優惠</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </Card>
      </button>

      <Card className="border-orange-100 bg-gradient-to-br from-white to-brand-cream">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-brand-deep">專屬於你的優惠</p>
            <h2 className="text-lg font-black">指定鮮奶第二件 5 折</h2>
          </div>
          <Badge tone="orange">個人化</Badge>
        </div>
        <div className="flex gap-3">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[24px] bg-brand-light text-brand-green shadow-inner"><Milk size={42} /></div>
          <div className="flex-1">
            <p className="text-sm leading-5 text-slate-600">你最近常買鮮奶，本週指定鮮奶第二件 5 折。</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-sm text-slate-400 line-through">$92</span>
              <span className="text-xl font-black text-brand-green">$46</span>
            </div>
            <Button onClick={() => navigate('/coupons')} className="mt-3 w-full py-2">查看優惠</Button>
          </div>
        </div>
      </Card>

      <section>
        <h2 className="mb-3 text-lg font-black">你可能要注意</h2>
        <div className="space-y-2">
          {[
            { title: `${state.member.pointsExpiring} 點將於 ${state.member.pointsExpireDate} 到期`, body: '可先兌換購物金或優惠券', to: '/wallet', tone: 'bg-orange-50 text-orange-700' },
            { title: `${expiringCount} 張優惠券即將到期`, body: '結帳前記得先看看可用優惠', to: '/coupons', tone: 'bg-red-50 text-red-700' },
            { title: `美式咖啡剩 ${remainingCups} 杯`, body: '到店時可直接出示兌換碼', to: '/stored-products', tone: 'bg-emerald-50 text-brand-deep' }
          ].map((item) => (
            <button key={item.title} onClick={() => navigate(item.to)} className="w-full">
              <div className={`flex items-center justify-between rounded-[22px] px-4 py-3 text-left ${item.tone}`}>
                <div>
                  <p className="font-black">{item.title}</p>
                  <p className="text-xs opacity-75">{item.body}</p>
                </div>
                <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-black">快捷功能</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '優惠券', icon: Gift, to: '/coupons' },
            { label: '寄存', icon: Coffee, to: '/stored-products' },
            { label: '交易紀錄', icon: History, to: '/transactions' },
            { label: 'AI 助理', icon: Bot, to: '/ai' }
          ].map((item) => (
            <button key={item.label} onClick={() => navigate(item.to)} className="rounded-[24px] bg-white p-3 text-center shadow-soft transition active:scale-[0.97]">
              <item.icon className="mx-auto text-brand-green" size={25} strokeWidth={2.4} />
              <p className="mt-2 text-xs font-bold">{item.label}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-black">猜你喜歡</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: '鮮奶', icon: Milk, tone: 'bg-brand-light text-brand-green' },
            { name: '穀王吐司', icon: Sandwich, tone: 'bg-orange-50 text-orange-500' },
            { name: '水果', icon: Apple, tone: 'bg-red-50 text-red-500' },
            { name: '餅乾', icon: Cookie, tone: 'bg-yellow-50 text-yellow-600' }
          ].map((product) => (
            <Card key={product.name} className="p-3">
              <div className={`flex h-24 items-center justify-center rounded-3xl ${product.tone}`}><product.icon size={42} /></div>
              <p className="mt-2 font-black">{product.name}</p>
              <p className="text-xs text-slate-500">依最近 30 天購買紀錄推薦</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
