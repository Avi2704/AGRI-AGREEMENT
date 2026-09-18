import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import type { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [otp, setOtp] = useState('123456');
  const [error, setError] = useState('');

  return (
    <Card className="mx-auto max-w-md space-y-3">
      <h1 className="text-2xl font-bold">{t('action.login')}</h1>
      <input aria-label={t('field.name')} className="min-h-11 w-full rounded-lg border px-3" placeholder={t('field.name')} value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label={t('field.phone')} className="min-h-11 w-full rounded-lg border px-3" placeholder={t('field.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} />
      <select aria-label={t('field.role')} className="min-h-11 w-full rounded-lg border px-3" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
        <option value="farmer">Farmer</option>
        <option value="aggregator">Aggregator / Buyer</option>
        <option value="admin">Admin</option>
      </select>
      <input aria-label="OTP" className="min-h-11 w-full rounded-lg border px-3" placeholder="OTP (123456)" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <Button onClick={async () => {
        try {
          await login({ phone, otp, role, name: name || 'User' });
          navigate('/dashboard');
        } catch {
          setError('Invalid OTP');
        }
      }}>{t('action.login')}</Button>
      {error && <p className="text-rose-700">{error}</p>}
    </Card>
  );
}
