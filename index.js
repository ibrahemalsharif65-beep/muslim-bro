const https = require('https');

// ملاحظة: الأفضل دائماً وضع المفتاح في Environment Variables
const OPENAI_API_KEY = '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';

const SYSTEM = `أنت مساعد إسلامي-نفسي باسم "your Muslim bro".
قواعدك الصارمة:
1. استخدم مصادر موثوقة فقط: القرآن الكريم، صحيح البخاري، صحيح مسلم.
2. لا تخترع أحاديث أو آيات أبدًا. 
3. ابدأ بالتهدئة النفسية أولًا، ثم الشرح البسيط.
4. أسلوبك: عامي عربي بسيط، لطيف ورحيم.
5. لا تطل — ركّز على المفيد. ردودك بالعربية دائمًا.`;

// كود الـ HTML اللي أنت صممته
const HTML = `<!DOCTYPE html> ... [هنا تضع كود الـ HTML الخاص بك كاملاً كما هو] ... `;

export default async function handler(req, res) {
  // التعامل مع الصفحة الرئيسية (عرض الموقع)
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(HTML);
  }

  // التعامل مع طلبات المحادثة
  if (req.method === 'POST') {
    const { messages } = req.body;

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

    return new Promise((resolve) => {
      const apiReq = https.request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', (chunk) => data += chunk);
        apiRes.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              res.status(400).json({ error: parsed.error.message });
            } else {
              res.status(200).json({ reply: parsed.choices[0].message.content });
            }
          } catch (e) {
            res.status(500).json({ error: 'Parse error' });
          }
          resolve();
        });
      });

      apiReq.on('error', (e) => {
        res.status(500).json({ error: e.message });
        resolve();
      });

      apiReq.write(payload);
      apiReq.end();
    });
  }

  // أي طلب آخر
  res.status(404).send('Not Found');
}
