import { useRef, useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export function PhotoCapture({ onCaptured }: { onCaptured: (file: File) => Promise<void> }) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  return (
    <Card className="space-y-3">
      <h3 className="text-xl font-bold">{t('action.takeDeliveryPhoto')}</h3>
      <p className="text-sm text-slate-600">Camera capture or gallery upload.</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          try {
            await onCaptured(file);
            setError('');
          } catch {
            setError(t('error.camera'));
          }
        }}
      />
      <Button onClick={() => inputRef.current?.click()}>{t('action.takeDeliveryPhoto')}</Button>
      {error && <p className="text-rose-700">{error}</p>}
    </Card>
  );
}
