// Simple browser fingerprint using canvas + navigator properties
// Not as robust as fingerprintjs but good enough for this use case

export async function getFingerprint(): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'unknown';

  // Canvas fingerprinting
  canvas.width = 200;
  canvas.height = 50;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f60';
  ctx.fillRect(0, 0, 200, 50);
  ctx.fillStyle = '#069';
  ctx.font = '14px "Arial"';
  ctx.fillText('星格解析档案', 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.font = '18px "Times New Roman"';
  ctx.fillText('Fingerprint', 4, 35);

  const canvasData = canvas.toDataURL();

  // Combine with navigator info
  const components = [
    canvasData,
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    navigator.hardwareConcurrency,
  ];

  // Simple hash
  const str = components.join('::');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(16);
}

export function getStoredCode(): string | null {
  try {
    const data = localStorage.getItem('soul_report_verified');
    if (!data) return null;
    const parsed = JSON.parse(data);
    return parsed.code || null;
  } catch {
    return null;
  }
}

export function storeCode(code: string, fingerprint: string): void {
  localStorage.setItem('soul_report_verified', JSON.stringify({
    code,
    fingerprint,
    timestamp: Date.now(),
  }));
}

export async function verifyStoredCode(): Promise<boolean> {
  try {
    const data = localStorage.getItem('soul_report_verified');
    if (!data) return false;

    const parsed = JSON.parse(data);
    const currentFingerprint = await getFingerprint();

    // Check if fingerprint matches
    return parsed.fingerprint === currentFingerprint;
  } catch {
    return false;
  }
}
