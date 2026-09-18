import { nowIso } from '../lib/utils';
import { agreementService } from './agreementService';
import { auditService } from './auditService';
import {
  addOfflineQueueItem,
  deleteOfflineQueueItem,
  listOfflineQueueItems,
  localStore,
  readEvidenceFile,
  saveEvidenceFile,
} from './localStore';
import { notificationService } from './notificationService';
import { sha256FromBlob } from './hashService';
import type { ConsentRecord, EvidenceRecord, EvidenceType } from '../types';

export const evidenceService = {
  all: () => localStore.getEvidence(),
  byAgreement: (agreementId: string) => localStore.getEvidence().filter((e) => e.agreementId === agreementId),
  byId: (id: string) => localStore.getEvidence().find((e) => e.id === id),

  async capture({
    agreementId,
    uploadedBy,
    evidenceType,
    file,
    capturedAt,
  }: {
    agreementId: string;
    uploadedBy: string;
    evidenceType: EvidenceType;
    file: Blob;
    capturedAt?: string;
  }) {
    const now = nowIso();
    const id = agreementService.newEvidenceId(evidenceType === 'delivery_photo' ? 'DEL' : evidenceType.startsWith('dispute') ? 'DIS' : 'AGR');
    const path = `${agreementId}/${id}`;
    const hash = await sha256FromBlob(file);

    const record: EvidenceRecord = {
      id,
      agreementId,
      uploadedBy,
      evidenceType,
      storagePath: path,
      sha256Hash: hash,
      mimeType: file.type || 'application/octet-stream',
      fileSize: file.size,
      capturedAt: capturedAt ?? now,
      localTimestamp: new Date().toString(),
      uploadedAt: now,
      serverRecordedAt: now,
      status: navigator.onLine ? 'secured' : 'queued',
      verificationStatus: 'pending',
    };

    const evidence = localStore.getEvidence();
    evidence.unshift(record);
    localStore.setEvidence(evidence);
    await saveEvidenceFile(path, file);

    if (!navigator.onLine) {
      await addOfflineQueueItem({ id: crypto.randomUUID(), evidenceId: id, file, capturedAt: record.capturedAt });
    }

    auditService.log(agreementId, uploadedBy, 'Evidence Captured', { evidenceId: id, evidenceType });
    return record;
  },

  async file(record: EvidenceRecord) {
    return readEvidenceFile(record.storagePath);
  },

  addConsent(record: ConsentRecord) {
    const consents = localStore.getConsents();
    consents.push(record);
    localStore.setConsents(consents);
    auditService.log(record.agreementId, record.userId, 'Consent Recorded', { evidenceId: record.evidenceId });

    const agreement = agreementService.byId(record.agreementId);
    if (!agreement) return;
    const related = consents.filter((item) => item.agreementId === record.agreementId);
    const farmerDone = related.some((item) => item.userId === agreement.farmerId);
    const aggregatorDone = related.some((item) => item.userId === agreement.aggregatorId);

    if (farmerDone && aggregatorDone) {
      agreementService.updateStatus(record.agreementId, 'active', record.userId);
      notificationService.notify(agreement.farmerId, 'Agreement activated', agreement.agreementNumber);
      notificationService.notify(agreement.aggregatorId, 'Agreement activated', agreement.agreementNumber);
      auditService.log(record.agreementId, record.userId, 'Agreement Locked', {});
    } else {
      agreementService.updateStatus(record.agreementId, 'waiting_consent', record.userId);
    }
  },

  consentsByAgreement: (agreementId: string) => localStore.getConsents().filter((item) => item.agreementId === agreementId),

  async retryOfflineUploads() {
    if (!navigator.onLine) return;
    const items = await listOfflineQueueItems();
    const evidence = localStore.getEvidence();
    for (const item of items) {
      const index = evidence.findIndex((e) => e.id === item.evidenceId);
      if (index >= 0) {
        evidence[index] = { ...evidence[index], status: 'secured', uploadedAt: nowIso(), serverRecordedAt: nowIso() };
      }
      await deleteOfflineQueueItem(item.id);
    }
    localStore.setEvidence(evidence);
  },
};
