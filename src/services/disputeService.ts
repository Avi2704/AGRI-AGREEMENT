import { nowIso } from '../lib/utils';
import { localStore } from './localStore';
import { agreementService } from './agreementService';
import { auditService } from './auditService';

export const disputeService = {
  create({
    agreementId,
    reportedBy,
    reason,
    description,
    voiceEvidenceId,
    photoEvidenceId,
  }: {
    agreementId: string;
    reportedBy: string;
    reason: string;
    description: string;
    voiceEvidenceId?: string;
    photoEvidenceId?: string;
  }) {
    const rows = localStore.getDisputes();
    rows.unshift({
      id: crypto.randomUUID(),
      agreementId,
      reportedBy,
      reason,
      description,
      status: 'open',
      timestamp: nowIso(),
      voiceEvidenceId,
      photoEvidenceId,
    });
    localStore.setDisputes(rows);
    agreementService.updateStatus(agreementId, 'disputed', reportedBy);
    auditService.log(agreementId, reportedBy, 'Dispute Created', { reason });
  },
  byAgreement(agreementId: string) {
    return localStore.getDisputes().filter((item) => item.agreementId === agreementId);
  },
  all() {
    return localStore.getDisputes();
  },
};
