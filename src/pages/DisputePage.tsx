import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useAppState } from '../contexts/AppStateContext';
import { disputeService } from '../services/disputeService';
import { evidenceService } from '../services/evidenceService';

const reasons = ['Price disagreement', 'Quantity disagreement', 'Delivery disagreement', 'Quality disagreement', 'Payment disagreement', 'Other'];

export function DisputePage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { refresh } = useAppState();
  const navigate = useNavigate();
  const [reason, setReason] = useState(reasons[0]);
  const [description, setDescription] = useState('');
  const [voiceEvidenceId, setVoiceEvidenceId] = useState<string | undefined>();
  const [photoEvidenceId, setPhotoEvidenceId] = useState<string | undefined>();
  if (!user) return null;

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <h2 className="text-xl font-bold">Report a Dispute</h2>
        <select className="min-h-11 rounded-lg border px-3" value={reason} onChange={(e) => setReason(e.target.value)}>{reasons.map((item) => <option key={item}>{item}</option>)}</select>
        <textarea className="min-h-24 rounded-lg border p-3" placeholder="Describe the issue" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Card>
      <VoiceRecorder onRecorded={async (blob) => {
        const evidence = await evidenceService.capture({ agreementId: id, uploadedBy: user.id, evidenceType: 'dispute_voice', file: blob });
        setVoiceEvidenceId(evidence.id);
      }} />
      <Card>
        <input
          aria-label="Dispute photo"
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const evidence = await evidenceService.capture({ agreementId: id, uploadedBy: user.id, evidenceType: 'dispute_photo', file });
            setPhotoEvidenceId(evidence.id);
          }}
        />
      </Card>
      <Button onClick={() => {
        disputeService.create({ agreementId: id, reportedBy: user.id, reason, description, voiceEvidenceId, photoEvidenceId });
        refresh();
        navigate(`/agreements/${id}`);
      }}>Submit Dispute</Button>
    </div>
  );
}
