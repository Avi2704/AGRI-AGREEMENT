import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';

export function ProfilePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  if (!user) return null;
  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p>{t('field.name')}: {user.name}</p>
        <p>{t('field.phone')}: {user.phone}</p>
        <p>{t('field.role')}: {user.role}</p>
        <p>{t('field.language')}: {user.language}</p>
      </Card>
      <Card>
        <h2 className="text-xl font-bold">{t('profile.how')}</h2>
        <p className="text-slate-700">Agree → Record → Secure → Deliver → Verify.</p>
      </Card>
    </div>
  );
}
