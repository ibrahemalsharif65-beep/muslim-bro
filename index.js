const https = require('https');

// هيفضل التنبيه قائم: الأفضل تحط المفتاح ده في الـ Environment Variables في Vercel
const OPENAI_API_KEY = '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';

const SYSTEM = `أنت مساعد إسلامي-نفسي باسم "your Muslim bro".
قواعدك الصارمة:
1. استخدم مصادر موثوقة فقط (القرآن، البخاري، مسلم).
2. لا تخترع أحاديث أو آيات.
3. ردودك بالعربية دائمًا ومركزة.`;

export default async function handler(req, res) {
  // إعدادات الـ CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;

  try {
    const payload = JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 900,
      messages: [{ role: 'system', content: SYSTEM }, ...messages]
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      apiRes.on('data', (chunk) => data += chunk);
      apiRes.on('end', () => {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          res.status(400).json({ error: parsed.error.message });
        } else {
          res.status(200).json({ reply: parsed.choices[0].message.content });
        }
      });
    });

    apiReq.on('error', (e) => res.status(500).json({ error: e.message }));
    apiReq.write(payload);
    apiReq.end();

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
