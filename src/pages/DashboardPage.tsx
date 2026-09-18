import { Link } from 'react-router-dom';
import { AgreementCard } from '../components/AgreementCard';
import { EmptyState } from '../components/States';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { agreementService } from '../services/agreementService';
import { disputeService } from '../services/disputeService';
import { useAppState } from '../contexts/AppStateContext';

export function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { revision } = useAppState();
  if (!user) return null;
  const agreements = agreementService.forUser(user.id);
  const counts = {
    active: agreements.filter((a) => a.status === 'active').length,
    pending: agreements.filter((a) => a.status === 'waiting_consent').length,
    delivery: agreements.filter((a) => a.status === 'delivery_pending').length,
    completed: agreements.filter((a) => a.status === 'completed').length,
    disputes: disputeService.all().filter((d) => d.reportedBy === user.id).length,
  };

  return (
    <div className="space-y-4" key={revision}>
      <h1 className="text-2xl font-bold">{t('dashboard.hello')}</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Card><p className="text-xs">{t('dashboard.active')}</p><p className="text-2xl font-bold">{counts.active}</p></Card>
        <Card><p className="text-xs">{t('dashboard.pendingConsent')}</p><p className="text-2xl font-bold">{counts.pending}</p></Card>
        <Card><p className="text-xs">{t('dashboard.deliveryPending')}</p><p className="text-2xl font-bold">{counts.delivery}</p></Card>
        <Card><p className="text-xs">{t('dashboard.completed')}</p><p className="text-2xl font-bold">{counts.completed}</p></Card>
        <Card><p className="text-xs">{t('dashboard.disputes')}</p><p className="text-2xl font-bold">{counts.disputes}</p></Card>
      </div>
      <Link to="/agreements/new"><Button>+ {t('action.createAgreement')}</Button></Link>
      <div className="space-y-3">
        {agreements.length ? agreements.slice(0, 5).map((agreement) => <AgreementCard key={agreement.id} agreement={agreement} />) : <EmptyState label="No agreements yet" />}
      </div>
    </div>
  );
}
