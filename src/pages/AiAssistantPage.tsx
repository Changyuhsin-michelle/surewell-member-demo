import { useState } from 'react';
import { Bot, Send } from 'lucide-react';
import { Button, Card, PageHeader } from '../components/UI';
import { useDemo } from '../store/DemoContext';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const quickQuestions = [
  '我還有多少點數？',
  '我的儲值金剩多少？',
  '我有哪些優惠券？',
  '我的咖啡還剩幾杯？',
  '我的點數何時到期？',
  '最近有哪些優惠？',
  '我這個月花了多少錢？'
];

export default function AiAssistantPage() {
  const { askAI } = useDemo();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: '你好，我是喜互惠 AI 小幫手。可以幫你查點數、儲值金、優惠券、寄杯和推薦優惠。' }
  ]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((items) => [...items, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    window.setTimeout(() => {
      setMessages((items) => [...items, { role: 'assistant', text: askAI(text) }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col space-y-4">
      <PageHeader title="喜互惠 AI 小幫手" subtitle="Demo 版使用規則式 mock AI，會讀取目前會員狀態。" />
      <Card className="flex-1 space-y-3 border-emerald-50 bg-white/95 shadow-soft">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[82%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm ${message.role === 'user' ? 'bg-brand-green text-white' : 'bg-brand-light text-slate-700'}`}>
              {message.role === 'assistant' && <Bot size={16} className="mb-1 inline text-brand-green" />} {message.text}
            </div>
          </div>
        ))}
        {loading && <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-500">AI 小幫手查詢中...</div>}
      </Card>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {quickQuestions.map((question) => (
          <button key={question} onClick={() => send(question)} className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-deep shadow-sm ring-1 ring-emerald-50">{question}</button>
        ))}
      </div>
      <div className="flex gap-2 rounded-3xl bg-white p-2 shadow-soft">
        <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send(input)} placeholder="輸入問題..." className="min-w-0 flex-1 rounded-2xl px-3 outline-none" />
        <Button onClick={() => send(input)} className="px-4"><Send size={18} /></Button>
      </div>
    </div>
  );
}
