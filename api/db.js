// Vercel serverless function — reads/writes via Vercel Edge Config
const EC_ID = 'ecfg_pbwqehrxarcicrpa0npcrep1hrrp';
const KEY   = 'wc2026';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiToken = process.env.WC_API_TOKEN;
  const teamId   = process.env.WC_TEAM_ID;
  const base     = `https://api.vercel.com/v1/edge-config/${EC_ID}`;

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${base}/item/${KEY}?teamId=${teamId}`, {
        headers: { Authorization: `Bearer ${apiToken}` }
      });
      if (r.status === 404) return res.status(200).json(null);
      if (!r.ok) throw new Error(`EC read failed: ${r.status}`);
      const value = await r.json();
      return res.status(200).json(value);
    }

    if (req.method === 'PUT') {
      const r = await fetch(`${base}/items?teamId=${teamId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ operation: 'upsert', key: KEY, value: req.body }] })
      });
      if (!r.ok) throw new Error(`EC write failed: ${r.status}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
