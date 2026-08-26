import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, EmptyState, PageHeader } from '../components/UI';
import { useDemo } from '../store/DemoContext';
import type { TransactionType } from '../types';

const filters: { label: string; type: TransactionType | 'all' }[] = [
  { label: '全部', type: 'all' },
  { label: '消費', type: 'purchase' },
  { label: '儲值', type: 'topup' },
  { label: '付款', type: 'payment' },
  { label: '點數', type: 'points' },
  { label: '優惠券', type: 'coupon' },
  { label: '寄存', type: 'stored' }
];

export default function TransactionsPage() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const txs = state.transactions.filter((tx) => filter === 'all' || tx.type === filter);

  return (
    <div className="space-y-4">
      <PageHeader title="交易明細" subtitle="可依類型篩選並展開查看。" />
      <div className="flex min-h-11 items-center gap-2 rounded-[18px] bg-white px-3 text-slate-400 shadow-soft">
        <Search size={18} />
        <span className="text-sm font-bold">搜尋門市、金額或交易內容</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button key={item.type} onClick={() => setFilter(item.type)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${filter === item.type ? 'bg-brand-green text-white' : 'bg-white text-slate-500'}`}>{item.label}</button>
        ))}
      </div>
      {txs.length === 0 ? <EmptyState title="沒有紀錄" body="目前分類沒有交易。" /> : txs.map((tx) => (
        <button key={tx.id} onClick={() => setExpanded(expanded === tx.id ? null : tx.id)} onDoubleClick={() => navigate(`/transactions/${tx.id}`)} className="w-full text-left">
          <Card className="transition active:scale-[0.99]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand-green">
                  {tx.type === 'purchase' ? '購' : tx.type === 'topup' ? '儲' : tx.type === 'payment' ? '付' : tx.type === 'coupon' ? '券' : tx.type === 'stored' ? '寄' : '點'}
                </div>
                <div className="min-w-0">
                <p className="font-black">{tx.title}</p>
                <p className="text-sm text-slate-500">{tx.date}｜{tx.store}</p>
                </div>
              </div>
              <div className="text-right">
                {tx.amount !== undefined && <p className={`font-black ${tx.amount > 0 ? 'text-brand-green' : 'text-slate-900'}`}>{tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}</p>}
                {tx.points !== undefined && <p className="text-sm font-bold text-brand-green">{tx.points > 0 ? '+' : ''}{tx.points} 點</p>}
              </div>
            </div>
            {expanded === tx.id && (
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                <p>{tx.detail}</p>
                <button onClick={(event) => { event.stopPropagation(); navigate(`/transactions/${tx.id}`); }} className="mt-2 font-black text-brand-green">查看詳細</button>
              </div>
            )}
          </Card>
        </button>
      ))}
    </div>
  );
}
