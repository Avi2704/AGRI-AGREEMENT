import { nowIso, uid } from '../lib/utils';
import { localStore } from './localStore';
import { auditService } from './auditService';
import { notificationService } from './notificationService';
import type { Agreement, AgreementStatus, DeliveryConfirmation } from '../types';

const statuses: AgreementStatus[] = [
  'draft',
  'waiting_consent',
  'active',
  'delivery_pending',
  'delivered',
  'payment_pending',
  'completed',
  'disputed',
  'cancelled',
];

export const agreementService = {
  all: () => localStore.getAgreements(),
  byId: (id: string) => localStore.getAgreements().find((agreement) => agreement.id === id),
  forUser: (userId: string) =>
    localStore
      .getAgreements()
      .filter((agreement) => agreement.farmerId === userId || agreement.aggregatorId === userId || agreement.createdBy === userId),

  create(input: Omit<Agreement, 'id' | 'agreementNumber' | 'createdAt' | 'updatedAt'>) {
    const agreements = localStore.getAgreements();
    const now = nowIso();
    const row: Agreement = {
      ...input,
      id: crypto.randomUUID(),
      agreementNumber: `AG-${new Date().getFullYear()}-${String(agreements.length + 1).padStart(6, '0')}`,
      createdAt: now,
      updatedAt: now,
    };
    agreements.unshift(row);
    localStore.setAgreements(agreements);
    auditService.log(row.id, input.createdBy, 'Agreement Created', { status: row.status });
    notificationService.notify(row.farmerId, 'Agreement waiting for consent', row.agreementNumber);
    notificationService.notify(row.aggregatorId, 'Agreement waiting for consent', row.agreementNumber);
    return row;
  },

  updateStatus(id: string, status: AgreementStatus, actorId: string) {
    if (!statuses.includes(status)) return;
    const agreements = localStore.getAgreements().map((agreement) =>
      agreement.id === id ? { ...agreement, status, updatedAt: nowIso(), lockedAt: status === 'active' ? nowIso() : agreement.lockedAt } : agreement,
    );
    localStore.setAgreements(agreements);
    auditService.log(id, actorId, 'Agreement Updated', { status });
  },

  amend(id: string, actorId: string, fieldName: keyof Agreement, newValue: string | number) {
    const agreement = this.byId(id);
    if (!agreement || agreement.lockedAt) return null;
    const oldValue = agreement[fieldName];
    const agreements = localStore.getAgreements().map((row) =>
      row.id === id ? { ...row, [fieldName]: newValue, updatedAt: nowIso() } : row,
    );
    localStore.setAgreements(agreements);
    auditService.log(id, actorId, 'Amendment Created', {
      fieldName,
      oldValue: String(oldValue ?? ''),
      newValue: String(newValue),
    });
    return this.byId(id);
  },

  addConfirmation(confirmation: DeliveryConfirmation) {
    const confirmations = localStore.getConfirmations();
    confirmations.push(confirmation);
    localStore.setConfirmations(confirmations);
  },

  listConfirmations: (agreementId: string) =>
    localStore.getConfirmations().filter((confirmation) => confirmation.agreementId === agreementId),

  newEvidenceId: (type: 'AGR' | 'DEL' | 'DIS') => uid(`${type}-EV`),
};
