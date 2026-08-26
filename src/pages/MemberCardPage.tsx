import { Barcode, BrandLogo, Card, PageHeader, QRBox } from '../components/UI';
import { useDemo } from '../store/DemoContext';

export default function MemberCardPage() {
  const { state } = useDemo();
  const progress = Math.min(100, Math.round((state.member.yearlySpend / state.member.nextLevelTarget) * 100));

  return (
    <div className="space-y-4">
      <PageHeader title="電子會員卡" subtitle="結帳出示會員碼，即可累點、折抵與核銷優惠。" />
      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-brand-deep via-brand-green to-[#2da665] p-5 text-white shadow-[0_22px_48px_rgba(7,92,53,0.24)]">
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
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-black">{state.member.level}</span>
        </div>
        <div className="relative mt-5 rounded-[30px] bg-white p-4 text-slate-900 shadow-xl">
          <p className="mb-3 text-center text-sm font-black text-slate-500">結帳時請出示此畫面</p>
          <QRBox label={state.member.memberNo} />
          <div className="mt-4"><Barcode /></div>
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
    </div>
  );
}
