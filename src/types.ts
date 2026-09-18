export type UserRole = 'farmer' | 'aggregator' | 'admin';

export type AgreementStatus =
  | 'draft'
  | 'waiting_consent'
  | 'active'
  | 'delivery_pending'
  | 'delivered'
  | 'payment_pending'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export type EvidenceType = 'voice_consent' | 'delivery_photo' | 'dispute_voice' | 'dispute_photo';

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  language: string;
  createdAt: string;
}

export interface Agreement {
  id: string;
  agreementNumber: string;
  createdBy: string;
  farmerId: string;
  aggregatorId: string;
  otherPartyName: string;
  crop: string;
  quantity: number;
  unit: string;
  price: number;
  priceBasis: string;
  deliveryDate: string;
  quality?: string;
  paymentMethod?: string;
  status: AgreementStatus;
  lockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceRecord {
  id: string;
  agreementId: string;
  uploadedBy: string;
  evidenceType: EvidenceType;
  storagePath: string;
  sha256Hash: string;
  mimeType: string;
  fileSize: number;
  capturedAt: string;
  uploadedAt: string;
  serverRecordedAt: string;
  localTimestamp: string;
  status: 'captured' | 'secured' | 'queued' | 'failed';
  verificationStatus?: 'verified' | 'mismatch' | 'pending';
}

export interface ConsentRecord {
  id: string;
  agreementId: string;
  userId: string;
  evidenceId: string;
  consentType: 'party_a' | 'party_b';
  consentedAt: string;
}

export interface DeliveryConfirmation {
  id: string;
  agreementId: string;
  userId: string;
  confirmationType: 'delivered' | 'received' | 'payment_made' | 'payment_received';
  confirmedAt: string;
}

export interface Dispute {
  id: string;
  agreementId: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  timestamp: string;
  voiceEvidenceId?: string;
  photoEvidenceId?: string;
}

export interface AuditLog {
  id: string;
  agreementId: string;
  actorId: string;
  action: string;
  metadata: Record<string, string | number | boolean | null>;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}
