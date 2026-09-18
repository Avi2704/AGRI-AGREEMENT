import { nowIso } from '../lib/utils';
import { localStore } from './localStore';
import { sha256FromBlob } from './hashService';
import { evidenceService } from './evidenceService';
import type { EvidenceRecord } from '../types';

export const verificationService = {
  async verifyEvidence(evidenceId: string) {
    const record = evidenceService.byId(evidenceId);
    if (!record) throw new Error('Evidence not found');
    const file = await evidenceService.file(record);
    if (!file) throw new Error('Evidence file missing');

    const calculatedHash = await sha256FromBlob(file);
    const verified = calculatedHash === record.sha256Hash;

    const evidenceRows: EvidenceRecord[] = localStore.getEvidence().map((item) =>
      item.id === evidenceId ? { ...item, verificationStatus: verified ? 'verified' : 'mismatch' } : item,
    );
    localStore.setEvidence(evidenceRows);

    const logs = JSON.parse(localStorage.getItem('agri.verificationLogs') || '[]') as Record<string, string>[];
    logs.unshift({
      id: crypto.randomUUID(),
      agreementId: record.agreementId,
      evidenceId,
      verificationResult: verified ? 'verified' : 'mismatch',
      storedHash: record.sha256Hash,
      calculatedHash,
      verifiedAt: nowIso(),
    });
    localStorage.setItem('agri.verificationLogs', JSON.stringify(logs));

    return { verified, calculatedHash, storedHash: record.sha256Hash };
  },

  listLogs() {
    return JSON.parse(localStorage.getItem('agri.verificationLogs') || '[]') as Record<string, string>[];
  },
};
