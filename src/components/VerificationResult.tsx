import { useI18n } from '../contexts/I18nContext';

export function VerificationResult({ verified }: { verified: boolean }) {
  const { t } = useI18n();
  return (
    <div className={`rounded-xl p-3 ${verified ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}`}>
      <p className="text-lg font-bold">{verified ? `✓ ${t('verify.verified')}` : `✕ ${t('verify.mismatch')}`}</p>
      <p className="text-sm">{verified ? t('verify.matchDesc') : t('verify.mismatchDesc')}</p>
    </div>
  );
}
