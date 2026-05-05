export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'Missing messages' });

  const SYSTEM = `أنت مساعد إسلامي-نفسي باسم "your Muslim bro".
قواعدك الصارمة:
1. استخدم مصادر موثوقة فقط: القرآن الكريم، صحيح البخاري، صحيح مسلم، فتاوى الأزهر الشريف، آراء المذاهب الأربعة.
2. لا تخترع أحاديث أو آيات أبدًا.
3. ابدأ بالتهدئة النفسية أولًا، ثم الشرح، ثم الدليل، ثم خطوة عملية.
4. أسلوبك: عامي عربي بسيط، لطيف ورحيم، مع أمل دائم في رحمة الله.
5. عند وجود خلاف فقهي، اذكر آراء المذاهب الأربعة باختصار.
6. عندما تذكر آية: [آية: النص | اسم السورة · رقم الآية]
   عندما تذكر حديثًا: [حديث: النص | المصدر]
7. ردودك بالعربية دائمًا. لا تطل جدًا.
8. ذكّر أنك لست بديلًا عن العلماء والأطباء عند الحاجة.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 900,
        messages: [{ role: 'system', content: SYSTEM }, ...messages]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || 'عذرًا، لم أفهم. جرب مرة أخرى.';
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
