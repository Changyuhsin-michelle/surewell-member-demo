import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Bot, BarChart3, ChevronRight, Coffee, Crown, Gift, History, Milk, Settings, Coins, Trophy } from 'lucide-react';
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
  const expiringCoupons = useMemo(() => state.coupons.filter((coupon) => coupon.status === 'expiring'), [state.coupons]);
  const activeCouponCount = useMemo(() => state.coupons.filter((coupon) => coupon.status !== 'used').length, [state.coupons]);
  const remainingCups = state.storedProducts.reduce((sum, item) => sum + item.total - item.redeemed, 0);
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

      <section onClick={() => navigate('/member-card')} className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-brand-deep via-brand-green to-[#35a86d] p-5 text-white shadow-[0_20px_44px_rgba(7,92,53,0.24)]">
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
        <div className="mt-4 rounded-2xl bg-white/12 p-3">
          <div className="flex items-center justify-between text-xs font-bold text-white/80">
            <span>距離 {state.member.nextLevel} 還差 ${state.member.upgradeRemaining.toLocaleString()}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-brand-orange" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

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
            <Button onClick={() => navigate('/coupons/c2')} className="mt-3 w-full py-2">立即使用</Button>
          </div>
        </div>
      </Card>

      <section>
        <h2 className="mb-3 text-lg font-black">你可能要注意</h2>
        <div className="space-y-2">
          {[
            { title: `${state.member.pointsExpiring} 點將於 ${state.member.pointsExpireDate} 到期`, body: '可先兌換購物金或優惠券', to: '/points', tone: 'bg-orange-50 text-orange-700' },
            { title: `${expiringCount} 張優惠券即將到期`, body: '結帳前記得先看看可用優惠', to: '/coupons', tone: 'bg-red-50 text-red-700' },
            { title: `寄存商品剩 ${remainingCups} 份`, body: '到店時可直接出示兌換碼', to: '/stored-products', tone: 'bg-emerald-50 text-brand-deep' }
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
        <div className="flex gap-3 overflow-x-auto pb-1">
          {[
            { label: '優惠券', icon: Gift, to: '/coupons' },
            { label: '點數', icon: Coins, to: '/points' },
            { label: '任務', icon: Trophy, to: '/missions' },
            { label: '寄存', icon: Coffee, to: '/stored-products' },
            { label: '權益', icon: Crown, to: '/member-benefits' },
            { label: '洞察', icon: BarChart3, to: '/spending-insights' },
            { label: '交易', icon: History, to: '/transactions' },
            { label: 'AI 助理', icon: Bot, to: '/ai' }
          ].map((item) => (
            <button key={item.label} onClick={() => navigate(item.to)} className="min-w-[72px] rounded-[24px] bg-white p-3 text-center shadow-soft transition active:scale-[0.97]">
              <item.icon className="mx-auto text-brand-green" size={25} strokeWidth={2.4} />
              <p className="mt-2 text-xs font-bold">{item.label}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-black">即將到期優惠</h2>
          <button onClick={() => navigate('/coupons')} className="text-sm font-black text-brand-green">全部優惠</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {expiringCoupons.map((coupon) => (
            <button key={coupon.id} onClick={() => navigate(`/coupons/${coupon.id}`)} className="min-w-[235px] text-left">
              <Card className="bg-gradient-to-br from-white to-orange-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-orange-700">剩 {coupon.daysLeft ?? 3} 天到期</p>
                    <h3 className="mt-1 text-lg font-black">{coupon.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{coupon.threshold}</p>
                  </div>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">立即使用</span>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
