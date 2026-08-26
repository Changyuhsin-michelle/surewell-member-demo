import { useState } from 'react';
import { Button, Card, Modal, PageHeader, QRBox, SecondaryButton } from '../components/UI';
import { useDemo } from '../store/DemoContext';

export default function StoredProductsPage() {
  const { state, redeemStoredProduct } = useDemo();
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftDone, setGiftDone] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const product = state.storedProducts[0];
  const remaining = product.total - product.redeemed;

  const finishRedeem = () => {
    setLoading(true);
    window.setTimeout(() => {
      redeemStoredProduct(product.id);
      setLoading(false);
      setRedeemOpen(false);
    }, 700);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="寄杯 / 寄商品" subtitle="可分次領取，也可保留未來擴充轉贈。" />
      <Card className="border-emerald-100 bg-gradient-to-br from-white to-brand-mint">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black">{product.name}</h2>
            <p className="mt-1 text-sm text-slate-500">有效期限：{product.expireDate}</p>
          </div>
          <span className="rounded-full bg-brand-light px-3 py-1 text-sm font-black text-brand-deep shadow-sm">剩 {remaining} 杯</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[24px] bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">已兌換</p><p className="text-3xl font-black">{product.redeemed}</p></div>
          <div className="rounded-[24px] bg-brand-light p-4 shadow-sm"><p className="text-sm text-brand-deep">剩餘</p><p className="text-3xl font-black text-brand-deep">{remaining}</p></div>
        </div>
        <div className="mt-5 flex justify-center gap-1">
          {Array.from({ length: product.total }).map((_, index) => <span key={index} className={`h-4 w-4 rounded-full ${index < product.redeemed ? 'bg-brand-green' : 'bg-slate-200'}`} />)}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button onClick={() => setRedeemOpen(true)} disabled={remaining <= 0}>兌換 1 杯</Button>
          <SecondaryButton onClick={() => setGiftOpen(true)}>轉贈好友</SecondaryButton>
        </div>
      </Card>
      {state.transactions.filter((tx) => tx.type === 'stored').slice(0, 4).map((tx) => (
        <Card key={tx.id} className="border-slate-100 shadow-none">
          <p className="font-black">{tx.title}</p>
          <p className="text-sm text-slate-500">{tx.date}｜{tx.detail}</p>
        </Card>
      ))}
      {redeemOpen && (
        <Modal title="兌換 QR Code" onClose={() => setRedeemOpen(false)}>
          <div className="space-y-4 text-center">
            <QRBox label="寄杯核銷碼" />
            <p className="text-sm text-slate-500">請於門市出示此 QR Code 完成兌換。</p>
            <Button loading={loading} onClick={finishRedeem} className="w-full">完成兌換</Button>
          </div>
        </Modal>
      )}
      {giftOpen && (
        <Modal title="轉贈好友 Demo" onClose={() => setGiftOpen(false)}>
          <div className="space-y-4">
            {giftDone ? (
              <div className="rounded-3xl bg-brand-light p-4 text-center">
                <p className="text-lg font-black text-brand-deep">已產生轉贈邀請</p>
                <p className="mt-2 text-sm text-slate-600">Demo 不會真的傳送簡訊，正式版可串 LINE 或簡訊通知。</p>
              </div>
            ) : (
              <>
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="輸入好友手機號碼" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-green" />
                <Button disabled={phone.trim().length < 8} onClick={() => setGiftDone(true)} className="w-full">產生轉贈邀請</Button>
              </>
            )}
            {giftDone && <Button onClick={() => { setGiftOpen(false); setGiftDone(false); setPhone(''); }} className="w-full">完成</Button>}
          </div>
        </Modal>
      )}
    </div>
  );
}
