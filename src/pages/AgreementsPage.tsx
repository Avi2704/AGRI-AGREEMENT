import { Link } from 'react-router-dom';
import { AgreementCard } from '../components/AgreementCard';
import { EmptyState } from '../components/States';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { agreementService } from '../services/agreementService';

export function AgreementsPage() {
  const { user } = useAuth();
  if (!user) return null;
  const agreements = agreementService.forUser(user.id);
  return (
    <div className="space-y-4">
      <Link to="/agreements/new"><Button>+ New Agreement</Button></Link>
      {agreements.length ? agreements.map((agreement) => <AgreementCard key={agreement.id} agreement={agreement} />) : <EmptyState label="No agreements found" />}
    </div>
  );
}
