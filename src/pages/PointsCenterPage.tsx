import { Coins, Gift, RotateCcw } from 'lucide-react';
import { Button, Card, PageHeader } from '../components/UI';
import { useDemo } from '../store/DemoContext';

export default function PointsCenterPage() {
  const { state, redeemPointReward } = useDemo();
  const pointTxs = state.transactions.filter((tx) => tx.type === 'points').slice(0, 6);

  return (
    <div className="space-y-4">
      <PageHeader title="點數中心" subtitle="查看點數餘額、到期提醒與可兌換項目。" />
      <section className="rounded-[34px] bg-gradient-to-br from-brand-deep via-brand-green to-[#2fa769] p-5 text-white shadow-retail">
        <p className="text-sm text-white/65">目前點數</p>
        <h1 className="mt-1 text-4xl font-black">{state.wallet.points.toLocaleString()}</h1>
        <div className="mt-4 rounded-2xl bg-white/14 p-3">
          <p className="text-sm font-bold">{state.member.pointsExpiring} 點將於 {state.member.pointsExpireDate} 到期</p>
          <p className="mt-1 text-xs text-white/70">可先兌換購物金或優惠券，避免點數失效。</p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-sm text-slate-500">今年累積</p>
          <p className="mt-1 text-2xl font-black">4,860</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">今年使用</p>
          <p className="mt-1 text-2xl font-black">3,580</p>
        </Card>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-black">點數可以換什麼？</h2>
        <div className="space-y-3">
          {state.pointRewards.map((reward) => (
            <Card key={reward.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brand-light p-3 text-brand-green"><Gift size={22} /></div>
                <div>
                  <p className="font-black">{reward.title}</p>
                  <p className="text-sm text-slate-500">需要 {reward.pointsCost.toLocaleString()} 點</p>
                </div>
              </div>
              <Button disabled={(reward.oneTime && reward.claimed) || state.wallet.points < reward.pointsCost} onClick={() => redeemPointReward(reward.id)} className="shrink-0 px-3 py-2 text-xs">
                {reward.oneTime && reward.claimed ? '已兌換' : '兌換'}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <Coins className="text-brand-green" size={21} />
          <h2 className="text-lg font-black">點數紀錄</h2>
        </div>
        <div className="space-y-3">
          {pointTxs.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
              <div>
                <p className="font-black">{tx.title}</p>
                <p className="text-xs text-slate-500">{tx.date}｜{tx.detail}</p>
              </div>
              <p className={`font-black ${Number(tx.points) >= 0 ? 'text-brand-green' : 'text-orange-700'}`}>{Number(tx.points) > 0 ? '+' : ''}{tx.points} 點</p>
            </div>
          ))}
          {pointTxs.length === 0 && (
            <div className="rounded-2xl bg-slate-50 p-4 text-center text-sm text-slate-500">
              <RotateCcw className="mx-auto mb-2 text-slate-400" size={22} />
              尚無點數異動紀錄
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
