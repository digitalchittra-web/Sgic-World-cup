// Vercel serverless function — simple JSON store using Vercel KV
// Requires: connect a KV store in your Vercel project dashboard (Storage tab)
const { kv } = require('@vercel/kv');

const DB_KEY = 'wc2026';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const data = await kv.get(DB_KEY);
      return res.status(200).json(data || null);
    }
    if (req.method === 'PUT') {
      await kv.set(DB_KEY, req.body);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
