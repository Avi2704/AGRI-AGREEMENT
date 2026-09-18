import { shortHash } from '../lib/utils';

export function HashDisplay({ hash }: { hash: string }) {
  return (
    <div className="rounded-lg bg-slate-100 p-2 text-xs">
      <p className="font-semibold">SHA-256</p>
      <p className="break-all font-mono">{shortHash(hash)}</p>
    </div>
  );
}
