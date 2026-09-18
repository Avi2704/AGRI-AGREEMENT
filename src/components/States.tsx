import { Card } from './ui/Card';

export function LoadingState({ label }: { label: string }) {
  return <Card className="animate-pulse text-slate-500">{label}</Card>;
}

export function ErrorState({ label }: { label: string }) {
  return <Card className="border-rose-200 bg-rose-50 text-rose-700">{label}</Card>;
}

export function EmptyState({ label }: { label: string }) {
  return <Card className="text-center text-slate-500">{label}</Card>;
}
