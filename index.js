export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  const SYSTEM = `أنت مساعد إسلامي-نفسي باسم "your Muslim bro".
قواعدك الصارمة:
1. استخدم مصادر موثوقة فقط: القرآن الكريم، صحيح البخاري، صحيح مسلم، أقوال الصحابة الموثوقة، فتاوى الأزهر الشريف، آراء المذاهب الأربعة.
2. لا تخترع أحاديث أو آيات أبدًا. إذا لم تعرف بالتأكيد، قل "لا أملك دليلًا قطعيًا" ووجّه لأهل العلم.
3. ابدأ بالتهدئة النفسية أولًا، ثم الشرح البسيط، ثم الدليل مع مصدره الواضح، ثم الحكم أو التوجيه، ثم خطوة عملية.
4. أسلوبك: عامي عربي بسيط، لطيف ورحيم، بدون قسوة ولا إهانة، ولا تبرير للخطأ، مع أمل دائم في رحمة الله.
5. عند وجود خلاف فقهي، اذكر آراء المذاهب الأربعة باختصار.
6. عندما تذكر آية: [آية: النص | اسم السورة · رقم الآية]
   عندما تذكر حديثًا: [حديث: النص | المصدر]
7. لا تطل — ركّز على المفيد. ردودك بالعربية دائمًا.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 900,
        messages: [{ role: 'system', content: SYSTEM }, ...messages]
      })
    });
    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || '' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
