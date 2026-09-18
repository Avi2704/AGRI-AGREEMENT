import { Mic, Square, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

type VoiceState = 'idle' | 'recording' | 'processing' | 'secured';

export function VoiceRecorder({ onRecorded }: { onRecorded: (blob: Blob) => Promise<void> }) {
  const { t } = useI18n();
  const [state, setState] = useState<VoiceState>('idle');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = async () => {
    try {
      setError('');
      setState('recording');
      chunksRef.current = [];
      setTimer(0);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
      recorder.onstop = async () => {
        stopTimer();
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size === 0) {
          setState('idle');
          return;
        }
        setState('processing');
        await onRecorded(blob);
        setState('secured');
      };
      recorder.start();
      timerRef.current = window.setInterval(() => {
        setTimer((value) => {
          if (value >= 300) {
            recorder.stop();
            return 300;
          }
          return value + 1;
        });
      }, 1000);
    } catch {
      setState('idle');
      setError(t('error.mic'));
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
  };

  const reset = () => {
    if (state === 'recording' && !window.confirm('Discard recording?')) return;
    stopTimer();
    setState('idle');
    setTimer(0);
    chunksRef.current = [];
  };

  return (
    <Card className="space-y-4 text-center">
      <h2 className="text-2xl font-bold">{t('consent.recordTitle')}</h2>
      <p className="text-slate-600">{t('consent.instruction')}</p>
      <div className="mx-auto h-28 w-28 animate-pulse rounded-full bg-green-100 p-5">
        <button
          aria-label={t('action.record')}
          className="flex h-full w-full items-center justify-center rounded-full bg-green-700 text-white"
          onClick={state === 'recording' ? stop : start}
        >
          {state === 'recording' ? <Square size={32} /> : <Mic size={32} />}
        </button>
      </div>
      <p className="text-lg font-semibold">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</p>
      <div className="flex justify-center gap-2">
        {state === 'recording' && (
          <Button onClick={stop} className="bg-rose-700 hover:bg-rose-800">
            <Square size={16} /> {t('action.stop')}
          </Button>
        )}
        <Button onClick={reset} className="bg-slate-700 hover:bg-slate-800">
          <Trash2 size={16} /> {t('action.cancel')}
        </Button>
      </div>
      {state === 'processing' && <p>{t('consent.secure')}</p>}
      {state === 'secured' && <p className="font-semibold text-green-700">✓ {t('consent.secured')}</p>}
      {error && <p className="text-rose-700">{error}</p>}
    </Card>
  );
}
