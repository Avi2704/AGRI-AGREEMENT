import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { HashDisplay } from '../components/HashDisplay';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useAppState } from '../contexts/AppStateContext';
import { evidenceService } from '../services/evidenceService';

export function ConsentPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { refresh } = useAppState();
  const [evidenceId, setEvidenceId] = useState('');
  const [hash, setHash] = useState('');
  if (!user) return null;

  return (
    <div className="space-y-4">
      <VoiceRecorder
        onRecorded={async (blob) => {
          const record = await evidenceService.capture({ agreementId: id, uploadedBy: user.id, evidenceType: 'voice_consent', file: blob });
          evidenceService.addConsent({
            id: crypto.randomUUID(),
            agreementId: id,
            userId: user.id,
            evidenceId: record.id,
            consentType: 'party_a',
            consentedAt: new Date().toISOString(),
          });
          setEvidenceId(record.id);
          setHash(record.sha256Hash);
          refresh();
        }}
      />
      {evidenceId && (
        <Card className="space-y-2">
          <p className="font-bold">Evidence ID</p>
          <p>{evidenceId}</p>
          <HashDisplay hash={hash} />
        </Card>
      )}
    </div>
  );
}
