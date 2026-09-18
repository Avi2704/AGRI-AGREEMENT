import { nowIso } from '../lib/utils';
import { localStore } from './localStore';

export const auditService = {
  log(agreementId: string, actorId: string, action: string, metadata: Record<string, string | number | boolean | null> = {}) {
    const logs = localStore.getAudits();
    logs.push({
      id: crypto.randomUUID(),
      agreementId,
      actorId,
      action,
      metadata,
      createdAt: nowIso(),
    });
    localStore.setAudits(logs);
  },
  listByAgreement(agreementId: string) {
    return localStore.getAudits().filter((log) => log.agreementId === agreementId);
  },
};
