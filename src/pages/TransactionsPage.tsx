import { useState } from 'react';
import { Card, EmptyState, PageHeader } from '../components/UI';
import { useDemo } from '../store/DemoContext';
import type { TransactionType } from '../types';

const filters: { label: string; type: TransactionType | 'all' }[] = [
  { label: '全部', type: 'all' },
  { label: '消費', type: 'purchase' },
  { label: '儲值', type: 'topup' },
  { label: '點數', type: 'points' },
  { label: '優惠券', type: 'coupon' },
  { label: '寄杯', type: 'stored' }
];

export default function TransactionsPage() {
  const { state } = useDemo();
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const txs = state.transactions.filter((tx) => filter === 'all' || tx.type === filter);

  return (
    <div className="space-y-4">
      <PageHeader title="交易明細" subtitle="可依類型篩選並展開查看。" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button key={item.type} onClick={() => setFilter(item.type)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${filter === item.type ? 'bg-brand-green text-white' : 'bg-white text-slate-500'}`}>{item.label}</button>
        ))}
      </div>
      {txs.length === 0 ? <EmptyState title="沒有紀錄" body="目前分類沒有交易。" /> : txs.map((tx) => (
        <button key={tx.id} onClick={() => setExpanded(expanded === tx.id ? null : tx.id)} className="w-full text-left">
          <Card className="transition active:scale-[0.99]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black">{tx.title}</p>
                <p className="text-sm text-slate-500">{tx.date}｜{tx.store}</p>
              </div>
              <div className="text-right">
                {tx.amount !== undefined && <p className={`font-black ${tx.amount > 0 ? 'text-brand-green' : 'text-slate-900'}`}>{tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}</p>}
                {tx.points !== undefined && <p className="text-sm font-bold text-blue-600">{tx.points > 0 ? '+' : ''}{tx.points} 點</p>}
              </div>
            </div>
            {expanded === tx.id && <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">{tx.detail}</p>}
          </Card>
        </button>
      ))}
    </div>
  );
}
