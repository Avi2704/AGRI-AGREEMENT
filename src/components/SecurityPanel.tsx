import { useI18n } from '../contexts/I18nContext';
import { Card } from './ui/Card';

export function SecurityPanel() {
  const { t } = useI18n();
  return (
    <Card className="space-y-2 bg-green-50">
      <h3 className="text-lg font-bold">{t('security.panelTitle')}</h3>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
        <li>Original file is captured.</li>
        <li>SHA-256 fingerprint is generated immediately.</li>
        <li>Fingerprint is recorded with a timestamp.</li>
        <li>Original evidence is stored securely.</li>
        <li>Verification recalculates the fingerprint.</li>
        <li>Matching fingerprints indicate file consistency.</li>
      </ol>
      <p className="text-xs text-slate-600">{t('security.disclaimer')}</p>
    </Card>
  );
}
