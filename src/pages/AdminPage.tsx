import { Card } from '../components/ui/Card';
import { agreementService } from '../services/agreementService';
import { disputeService } from '../services/disputeService';
import { evidenceService } from '../services/evidenceService';
import { verificationService } from '../services/verificationService';

export function AdminPage() {
  const agreements = agreementService.all();
  const disputes = disputeService.all();
  const evidence = evidenceService.all();
  const logs = verificationService.listLogs();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Card><p>Total Agreements</p><p className="text-2xl font-bold">{agreements.length}</p></Card>
      <Card><p>Active Agreements</p><p className="text-2xl font-bold">{agreements.filter((a) => a.status === 'active').length}</p></Card>
      <Card><p>Completed Agreements</p><p className="text-2xl font-bold">{agreements.filter((a) => a.status === 'completed').length}</p></Card>
      <Card><p>Disputes</p><p className="text-2xl font-bold">{disputes.length}</p></Card>
      <Card><p>Evidence Records</p><p className="text-2xl font-bold">{evidence.length}</p></Card>
      <Card><p>Verification Attempts</p><p className="text-2xl font-bold">{logs.length}</p></Card>
    </div>
  );
}
