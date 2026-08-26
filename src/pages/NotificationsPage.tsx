import { Bell } from 'lucide-react';
import { useState } from 'react';
import { Button, Card, EmptyState, Modal, PageHeader } from '../components/UI';
import { useDemo } from '../store/DemoContext';
import type { NotificationItem } from '../types';

export default function NotificationsPage() {
  const { state, unreadCount, markNotificationRead, markAllNotificationsRead } = useDemo();
  const [selected, setSelected] = useState<NotificationItem | null>(null);

  const openNotification = (item: NotificationItem) => {
    markNotificationRead(item.id);
    setSelected({ ...item, read: true });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="通知中心"
        subtitle={`${unreadCount} 則未讀通知`}
        action={<Button onClick={markAllNotificationsRead} className="px-3 py-2 text-xs">全部已讀</Button>}
      />
      {state.notifications.length === 0 ? <EmptyState title="沒有通知" body="有新的會員提醒會顯示在這裡。" /> : state.notifications.map((item) => (
        <button key={item.id} onClick={() => openNotification(item)} className="w-full text-left">
          <Card className={`transition active:scale-[0.99] ${!item.read ? 'border-brand-green bg-brand-light shadow-retail' : ''}`}>
            <div className="flex gap-3">
              <div className={`rounded-2xl p-3 ${item.read ? 'bg-slate-100 text-slate-500' : 'bg-white text-brand-green shadow-sm'}`}><Bell size={22} /></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-black">{item.title}</p>
                  {!item.read && <span className="h-2.5 w-2.5 rounded-full bg-red-500" />}
                </div>
                <p className="mt-1 text-sm leading-5 text-slate-600">{item.body}</p>
                <p className="mt-2 text-xs text-slate-400">{item.date}</p>
              </div>
            </div>
          </Card>
        </button>
      ))}
      {selected && (
        <Modal title="通知內容" onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div className="rounded-3xl bg-brand-light p-4">
              <p className="text-xs font-bold text-brand-deep">{selected.date}</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">{selected.title}</h2>
              <p className="mt-2 leading-7 text-slate-700">{selected.body}</p>
            </div>
            <Button onClick={() => setSelected(null)} className="w-full">我知道了</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
