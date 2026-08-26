import { CreditCard, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '../components/UI';
import { useDemo } from '../store/DemoContext';

export default function ShoppingCreditPage() {
  const { state } = useDemo();

  return (
    <div className="space-y-4">
      <PageHeader title="購物金明細" subtitle="查看購物金取得、活動贈送與門市折抵紀錄。" />
      <section className="rounded-[34px] bg-gradient-to-br from-orange-500 to-brand-orange p-5 text-white shadow-retail">
        <div className="flex items-center gap-3">
          <div className="rounded-3xl bg-white/18 p-3"><CreditCard size={28} /></div>
          <div>
            <p className="text-sm text-white/75">目前購物金餘額</p>
            <h1 className="text-4xl font-black">${state.wallet.shoppingCredit.toLocaleString()}</h1>
          </div>
        </div>
        <p className="mt-4 rounded-2xl bg-white/14 p-3 text-sm font-bold text-white/85">
          結帳時可自行決定是否使用，系統會保留每次折抵明細。
        </p>
      </section>

      <Card>
        <h2 className="mb-3 text-lg font-black">異動紀錄</h2>
        <div className="space-y-3">
          {state.shoppingCreditRecords.length === 0 && <EmptyState title="尚無購物金紀錄" body="點數兌換、儲值贈送或付款折抵後會出現在這裡。" />}
          {state.shoppingCreditRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
              <div className="flex min-w-0 gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${record.amount >= 0 ? 'bg-brand-light text-brand-green' : 'bg-orange-50 text-orange-600'}`}>
                  {record.amount >= 0 ? <TrendingUp size={21} /> : <TrendingDown size={21} />}
                </div>
                <div className="min-w-0">
                  <p className="font-black">{record.title}</p>
                  <p className="text-xs text-slate-500">{record.date} {record.time ?? ''}｜{record.detail}</p>
                </div>
              </div>
              <p className={`shrink-0 font-black ${record.amount >= 0 ? 'text-brand-green' : 'text-slate-900'}`}>
                {record.amount >= 0 ? '+' : '-'}${Math.abs(record.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
