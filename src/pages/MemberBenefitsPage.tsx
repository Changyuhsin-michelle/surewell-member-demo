import { Crown, ShieldCheck } from 'lucide-react';
import { Card, PageHeader } from '../components/UI';
import { useDemo } from '../store/DemoContext';

const levels = [
  { name: '一般會員', desc: '基本累點與會員價', perks: ['消費累積點數', '會員價'] },
  { name: '銀卡會員', desc: '生日禮與活動券', perks: ['生日優惠券', '會員日優惠'] },
  { name: '黃金會員', desc: '專屬優惠與儲值加碼', perks: ['專屬活動', '儲值優惠'] },
  { name: '白金會員', desc: '高倍率點數與 VIP 活動', perks: ['高倍率點數', 'VIP 活動'] }
];

export default function MemberBenefitsPage() {
  const { state } = useDemo();
  const progress = Math.min(100, Math.round((state.member.yearlySpend / state.member.nextLevelTarget) * 100));

  return (
    <div className="space-y-4">
      <PageHeader title="會員權益" subtitle="查看目前等級、升級進度與各等級權益。" />
      <section className="rounded-[34px] bg-gradient-to-br from-brand-deep to-brand-green p-5 text-white shadow-retail">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/15 p-3"><Crown size={28} /></div>
          <div>
            <p className="text-sm text-white/70">目前等級</p>
            <h1 className="text-2xl font-black">{state.member.level}</h1>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between text-sm font-bold text-white/85">
          <span>年度消費 {state.member.yearlySpend.toLocaleString()} 元</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/18">
          <div className="h-full rounded-full bg-brand-orange" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-sm text-white/75">距離 {state.member.nextLevel} 還差 ${state.member.upgradeRemaining.toLocaleString()}</p>
      </section>

      <div className="space-y-3">
        {levels.map((level) => {
          const active = level.name === state.member.level;
          return (
            <Card key={level.name} className={active ? 'bg-brand-light ring-1 ring-brand-green/15' : ''}>
              <div className="flex items-start gap-3">
                <div className={`rounded-2xl p-3 ${active ? 'bg-white text-brand-green' : 'bg-slate-50 text-slate-500'}`}><ShieldCheck size={22} /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black">{level.name}</h2>
                    {active && <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-brand-deep">目前</span>}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{level.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {level.perks.map((perk) => <span key={perk} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{perk}</span>)}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
