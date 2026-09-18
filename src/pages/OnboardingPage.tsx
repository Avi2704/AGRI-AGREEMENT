import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function OnboardingPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const slides = [t('onboard.1'), t('onboard.2'), t('onboard.3'), t('onboard.4'), t('onboard.5')];
  const [index, setIndex] = useState(0);

  return (
    <Card className="mx-auto max-w-md space-y-4 text-center">
      <p className="text-2xl font-bold">{slides[index]}</p>
      <div className="flex justify-center gap-2">
        <Button className="bg-slate-700" onClick={() => navigate('/dashboard')}>{t('action.skip')}</Button>
        {index < slides.length - 1 ? <Button onClick={() => setIndex((v) => v + 1)}>{t('action.continue')}</Button> : <Button onClick={() => navigate('/dashboard')}>{t('action.getStarted')}</Button>}
      </div>
    </Card>
  );
}
