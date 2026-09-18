# Agri Agreement

**Tagline:** _Record the agreement. Prove what happened._

Agri Agreement is a mobile-first MVP for tamper-evident agricultural agreement records using voice consent, delivery evidence, and SHA-256 verification.

## Features

- OTP-simulated login by phone (extensible for real SMS OTP)
- 6-language UI (`en`, `hi`, `mr`, `gu`, `bn`, `ta`) with `/locales/*.json`
- Agreement wizard + summary
- Voice consent capture with MediaRecorder
- Real SHA-256 hashing via Web Crypto API from original Blob bytes
- Two-party consent and agreement activation/lock lifecycle
- Delivery photo evidence capture/upload flow
- Evidence timeline and evidence details
- Public verification page (`/verify/:agreementId`) with re-hashing and mismatch detection
- Share link + QR verification
- Dispute reporting with optional voice/photo evidence
- Demo mode with sample data
- Offline queue for captured evidence using IndexedDB
- Basic admin metrics panel
- Hash service unit tests

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Lucide icons
- Supabase client integration + SQL schema/RLS/seed files
- IndexedDB (`idb`) for offline evidence file queue

## Environment

Create `.env`:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Local Development

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
npm run test
```

## Supabase Setup

1. Create a Supabase project.
2. Run migration from `supabase/migrations/20260918_init_agri_agreement.sql`.
3. Seed demo records with `supabase/seed/seed.sql`.
4. Configure storage bucket (private) for evidence and use signed URLs for access.

## Core Security Model

At evidence capture:

1. Capture original audio/photo Blob
2. Convert Blob to ArrayBuffer
3. Generate SHA-256 immediately (`crypto.subtle.digest`)
4. Record timestamps (`captured_at`, `uploaded_at`, `server_recorded_at`)
5. Store metadata and hash
6. Verification re-hashes original stored file and compares with stored hash

## Important Disclaimer

Agri Agreement provides **tamper-evident digital records** and an evidence trail. It does **not** independently determine legal validity, consent capacity, or truthfulness.
