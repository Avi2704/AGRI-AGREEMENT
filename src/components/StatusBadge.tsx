import { cn } from '../lib/utils';
import type { AgreementStatus } from '../types';
import { useI18n } from '../contexts/I18nContext';

const statusClass: Record<AgreementStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  waiting_consent: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  delivery_pending: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-sky-100 text-sky-700',
  payment_pending: 'bg-fuchsia-100 text-fuchsia-700',
  completed: 'bg-green-100 text-green-700',
  disputed: 'bg-rose-100 text-rose-700',
  cancelled: 'bg-zinc-200 text-zinc-700',
};

export function StatusBadge({ status }: { status: AgreementStatus }) {
  const { t } = useI18n();
  return <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', statusClass[status])}>{t(`status.${status}`)}</span>;
}
