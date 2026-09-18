import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { useAppState } from '../contexts/AppStateContext';
import { agreementService } from '../services/agreementService';

const crops = ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Tomato', 'Onion', 'Potato', 'Other'];
const units = ['kg', 'quintal', 'tonne', 'litre', 'crate', 'Other'];
const priceBasis = ['Per kg', 'Per quintal', 'Per tonne', 'Total amount'];
const payments = ['Cash', 'Bank transfer', 'UPI', 'Other'];

export function NewAgreementPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { refresh } = useAppState();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [partyRole, setPartyRole] = useState<'farmer' | 'aggregator'>('farmer');
  const [form, setForm] = useState({
    otherPartyName: '', crop: 'Soybean', quantity: 50, unit: 'quintal', price: 5200, priceBasis: 'Per quintal',
    deliveryDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10), quality: '', paymentMethod: 'UPI'
  });

  if (!user) return null;

  const summary = (
    <Card className="space-y-2">
      <h2 className="text-2xl font-extrabold">{t('agreement.summary')}</h2>
      <p>🌾 {form.crop}</p>
      <p>📦 {form.quantity} {form.unit}</p>
      <p>₹ ₹{form.price} / {form.priceBasis}</p>
      <p>📅 {form.deliveryDate}</p>
      <p>💰 {form.paymentMethod}</p>
      <p>👤 {form.otherPartyName || 'Other party'}</p>
      <p className="font-bold">{t('agreement.isCorrect')}</p>
      <div className="flex gap-2">
        <Button onClick={() => {
          const agreement = agreementService.create({
            createdBy: user.id,
            farmerId: partyRole === 'farmer' ? user.id : 'demo-farmer-1',
            aggregatorId: partyRole === 'aggregator' ? user.id : 'demo-agg-1',
            status: 'waiting_consent',
            lockedAt: undefined,
            ...form,
            deliveryDate: new Date(form.deliveryDate).toISOString(),
          });
          refresh();
          navigate(`/agreements/${agreement.id}/consent`);
        }}>{t('action.yesContinue')}</Button>
        <Button className="bg-slate-700" onClick={() => setStep(2)}>{t('action.changeDetails')}</Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      {step === 1 && (
        <Card className="space-y-3">
          <h2 className="text-2xl font-bold">Who is the agreement with?</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button className={`min-h-20 rounded-2xl border p-4 text-left ${partyRole === 'farmer' ? 'border-green-600' : ''}`} onClick={() => setPartyRole('farmer')}>Farmer</button>
            <button className={`min-h-20 rounded-2xl border p-4 text-left ${partyRole === 'aggregator' ? 'border-green-600' : ''}`} onClick={() => setPartyRole('aggregator')}>Aggregator / Buyer</button>
          </div>
          <Button onClick={() => setStep(2)}>{t('action.continue')}</Button>
        </Card>
      )}
      {step === 2 && (
        <Card className="grid gap-3">
          <h2 className="text-2xl font-bold">What are you agreeing about?</h2>
          <input className="min-h-11 rounded-lg border px-3" placeholder={t('field.otherParty')} value={form.otherPartyName} onChange={(e) => setForm({ ...form, otherPartyName: e.target.value })} />
          <select className="min-h-11 rounded-lg border px-3" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>{crops.map((crop) => <option key={crop}>{crop}</option>)}</select>
          <input type="number" className="min-h-11 rounded-lg border px-3" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
          <select className="min-h-11 rounded-lg border px-3" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select>
          <input type="number" className="min-h-11 rounded-lg border px-3" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <select className="min-h-11 rounded-lg border px-3" value={form.priceBasis} onChange={(e) => setForm({ ...form, priceBasis: e.target.value })}>{priceBasis.map((item) => <option key={item}>{item}</option>)}</select>
          <input type="date" className="min-h-11 rounded-lg border px-3" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
          <input className="min-h-11 rounded-lg border px-3" placeholder={t('field.quality')} value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} />
          <select className="min-h-11 rounded-lg border px-3" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>{payments.map((pay) => <option key={pay}>{pay}</option>)}</select>
          <Button onClick={() => setStep(3)}>{t('action.continue')}</Button>
        </Card>
      )}
      {step === 3 && summary}
    </div>
  );
}
