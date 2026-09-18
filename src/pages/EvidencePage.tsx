import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { HashDisplay } from '../components/HashDisplay';
import { VerificationResult } from '../components/VerificationResult';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { evidenceService } from '../services/evidenceService';
import { verificationService } from '../services/verificationService';
import { useState } from 'react';

export function EvidencePage() {
  const { id = '' } = useParams();
  const [verified, setVerified] = useState<boolean | null>(null);
  const evidence = evidenceService.byId(id);
  if (!evidence) return <Card>Evidence not found</Card>;

  return (
    <Card className="space-y-2">
      <h1 className="text-xl font-bold">Evidence Details</h1>
      <p>ID: {evidence.id}</p>
      <p>Agreement: {evidence.agreementId}</p>
      <p>Type: {evidence.evidenceType}</p>
      <p>Captured At: {dayjs(evidence.capturedAt).format('DD MMM YYYY hh:mm A')}</p>
      <p>Uploaded At: {dayjs(evidence.uploadedAt).format('DD MMM YYYY hh:mm A')}</p>
      <p>Server Recorded At: {dayjs(evidence.serverRecordedAt).format('DD MMM YYYY hh:mm A')}</p>
      <p>File Size: {evidence.fileSize}</p>
      <p>MIME Type: {evidence.mimeType}</p>
      <HashDisplay hash={evidence.sha256Hash} />
      <Button onClick={async () => {
        const result = await verificationService.verifyEvidence(id);
        setVerified(result.verified);
      }}>Verify Evidence</Button>
      {verified !== null && <VerificationResult verified={verified} />}
    </Card>
  );
}
