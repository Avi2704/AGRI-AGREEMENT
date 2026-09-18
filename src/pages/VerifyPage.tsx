import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HashDisplay } from '../components/HashDisplay';
import { QRCodeCard } from '../components/QRCodeCard';
import { VerificationResult } from '../components/VerificationResult';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useI18n } from '../contexts/I18nContext';
import { agreementService } from '../services/agreementService';
import { evidenceService } from '../services/evidenceService';
import { verificationService } from '../services/verificationService';

export function VerifyPage() {
  const { agreementId = '' } = useParams();
  const { t } = useI18n();
  const agreement = useMemo(
    () => agreementService.all().find((item) => item.agreementNumber === agreementId || item.id === agreementId),
    [agreementId],
  );
  const [results, setResults] = useState<Record<string, boolean>>({});

  if (!agreement) return <Card>Agreement not found</Card>;

  const evidence = evidenceService.byAgreement(agreement.id);
  const publicUrl = `${window.location.origin}/verify/${agreement.agreementNumber}`;

  return (
    <div className="space-y-4">
      <Card className="space-y-2">
        <h1 className="text-2xl font-bold">{t('verify.title')}</h1>
        <p>Agreement ID: {agreement.agreementNumber}</p>
        <p>Status: {agreement.status.toUpperCase()}</p>
        <p>Agreement created: {dayjs(agreement.createdAt).format('DD MMM YYYY')}</p>
      </Card>
      {evidence.map((item) => (
        <Card key={item.id} className="space-y-2">
          <p className="font-bold">{item.evidenceType}</p>
          <p>Captured: {dayjs(item.capturedAt).format('DD MMM YYYY · hh:mm A')}</p>
          <HashDisplay hash={item.sha256Hash} />
          <Button onClick={async () => {
            const result = await verificationService.verifyEvidence(item.id);
            setResults((state) => ({ ...state, [item.id]: result.verified }));
          }}>{t('action.verifyEvidence')}</Button>
          {results[item.id] !== undefined && <VerificationResult verified={results[item.id]} />}
        </Card>
      ))}
      <QRCodeCard url={publicUrl} />
    </div>
  );
}
