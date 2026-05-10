// Cloudflare Workers - Verification API
// Bind KV namespace with name "CODES"

import codes from '../codes.json' assert { type: 'json' };

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers: CORS_HEADERS });
    }

    const body = await request.json().catch(() => ({}));

    // Initialize: import all codes to KV (run once after deployment)
    if (url.pathname === '/init') {
      const { secret } = body;
      if (secret !== env.INIT_SECRET) {
        return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
      }

      let imported = 0;
      for (const code of codes) {
        const existing = await env.CODES.get(code);
        if (!existing) {
          await env.CODES.put(code, '');
          imported++;
        }
      }

      return Response.json({
        success: true,
        imported,
        total: codes.length,
        message: `Imported ${imported} new codes. Total in KV: ${codes.length}`
      }, { headers: CORS_HEADERS });
    }

    // Verify: check if code exists and not used
    if (url.pathname === '/verify') {
      const { code } = body;
      if (!code) {
        return Response.json({ valid: false, reason: 'Missing code' }, { headers: CORS_HEADERS });
      }

      const value = await env.CODES.get(code);

      if (value === null) {
        return Response.json({ valid: false, reason: 'Invalid code' }, { headers: CORS_HEADERS });
      }

      if (value === 'used') {
        return Response.json({ valid: false, reason: 'Already used' }, { headers: CORS_HEADERS });
      }

      return Response.json({ valid: true }, { headers: CORS_HEADERS });
    }

    // Use: mark code as used
    if (url.pathname === '/use') {
      const { code } = body;
      if (!code) {
        return Response.json({ success: false, reason: 'Missing code' }, { headers: CORS_HEADERS });
      }

      const value = await env.CODES.get(code);

      if (value === null) {
        return Response.json({ success: false, reason: 'Invalid code' }, { headers: CORS_HEADERS });
      }

      if (value === 'used') {
        return Response.json({ success: false, reason: 'Already used' }, { headers: CORS_HEADERS });
      }

      await env.CODES.put(code, 'used');
      return Response.json({ success: true }, { headers: CORS_HEADERS });
    }

    return Response.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS });
  }
};
