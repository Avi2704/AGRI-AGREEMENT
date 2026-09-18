export async function sha256FromArrayBuffer(buffer: ArrayBuffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const bytes = Array.from(new Uint8Array(hashBuffer));
  return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function sha256FromBlob(blob: Blob) {
  const buffer = await blob.arrayBuffer();
  return sha256FromArrayBuffer(buffer);
}

export async function sha256FromText(text: string) {
  const encoder = new TextEncoder();
  return sha256FromArrayBuffer(encoder.encode(text).buffer);
}
