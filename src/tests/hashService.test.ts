import { describe, expect, it } from 'vitest';
import { sha256FromBlob, sha256FromText } from '../services/hashService';

describe('hashService', () => {
  it('returns deterministic SHA-256 for text', async () => {
    const input = 'Hello Agri Agreement';
    const first = await sha256FromText(input);
    const second = await sha256FromText(input);
    expect(first).toBe(second);
  });

  it('returns different hash for different text', async () => {
    const first = await sha256FromText('Hello Agri Agreement');
    const second = await sha256FromText('Hello Agri Agreement!');
    expect(first).not.toBe(second);
  });

  it('hashes original blob bytes', async () => {
    const blob = new Blob(['voice evidence'], { type: 'text/plain' });
    const a = await sha256FromBlob(blob);
    const b = await sha256FromBlob(blob);
    expect(a).toBe(b);
  });
});
