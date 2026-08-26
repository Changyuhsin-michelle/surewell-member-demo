import { Gift, Trophy } from 'lucide-react';
import { Button, Card, PageHeader } from '../components/UI';
import { useDemo } from '../store/DemoContext';

export default function MissionsPage() {
  const { state, claimMission } = useDemo();

  return (
    <div className="space-y-4">
      <PageHeader title="會員任務" subtitle="依會員行為設計任務，完成後可領取點數或優惠券。" />
      <section className="rounded-[34px] bg-gradient-to-br from-brand-deep to-brand-green p-5 text-white shadow-retail">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/15 p-3"><Trophy size={28} /></div>
          <div>
            <p className="text-sm text-white/70">本週任務</p>
            <h1 className="text-2xl font-black">{state.missions.filter((item) => item.current >= item.target && !item.claimed).length} 個獎勵可領</h1>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {state.missions.map((mission) => {
          const progress = Math.min(100, Math.round((mission.current / mission.target) * 100));
          const completed = mission.current >= mission.target;
          return (
            <Card key={mission.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">{mission.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{mission.description}</p>
                </div>
                <div className="rounded-2xl bg-brand-light p-3 text-brand-green"><Gift size={22} /></div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm font-bold">
                <span>{mission.current.toLocaleString()} / {mission.target.toLocaleString()} {mission.unit}</span>
                <span className="text-orange-700">獎勵 {mission.rewardLabel}</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-emerald-50">
                <div className="h-full rounded-full bg-brand-green" style={{ width: `${progress}%` }} />
              </div>
              <Button disabled={!completed || mission.claimed} onClick={() => claimMission(mission.id)} className="mt-4 w-full">
                {mission.claimed ? '已領取' : completed ? '領取獎勵' : '尚未完成'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
