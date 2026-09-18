import dayjs from 'dayjs';
import type { AuditLog, EvidenceRecord } from '../types';
import { Card } from './ui/Card';
import { HashDisplay } from './HashDisplay';

export function EvidenceTimeline({ evidence, audits }: { evidence: EvidenceRecord[]; audits: AuditLog[] }) {
  return (
    <div className="space-y-3">
      {audits.map((event) => (
        <Card key={event.id}>
          <p className="font-bold">{event.action} ✓</p>
          <p className="text-sm text-slate-600">{dayjs(event.createdAt).format('DD MMM YYYY · hh:mm A')}</p>
        </Card>
      ))}
      {evidence.map((item) => (
        <Card key={item.id}>
          <p className="font-bold uppercase">{item.evidenceType.replace('_', ' ')}</p>
          <p className="text-sm text-slate-600">{dayjs(item.capturedAt).format('DD MMM YYYY · hh:mm A')}</p>
          <HashDisplay hash={item.sha256Hash} />
        </Card>
      ))}
    </div>
  );
}
