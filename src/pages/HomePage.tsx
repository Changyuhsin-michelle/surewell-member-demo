import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Bot, ChevronRight, Coffee, Gift, History, IdCard, Milk, Sandwich, Apple, Cookie } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <BrandLogo />
        <button onClick={() => navigate('/notifications')} className="relative rounded-2xl bg-white p-3 text-brand-deep shadow-soft">
          <Bell size={22} />
          {unreadCount > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
        </button>
      </div>

      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-green via-[#1f9658] to-brand-deep p-5 text-white shadow-retail">
        <div className="absolute right-0 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-14 left-10 h-32 w-32 rounded-full bg-brand-orange/20" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/80">{state.member.name}，{greeting()}</p>
            <h1 className="mt-1 text-2xl font-black">{state.member.level}</h1>
          </div>
          <Badge tone="orange">專屬會員</Badge>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-xs text-white/75">會員點數</p>
            <p className="text-xl font-black">{state.wallet.points.toLocaleString()} 點</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-xs text-white/75">儲值金</p>
            <p className="text-xl font-black">${state.wallet.storedValue.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <button onClick={() => navigate('/member-card')} className="w-full">
        <Card className="flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-light p-3 text-brand-deep"><IdCard size={25} /></div>
            <div>
              <p className="font-black">電子會員卡</p>
              <p className="text-sm text-slate-500">結帳時直接出示 QR Code / Barcode</p>
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
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[24px] bg-blue-50 text-blue-500 shadow-inner"><Milk size={42} /></div>
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

      <button onClick={() => navigate('/coupons')} className="w-full">
        <Card className="flex items-center justify-between border-orange-100 bg-brand-amber text-left">
          <div>
            <p className="font-black text-orange-800">即將到期提醒</p>
            <p className="text-sm text-orange-700">你有 {expiringCount} 張優惠券即將到期。</p>
          </div>
          <ChevronRight className="text-orange-500" />
        </Card>
      </button>

      <section>
        <h2 className="mb-3 text-lg font-black">快捷功能</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '優惠券', icon: Gift, to: '/coupons' },
            { label: '寄杯', icon: Coffee, to: '/stored-products' },
            { label: '交易紀錄', icon: History, to: '/transactions' },
            { label: 'AI 客服', icon: Bot, to: '/ai' }
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
            { name: '鮮奶', icon: Milk, tone: 'bg-blue-50 text-blue-500' },
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
