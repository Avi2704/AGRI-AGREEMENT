import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import type { Agreement } from '../types';
import { StatusBadge } from './StatusBadge';
import { Card } from './ui/Card';

export function AgreementCard({ agreement }: { agreement: Agreement }) {
  return (
    <Link to={`/agreements/${agreement.id}`}>
      <Card className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold">{agreement.agreementNumber}</p>
          <StatusBadge status={agreement.status} />
        </div>
        <p className="text-sm text-slate-700">🌾 {agreement.crop}</p>
        <p className="text-sm text-slate-700">📦 {agreement.quantity} {agreement.unit}</p>
        <p className="text-sm text-slate-700">👤 {agreement.otherPartyName}</p>
        <p className="text-xs text-slate-500">{dayjs(agreement.createdAt).format('DD MMM YYYY')}</p>
      </Card>
    </Link>
  );
}
