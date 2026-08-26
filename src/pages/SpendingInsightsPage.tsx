import { BarChart3, ShoppingBag } from 'lucide-react';
import { Card, PageHeader } from '../components/UI';
import { useDemo } from '../store/DemoContext';

export default function SpendingInsightsPage() {
  const { state } = useDemo();
  const growth = Math.round(((state.insight.thisMonth - state.insight.lastMonth) / state.insight.lastMonth) * 100);

  return (
    <div className="space-y-4">
      <PageHeader title="消費洞察" subtitle="從會員消費行為看出偏好、分類與成長變化。" />
      <section className="rounded-[34px] bg-gradient-to-br from-brand-deep to-brand-green p-5 text-white shadow-retail">
        <p className="text-sm text-white/65">本月累積消費</p>
        <h1 className="mt-1 text-4xl font-black">${state.insight.thisMonth.toLocaleString()}</h1>
        <p className="mt-2 text-sm text-white/75">較上月同期 {growth >= 0 ? '增加' : '減少'} {Math.abs(growth)}%</p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-sm text-slate-500">上月同期</p>
          <p className="mt-1 text-2xl font-black">${state.insight.lastMonth.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">常買品項</p>
          <p className="mt-1 text-xl font-black">{state.insight.favorites[0]}</p>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="text-brand-green" size={22} />
          <h2 className="text-lg font-black">熱門分類</h2>
        </div>
        <div className="space-y-4">
          {state.insight.categories.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>{item.label}</span>
                <span>{item.percent}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-brand-green" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <ShoppingBag className="text-brand-green" size={22} />
          <h2 className="text-lg font-black">最常購買</h2>
        </div>
        <div className="flex gap-2">
          {state.insight.favorites.map((item) => (
            <span key={item} className="rounded-full bg-brand-light px-4 py-2 text-sm font-black text-brand-deep">{item}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}
