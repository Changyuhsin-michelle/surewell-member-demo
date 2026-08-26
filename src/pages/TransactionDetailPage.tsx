import { Navigate, useParams } from 'react-router-dom';
import { Card, PageHeader } from '../components/UI';
import { useDemo } from '../store/DemoContext';

export default function TransactionDetailPage() {
  const { id } = useParams();
  const { state } = useDemo();
  const tx = state.transactions.find((item) => item.id === id);

  if (!tx) return <Navigate to="/transactions" replace />;

  const finalAmount = Math.abs(tx.amount ?? tx.originalAmount ?? 0);

  return (
    <div className="space-y-4">
      <PageHeader title="交易詳細" subtitle="查看門市、付款、優惠與點數紀錄。" />
      <section className="rounded-[34px] bg-gradient-to-br from-brand-deep to-brand-green p-5 text-white shadow-retail">
        <p className="text-sm text-white/70">{tx.date} {tx.time ?? ''}</p>
        <h1 className="mt-1 text-2xl font-black">{tx.title}</h1>
        {tx.amount !== undefined && <p className="mt-3 text-4xl font-black">{tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}</p>}
        <p className="mt-2 text-sm text-white/75">{tx.status ?? '處理完成'}</p>
      </section>

      <Card>
        <h2 className="mb-3 text-lg font-black">交易資訊</h2>
        <div className="space-y-3 text-sm leading-6 text-slate-600">
          <p><span className="font-black text-slate-900">門市：</span>{tx.store}</p>
          <p><span className="font-black text-slate-900">交易時間：</span>{tx.date} {tx.time ?? '—'}</p>
          <p><span className="font-black text-slate-900">發票編號：</span>{tx.invoiceNo ?? '—'}</p>
          <p><span className="font-black text-slate-900">付款方式：</span>{tx.paymentMethod ?? '—'}</p>
          <p><span className="font-black text-slate-900">交易狀態：</span>{tx.status ?? '處理完成'}</p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-black">金額與回饋</h2>
        <div className="space-y-3 text-sm leading-6 text-slate-600">
          <p><span className="font-black text-slate-900">原始金額：</span>{tx.originalAmount ? `$${tx.originalAmount.toLocaleString()}` : '—'}</p>
          <p><span className="font-black text-slate-900">折扣：</span>{tx.discount ? `$${tx.discount.toLocaleString()}` : '—'}</p>
          <p><span className="font-black text-slate-900">優惠券：</span>{tx.couponUsed ?? '—'}</p>
          <p><span className="font-black text-slate-900">點數：</span>{tx.points !== undefined ? `${tx.points > 0 ? '+' : ''}${tx.points} 點` : '—'}</p>
          <p><span className="font-black text-slate-900">最終付款：</span>{finalAmount ? `$${finalAmount.toLocaleString()}` : '—'}</p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 text-lg font-black">交易內容</h2>
        <p className="text-sm leading-7 text-slate-600">{tx.detail}</p>
      </Card>
    </div>
  );
}
