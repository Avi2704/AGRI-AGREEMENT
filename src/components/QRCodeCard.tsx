import { QRCodeSVG } from 'qrcode.react';
import { Card } from './ui/Card';

export function QRCodeCard({ url }: { url: string }) {
  return (
    <Card className="flex flex-col items-center gap-3 text-center">
      <h3 className="text-lg font-bold">Scan to Verify</h3>
      <QRCodeSVG value={url} size={160} includeMargin />
      <p className="break-all text-xs text-slate-600">{url}</p>
    </Card>
  );
}
