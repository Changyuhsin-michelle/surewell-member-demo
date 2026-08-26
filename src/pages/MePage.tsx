import { useState } from 'react';
import { Bell, Bot, ChevronRight, CircleHelp, Coffee, History, LogOut, RotateCcw, Settings, ShieldCheck, User } from 'lucide-react';
import { Button, Card, Modal, PageHeader, SecondaryButton } from '../components/UI';
import { useDemo } from '../store/DemoContext';
import { useNavigate } from 'react-router-dom';

export default function MePage() {
  const { state, resetDemo } = useDemo();
  const navigate = useNavigate();
  const [resetOpen, setResetOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const menu = [
    { label: '會員權益', icon: ShieldCheck, action: () => navigate('/member-card') },
    { label: '交易明細', icon: History, action: () => navigate('/transactions') },
    { label: '寄杯 / 寄商品', icon: Coffee, action: () => navigate('/stored-products') },
    { label: '通知中心', icon: Bell, action: () => navigate('/notifications') },
    { label: '個人資料', icon: User, action: () => setProfileOpen(true) },
    { label: '常見問題', icon: CircleHelp, action: () => setFaqOpen(true) },
    { label: 'AI 客服', icon: Bot, action: () => navigate('/ai') },
    { label: '登出', icon: LogOut, action: () => setLogoutOpen(true) }
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="我的" subtitle="會員資料與服務設定。" />
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white to-brand-mint p-5 text-center shadow-retail">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-orange/10" />
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-light text-3xl font-black text-brand-deep ring-4 ring-white">{state.member.name.slice(0, 1)}</div>
        <h1 className="mt-3 text-2xl font-black">{state.member.name}</h1>
        <p className="text-sm font-bold text-orange-700">{state.member.level}</p>
        <p className="mt-1 text-xs text-slate-500">會員編號 {state.member.memberNo}</p>
      </section>
      <Card className="divide-y divide-slate-100 p-0">
        {menu.map((item) => (
          <button key={item.label} onClick={item.action} className="flex w-full items-center justify-between px-4 py-4 text-left">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-light p-2 text-brand-green"><item.icon size={20} /></div>
              <span className="font-bold">{item.label}</span>
            </div>
            <ChevronRight className="text-slate-400" size={18} />
          </button>
        ))}
      </Card>
      <Card>
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-orange-50 p-3 text-orange-600"><Settings size={22} /></div>
          <div className="flex-1">
            <p className="font-black">Demo 管理</p>
            <p className="mt-1 text-sm text-slate-500">每次簡報前可恢復預設會員資料。</p>
            <Button onClick={() => setResetOpen(true)} className="mt-4 w-full bg-orange-600"><RotateCcw size={18} />重置 Demo 資料</Button>
          </div>
        </div>
      </Card>
      {resetOpen && (
        <Modal title="確認重置 Demo？" onClose={() => setResetOpen(false)}>
          <div className="space-y-4">
            <p className="leading-7 text-slate-600">此操作會清除 LocalStorage，恢復優惠券、儲值金、寄杯、通知與交易紀錄的預設資料。</p>
            <div className="grid grid-cols-2 gap-3">
              <SecondaryButton onClick={() => setResetOpen(false)}>取消</SecondaryButton>
              <Button onClick={() => { resetDemo(); setResetOpen(false); }}>確認重置</Button>
            </div>
          </div>
        </Modal>
      )}
      {profileOpen && (
        <Modal title="個人資料" onClose={() => setProfileOpen(false)}>
          <div className="space-y-3 rounded-3xl bg-slate-50 p-4 text-sm leading-7">
            <p><span className="font-bold text-slate-500">姓名：</span>{state.member.name}</p>
            <p><span className="font-bold text-slate-500">會員等級：</span>{state.member.level}</p>
            <p><span className="font-bold text-slate-500">會員編號：</span>{state.member.memberNo}</p>
            <p><span className="font-bold text-slate-500">會員狀態：</span>{state.member.active ? '有效' : '停用'}</p>
          </div>
          <Button onClick={() => setProfileOpen(false)} className="mt-4 w-full">關閉</Button>
        </Modal>
      )}
      {faqOpen && (
        <Modal title="常見問題" onClose={() => setFaqOpen(false)}>
          <div className="space-y-3 text-sm leading-7 text-slate-700">
            <p><strong>Q：點數在哪裡看？</strong><br />可於首頁、錢包與 AI 客服查詢。</p>
            <p><strong>Q：優惠券如何使用？</strong><br />到優惠頁點「立即使用」，出示 QR Code 給門市核銷。</p>
            <p><strong>Q：寄杯可以轉贈嗎？</strong><br />Demo 版可產生轉贈邀請，正式版需串接通知服務。</p>
          </div>
          <Button onClick={() => setFaqOpen(false)} className="mt-4 w-full">我知道了</Button>
        </Modal>
      )}
      {logoutOpen && (
        <Modal title="登出 Demo" onClose={() => setLogoutOpen(false)}>
          <p className="leading-7 text-slate-600">目前為展示模式，不會真的登出會員帳號。正式版可在此串接登入 / 登出流程。</p>
          <Button onClick={() => setLogoutOpen(false)} className="mt-4 w-full">返回 Demo</Button>
        </Modal>
      )}
    </div>
  );
}
