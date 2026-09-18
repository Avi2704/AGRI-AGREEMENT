import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { SecurityPanel } from '../components/SecurityPanel';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-3xl font-extrabold leading-tight">{t('landing.hero')}</p>
        <p className="text-slate-600">{t('landing.subheading')}</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/agreements/new"><Button>{t('action.createAgreement')}</Button></Link>
          <Link to="/verify/AG-2026-000123"><Button className="bg-slate-700 hover:bg-slate-800">{t('action.verifyAgreement')}</Button></Link>
          <Link to="/demo"><Button className="bg-amber-700 hover:bg-amber-800">{t('action.tryDemo')}</Button></Link>
        </div>
      </section>
      <Card>
        <h2 className="text-xl font-bold">{t('landing.howItWorks')}</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-700">
          <li>Agree</li><li>Record</li><li>Secure</li><li>Deliver</li><li>Verify</li>
        </ol>
      </Card>
      <Card>
        <h2 className="text-xl font-bold">{t('landing.why')}</h2>
        <p className="mt-2 text-slate-700">Agricultural price, quantity, delivery, and payment disputes often start with missing records.</p>
      </Card>
      <SecurityPanel />
    </div>
  );
}
