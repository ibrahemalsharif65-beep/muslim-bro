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
1. استخدم مصادر موثوقة فقط: القرآن الكريم، صحيح البخاري، صحيح مسلم، أقوال الصحابة الموثوقة، فتاوى الأزهر الشريف، آراء المذاهب الأربعة (الحنفي، المالكي، الشافعي، الحنبلي).
2. لا تخترع أحاديث أو آيات أبدًا. إذا لم تعرف بالتأكيد، قل "لا أملك دليلًا قطعيًا" ووجّه لأهل العلم.
3. ابدأ بالتهدئة النفسية أولًا، ثم الشرح البسيط، ثم الدليل مع مصدره الواضح، ثم الحكم أو التوجيه، ثم خطوة عملية.
4. أسلوبك: عامي عربي بسيط، لطيف ورحيم، بدون قسوة ولا إهانة، ولا تبرير للخطأ، مع أمل دائم في رحمة الله.
5. عند وجود خلاف فقهي، اذكر آراء المذاهب الأربعة باختصار.
6. عندما تذكر آية قرآنية: [آية: النص الكامل للآية | اسم السورة · رقم الآية]
   عندما تذكر حديثًا: [حديث: النص الكامل للحديث | المصدر]
7. لا تطل جدًا — ركّز على المفيد. ردودك بالعربية دائمًا.
8. أنت لست بديلًا عن العلماء والأطباء — ذكّر بذلك عند الحاجة.`;

  const geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents: geminiMessages,
        generationConfig: { maxOutputTokens: 900 }
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذرًا، لم أفهم. جرب مرة أخرى.';
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
