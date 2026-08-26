import { NavLink, Outlet } from 'react-router-dom';
import { Gift, Home, IdCard, User, WalletCards } from 'lucide-react';
import { useDemo } from '../store/DemoContext';

const navItems = [
  { to: '/', label: '首頁', icon: Home },
  { to: '/coupons', label: '優惠', icon: Gift },
  { to: '/member-card', label: '會員卡', icon: IdCard },
  { to: '/wallet', label: '錢包', icon: WalletCards },
  { to: '/me', label: '我的', icon: User }
];

export default function AppShell() {
  const { toast } = useDemo();
  return (
    <div className="min-h-screen bg-[#eef2ee] text-slate-800">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-[#f7f7f4] shadow-2xl md:my-6 md:min-h-[844px] md:overflow-hidden md:rounded-[30px]">
        <main className="safe-top flex-1 overflow-y-auto bg-[linear-gradient(180deg,#fbfbf7_0%,#f7f7f4_42%,#f2f4f1_100%)] px-4 pb-28 pt-4">
          <Outlet />
        </main>
        <nav className="safe-bottom fixed bottom-0 left-1/2 z-40 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-5 border-t border-emerald-100 bg-white/95 px-2 py-2 shadow-[0_-16px_36px_rgba(7,92,53,0.12)] backdrop-blur md:bottom-6 md:rounded-b-[30px]">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `relative flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[20px] px-1 py-2 text-[11px] font-black transition active:scale-[0.97] ${isActive ? 'bg-brand-light text-brand-deep shadow-sm' : 'text-slate-500'}`}>
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute top-1 h-1 w-5 rounded-full bg-brand-orange" />}
                  <Icon size={21} strokeWidth={2.4} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        {toast && (
          <div className="fixed bottom-24 left-1/2 z-50 w-[calc(100%-32px)] max-w-[390px] -translate-x-1/2 rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-xl">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
