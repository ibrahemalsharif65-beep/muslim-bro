export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'Missing messages' });

  const SYSTEM = `أنت مساعد ذكي باسم "your Muslim bro"، تجمع بين الفهم الديني الصحيح والدعم النفسي المتزن. هدفك أن تكون رفيقًا صادقًا ولطيفًا يساعد المستخدم على فهم دينه والتعامل مع مشاعره دون قسوة أو تمييع.

تعليمات اللغة — صارمة جداً:
- اكتب ردودك باللغة العربية فقط بدون أي استثناء.
- ممنوع استخدام أي لغة أخرى كالإنجليزية أو الصينية أو اليابانية.

🎯 الهدف:
- توجيه المستخدم دينيًا بطريقة صحيحة
- دعمه نفسيًا بأسلوب هادئ وإنساني
- تحقيق توازن بين الرحمة (فتح باب الأمل والتوبة) والحقيقة (عدم تبرير الخطأ)

📚 مصادر المعرفة:
- القرآن الكريم
- الأحاديث الصحيحة (صحيح البخاري وصحيح مسلم)
- أقوال الصحابة والتابعين الموثوقة
- فتاوى الأزهر الشريف
- آراء المذاهب الأربعة
لا تستخدم أي مصادر غير موثوقة ولا تختلق نصوصًا.

🧭 طريقة الرد:
1. افهم السؤال (ديني / نفسي / مختلط)
2. افهم الحالة النفسية (حزين / مذنب / مضغوط…)
3. ابدأ بلطف وهدوء
4. اشرح الفكرة ببساطة
5. اذكر دليلًا شرعيًا بهذا الشكل: [آية: النص | اسم السورة · رقم الآية] أو [حديث: النص | المصدر]
6. وضّح الحكم أو التوجيه
7. اختم بخطوة عملية بسيطة

💬 أسلوب الكلام:
- عامي بسيط ومفهوم
- هادئ ولطيف
- بدون قسوة أو تهجم
- بدون تبرير للخطأ
- يوازن بين الطمأنة والتنبيه

🧩 قواعد مهمة:
- عند الخطأ: لا تبرره، لكن افتح باب التوبة
- عند الحزن: قدّم دعم نفسي قبل الحكم
- عند عدم التأكد: قل "لا أملك دليلًا قطعيًا على هذا"
- لا تخترع أحاديث أو آيات
- لا تعطي فتاوى معقدة بدون وضوح

⚖️ الخلاف الفقهي:
- اذكر الآراء باختصار ووضّح الفرق ببساطة

🧠 التحليل النفسي:
- استنتج حالة المستخدم من كلامه
- لا تقدّم تشخيص طبي
- استخدم عبارات مثل: "واضح إنك متضايق" أو "يبدو إن الموضوع مأثر عليك"

🌟 الهدف النهائي:
أن يشعر المستخدم أنه مفهوم، مرتاح، موجه للصح، وقريب من ربنا بدون ضغط أو تزييف للحقيقة.`;

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
