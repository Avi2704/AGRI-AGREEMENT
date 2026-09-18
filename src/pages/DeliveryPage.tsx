import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { HashDisplay } from '../components/HashDisplay';
import { PhotoCapture } from '../components/PhotoCapture';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useAppState } from '../contexts/AppStateContext';
import { agreementService } from '../services/agreementService';
import { evidenceService } from '../services/evidenceService';

export function DeliveryPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { refresh } = useAppState();
  const [recordId, setRecordId] = useState('');
  const [hash, setHash] = useState('');
  if (!user) return null;

  return (
    <div className="space-y-4">
      <PhotoCapture onCaptured={async (file) => {
        const record = await evidenceService.capture({ agreementId: id, uploadedBy: user.id, evidenceType: 'delivery_photo', file });
        setRecordId(record.id);
        setHash(record.sha256Hash);
        agreementService.updateStatus(id, 'delivery_pending', user.id);
        refresh();
      }} />
      <Card className="space-y-2">
        <Button onClick={() => {
          agreementService.addConfirmation({ id: crypto.randomUUID(), agreementId: id, userId: user.id, confirmationType: user.role === 'farmer' ? 'delivered' : 'received', confirmedAt: new Date().toISOString() });
          const confirmations = agreementService.listConfirmations(id);
          const agreement = agreementService.byId(id);
          if (!agreement) return;
          const farmerConfirmed = confirmations.some((c) => c.userId === agreement.farmerId);
          const aggregatorConfirmed = confirmations.some((c) => c.userId === agreement.aggregatorId);
          if (farmerConfirmed && aggregatorConfirmed) agreementService.updateStatus(id, 'delivered', user.id);
          refresh();
        }}>{user.role === 'farmer' ? 'I confirm that the goods were delivered.' : 'I confirm that the goods were received.'}</Button>
        <Button className="bg-fuchsia-700" onClick={() => {
          agreementService.addConfirmation({ id: crypto.randomUUID(), agreementId: id, userId: user.id, confirmationType: user.role === 'farmer' ? 'payment_received' : 'payment_made', confirmedAt: new Date().toISOString() });
          agreementService.updateStatus(id, 'completed', user.id);
          refresh();
        }}>{user.role === 'farmer' ? 'Payment Received' : 'Payment Made'}</Button>
      </Card>
      {recordId && <Card><p className="font-bold">Delivery Evidence ID: {recordId}</p><HashDisplay hash={hash} /></Card>}
    </div>
  );
}
