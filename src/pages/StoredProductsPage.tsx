import { useState } from 'react';
import { Button, Card, Modal, PageHeader, QRBox, SecondaryButton } from '../components/UI';
import { useDemo } from '../store/DemoContext';

export default function StoredProductsPage() {
  const { state, redeemStoredProduct, transferStoredProduct } = useDemo();
  const [redeemId, setRedeemId] = useState<string | null>(null);
  const [giftId, setGiftId] = useState<string | null>(null);
  const [giftDone, setGiftDone] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const product = state.storedProducts.find((item) => item.id === redeemId) ?? state.storedProducts[0];
  const giftProduct = state.storedProducts.find((item) => item.id === giftId) ?? state.storedProducts[0];
  const remaining = product.total - product.redeemed;

  const finishRedeem = () => {
    setLoading(true);
    window.setTimeout(() => {
      redeemStoredProduct(product.id);
      setLoading(false);
      setRedeemId(null);
    }, 700);
  };

  const finishTransfer = () => {
    transferStoredProduct(giftProduct.id, quantity, phone);
    setGiftDone(true);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="我的寄存" subtitle="已購買可分次領取的商品都會集中在這裡。" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['全部', '飲品', '食品', '其他'].map((item, index) => (
          <span key={item} className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${index === 0 ? 'bg-brand-green text-white' : 'bg-white text-slate-500 shadow-soft'}`}>{item}</span>
        ))}
      </div>
      <div className="space-y-3">
        {state.storedProducts.map((item) => {
          const itemRemaining = item.total - item.redeemed;
          const unit = item.unit ?? '份';
          return (
            <Card key={item.id} className="bg-gradient-to-br from-white to-brand-mint">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${item.color ?? 'bg-brand-light text-brand-deep'}`}>{item.category ?? '寄存'}</span>
                  <h2 className="mt-3 text-xl font-black">{item.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">有效期限：{item.expireDate}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-brand-deep shadow-sm">剩 {itemRemaining} {unit}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[24px] bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">已兌換</p><p className="text-3xl font-black">{item.redeemed}</p></div>
                <div className="rounded-[24px] bg-brand-light p-4 shadow-sm"><p className="text-sm text-brand-deep">剩餘</p><p className="text-3xl font-black text-brand-deep">{itemRemaining}</p></div>
              </div>
              <div className="mt-5 flex justify-center gap-1">
                {Array.from({ length: item.total }).map((_, index) => <span key={index} className={`h-3.5 w-3.5 rounded-full ${index < item.redeemed ? 'bg-brand-green' : 'bg-slate-200'}`} />)}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button onClick={() => setRedeemId(item.id)} disabled={itemRemaining <= 0}>兌換 1 {unit}</Button>
                <SecondaryButton onClick={() => { setGiftId(item.id); setQuantity(1); }}>轉贈好友</SecondaryButton>
              </div>
            </Card>
          );
        })}
      </div>
      {state.transactions.filter((tx) => tx.type === 'stored').slice(0, 4).map((tx) => (
        <Card key={tx.id} className="border-slate-100 shadow-none">
          <p className="font-black">{tx.title}</p>
          <p className="text-sm text-slate-500">{tx.date}｜{tx.detail}</p>
        </Card>
      ))}
      {redeemId && (
        <Modal title="兌換 QR Code" onClose={() => setRedeemId(null)}>
          <div className="space-y-4 text-center">
            <QRBox label="寄存核銷碼" />
            <p className="text-sm text-slate-500">請於門市出示此 QR Code 完成兌換。</p>
            <Button loading={loading} onClick={finishRedeem} className="w-full">完成兌換</Button>
          </div>
        </Modal>
      )}
      {giftId && (
        <Modal title="轉贈好友" onClose={() => { setGiftId(null); setGiftDone(false); setPhone(''); }}>
          <div className="space-y-4">
            {giftDone ? (
              <div className="rounded-3xl bg-brand-light p-4 text-center">
                <p className="text-lg font-black text-brand-deep">已產生轉贈邀請</p>
                <p className="mt-2 text-sm text-slate-600">已產生好友領取邀請，可於正式服務串接 LINE 或簡訊通知。</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((item) => (
                    <button key={item} onClick={() => setQuantity(item)} disabled={item > giftProduct.total - giftProduct.redeemed} className={`rounded-2xl px-3 py-3 text-sm font-black ${quantity === item ? 'bg-brand-green text-white' : 'bg-slate-50 text-slate-600'} disabled:text-slate-300`}>{item} {giftProduct.unit ?? '份'}</button>
                  ))}
                </div>
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="輸入好友手機號碼" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-green" />
                <Button disabled={phone.trim().length < 8} onClick={finishTransfer} className="w-full">產生轉贈邀請</Button>
              </>
            )}
            {giftDone && <Button onClick={() => { setGiftId(null); setGiftDone(false); setPhone(''); }} className="w-full">完成</Button>}
          </div>
        </Modal>
      )}
    </div>
  );
}
