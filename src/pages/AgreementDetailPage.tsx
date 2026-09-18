import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';
import { EvidenceTimeline } from '../components/EvidenceTimeline';
import { EmptyState } from '../components/States';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useAppState } from '../contexts/AppStateContext';
import { agreementService } from '../services/agreementService';
import { auditService } from '../services/auditService';
import { evidenceService } from '../services/evidenceService';

export function AgreementDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { revision } = useAppState();
  if (!user) return null;
  const agreement = agreementService.byId(id);
  if (!agreement) return <EmptyState label="Agreement not found" />;

  const evidence = evidenceService.byAgreement(id);
  const audits = auditService.listByAgreement(id);
  const verifyUrl = `${window.location.origin}/verify/${agreement.agreementNumber}`;

  return (
    <div className="space-y-4" key={revision}>
      <Card className="space-y-2">
        <div className="flex items-center justify-between"><h1 className="text-xl font-bold">{agreement.agreementNumber}</h1><StatusBadge status={agreement.status} /></div>
        <p>🌾 {agreement.crop}</p><p>📦 {agreement.quantity} {agreement.unit}</p><p>₹ {agreement.price} / {agreement.priceBasis}</p>
        <p>📅 {dayjs(agreement.deliveryDate).format('DD MMM YYYY')}</p><p>👤 {agreement.otherPartyName}</p>
        <p className="text-xs text-slate-500">Created {dayjs(agreement.createdAt).format('DD MMM YYYY hh:mm A')}</p>
      </Card>

      <div className="grid gap-2 sm:grid-cols-2">
        <Link to={`/agreements/${id}/consent`}><Button className="w-full">Record Consent</Button></Link>
        <Link to={`/agreements/${id}/delivery`}><Button className="w-full bg-indigo-700 hover:bg-indigo-800">Delivery Proof</Button></Link>
        <Link to={`/agreements/${id}/dispute`}><Button className="w-full bg-rose-700 hover:bg-rose-800">Report Dispute</Button></Link>
        <Button className="w-full bg-slate-700" onClick={async () => {
          const shareText = verifyUrl;
          if (navigator.share) await navigator.share({ title: agreement.agreementNumber, url: shareText });
          else await navigator.clipboard.writeText(shareText);
        }}>Share Agreement</Button>
      </div>

      <Card>
        <h2 className="text-lg font-bold">Evidence Timeline</h2>
        <EvidenceTimeline evidence={evidence} audits={audits} />
      </Card>
    </div>
  );
}
