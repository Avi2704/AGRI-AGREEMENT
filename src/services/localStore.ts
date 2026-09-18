import { openDB } from 'idb';
import type {
  Agreement,
  AuditLog,
  ConsentRecord,
  DeliveryConfirmation,
  Dispute,
  EvidenceRecord,
  NotificationItem,
  UserProfile,
} from '../types';

const STORAGE_KEYS = {
  users: 'agri.users',
  agreements: 'agri.agreements',
  evidence: 'agri.evidence',
  consents: 'agri.consents',
  confirmations: 'agri.confirmations',
  disputes: 'agri.disputes',
  notifications: 'agri.notifications',
  audits: 'agri.audits',
};

const DB_NAME = 'agri-evidence-db';

export async function db() {
  return openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('evidence_files')) {
        database.createObjectStore('evidence_files');
      }
      if (!database.objectStoreNames.contains('offline_queue')) {
        database.createObjectStore('offline_queue', { keyPath: 'id' });
      }
    },
  });
}

function parse<T>(key: string): T[] {
  const value = localStorage.getItem(key);
  if (!value) return [];
  try {
    return JSON.parse(value) as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const localStore = {
  getUsers: () => parse<UserProfile>(STORAGE_KEYS.users),
  setUsers: (rows: UserProfile[]) => write(STORAGE_KEYS.users, rows),
  getAgreements: () => parse<Agreement>(STORAGE_KEYS.agreements),
  setAgreements: (rows: Agreement[]) => write(STORAGE_KEYS.agreements, rows),
  getEvidence: () => parse<EvidenceRecord>(STORAGE_KEYS.evidence),
  setEvidence: (rows: EvidenceRecord[]) => write(STORAGE_KEYS.evidence, rows),
  getConsents: () => parse<ConsentRecord>(STORAGE_KEYS.consents),
  setConsents: (rows: ConsentRecord[]) => write(STORAGE_KEYS.consents, rows),
  getConfirmations: () => parse<DeliveryConfirmation>(STORAGE_KEYS.confirmations),
  setConfirmations: (rows: DeliveryConfirmation[]) => write(STORAGE_KEYS.confirmations, rows),
  getDisputes: () => parse<Dispute>(STORAGE_KEYS.disputes),
  setDisputes: (rows: Dispute[]) => write(STORAGE_KEYS.disputes, rows),
  getNotifications: () => parse<NotificationItem>(STORAGE_KEYS.notifications),
  setNotifications: (rows: NotificationItem[]) => write(STORAGE_KEYS.notifications, rows),
  getAudits: () => parse<AuditLog>(STORAGE_KEYS.audits),
  setAudits: (rows: AuditLog[]) => write(STORAGE_KEYS.audits, rows),
};

export async function saveEvidenceFile(path: string, file: Blob) {
  const database = await db();
  await database.put('evidence_files', file, path);
}

export async function readEvidenceFile(path: string) {
  const database = await db();
  return (await database.get('evidence_files', path)) as Blob | undefined;
}

export async function addOfflineQueueItem(item: {
  id: string;
  evidenceId: string;
  file: Blob;
  capturedAt: string;
}) {
  const database = await db();
  await database.put('offline_queue', item);
}

export async function listOfflineQueueItems() {
  const database = await db();
  return (await database.getAll('offline_queue')) as {
    id: string;
    evidenceId: string;
    file: Blob;
    capturedAt: string;
  }[];
}

export async function deleteOfflineQueueItem(id: string) {
  const database = await db();
  await database.delete('offline_queue', id);
}
