import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2, QrCode } from 'lucide-react';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[18px] bg-white shadow-[0_10px_24px_rgba(7,92,53,0.12)] ring-1 ring-emerald-100">
        <img src="/surewell-logo.jpg" alt="喜互惠 logo" className="h-full w-full object-contain p-1" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-lg font-black tracking-wide text-brand-deep">喜互惠</p>
          <p className="text-[10px] font-bold tracking-[0.16em] text-brand-orange">會員生活圈</p>
        </div>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-[26px] font-black tracking-tight text-brand-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] leading-5 text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[28px] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] ${className}`}>{children}</section>;
}

export function Button({ children, loading, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button {...props} disabled={loading || props.disabled} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[18px] bg-brand-green px-4 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(20,128,71,0.22)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none ${className}`}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[18px] bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition active:scale-[0.98] ${className}`}>
      {children}
    </button>
  );
}

export function Badge({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'orange' | 'red' | 'blue' | 'gray' }) {
  const styles = {
    green: 'bg-brand-light text-brand-deep',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-brand-light text-brand-deep',
    gray: 'bg-slate-100 text-slate-600'
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-black ${styles[tone]}`}>{children}</span>;
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[2px] md:items-center md:p-4">
      <div className="safe-bottom max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-[30px] bg-white p-5 shadow-2xl md:rounded-[30px]">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200 md:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          <button onClick={onClose} className="min-h-10 rounded-full bg-slate-100 px-4 text-sm font-bold text-slate-600">關閉</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function QRBox({ label = 'QR Code' }: { label?: string }) {
  return (
    <div className="mx-auto flex aspect-square w-40 flex-col items-center justify-center rounded-3xl border-2 border-slate-900 bg-white p-3">
      <QrCode size={96} strokeWidth={1.8} />
      <span className="mt-2 text-xs font-bold text-slate-500">{label}</span>
    </div>
  );
}

export function Barcode() {
  const widths = [2, 5, 2, 7, 3, 4, 2, 6, 2, 5, 3, 7, 2, 4, 5, 2, 6, 3, 2, 7, 4, 2];
  return (
    <div className="flex h-14 items-end justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2">
      {widths.map((width, index) => <span key={index} className="mr-1 bg-slate-950" style={{ width, height: 38 + (index % 3) * 4 }} />)}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card className="text-center">
      <p className="font-black text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{body}</p>
    </Card>
  );
}
