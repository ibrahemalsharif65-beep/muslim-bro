const https = require('https');

// المفتاح البرمجي الخاص بك (OpenAI API Key)
const OPENAI_API_KEY = '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';

// التعليمات البرمجية لشخصية المساعد
const SYSTEM = `أنت مساعد إسلامي-نفسي باسم "your Muslim bro".
قواعدك الصارمة:
1. استخدم مصادر موثوقة فقط: القرآن الكريم، صحيح البخاري، صحيح مسلم.
2. لا تخترع أحاديث أو آيات أبدًا.
3. ابدأ بالتهدئة النفسية أولًا، ثم الشرح البسيط، ثم الدليل، ثم خطوة عملية.
4. أسلوبك: عامي عربي بسيط، لطيف ورحيم.
5. ردودك بالعربية دائمًا ومركزة.`;

// واجهة المستخدم (HTML) التي صممتها أنت
const HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>your Muslim bro</title>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Cairo', sans-serif; background: #f0f4f2; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 10px; }
  .phone { width: 390px; max-width: 100%; background: #f7faf8; border-radius: 28px; overflow: hidden; box-shadow: 0 8px 40px rgba(15,110,86,0.13); display: flex; flex-direction: column; height: 92vh; max-height: 820px; }
  .header { background: #fff; border-bottom: 1px solid #e0ede8; padding: 14px 16px 12px; display: flex; align-items: center; gap: 10px; }
  .av { width: 40px; height: 40px; border-radius: 50%; background: #0F6E56; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #E1F5EE; font-weight: 600; border: 2px solid #5DCAA5; flex-shrink: 0; }
  .hname { font-size: 15px; font-weight: 600; color: #1a1a1a; }
  .hstatus { font-size: 11px; color: #1D9E75; margin-top: 1px; }
  .ornament { font-family: 'Amiri', serif; font-size: 13px; color: #0F6E56; text-align: center; padding: 9px 0 5px; background: #fff; border-bottom: 1px solid #e0ede8; }
  .chat { flex: 1; overflow-y: auto; padding: 10px 13px; display: flex; flex-direction: column; gap: 9px; scroll-behavior: smooth; }
  .row { display: flex; align-items: flex-end; gap: 7px; }
  .row.u { flex-direction: row-reverse; }
  .mav { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; }
  .mav.b { background: #E1F5EE; color: #0F6E56; border: 1px solid #9FE1CB; }
  .mav.u { background: #EEEDFE; color: #534AB7; border: 1px solid #CECBF6; }
  .bub { max-width: 78%; padding: 10px 13px; font-size: 13.5px; line-height: 1.75; border-radius: 16px; }
  .bub.b { background: #fff; border: 1px solid #ddeee8; color: #1a1a1a; }
  .bub.u { background: #0F6E56; color: #E1F5EE; }
  .ayah { margin-top: 8px; padding: 8px 10px; background: #E1F5EE; border-right: 3px solid #1D9E75; font-family: 'Amiri', serif; font-size: 14px; color: #085041; }
  .asrc { font-size: 10.5px; color: #0F6E56; margin-top: 3px; font-family: 'Cairo', sans-serif; }
  .inp-area { background: #fff; border-top: 1px solid #e0ede8; padding: 10px 12px; display: flex; gap: 8px; align-items: flex-end; }
  .tinp { flex: 1; border: 1px solid #c5e8d8; border-radius: 20px; padding: 9px 14px; font-family: 'Cairo', sans-serif; font-size: 13.5px; outline: none; background: #f7faf8; direction: rtl; }
  .sbtn { width: 40px; height: 40px; border-radius: 50%; background: #0F6E56; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
</style>
</head>
<body>
<div class="phone">
  <div class="header">
    <div class="av">أخ</div>
    <div style="flex:1;">
      <div class="hname">your Muslim bro 🤍</div>
      <div class="hstatus">متصل · متاح دائماً</div>
    </div>
  </div>
  <div class="ornament">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
  <div class="chat" id="chatArea">
    <div class="row">
      <div class="mav b">أخ</div>
      <div class="bub b">السلام عليكم ورحمة الله 🌿 أنا هنا لأسمعك وأساعدك.</div>
    </div>
  </div>
  <div class="inp-area">
    <button class="sbtn" onclick="handleSend()">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#E1F5EE" stroke-width="2"><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    </button>
    <textarea class="tinp" id="userInput" placeholder="اكتب سؤالك..." rows="1"></textarea>
  </div>
</div>
<script>
let history = [];
async function handleSend() {
  const inp = document.getElementById('userInput');
  const msg = inp.value.trim();
  if(!msg) return;
  addMsg(msg, true);
  inp.value = '';
  
  const res = await fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history.concat({ role: 'user', content: msg }) })
  });
  const data = await res.json();
  if(data.reply) {
    addMsg(data.reply, false);
    history.push({ role: 'user', content: msg }, { role: 'assistant', content: data.reply });
  }
}
function addMsg(text, isUser) {
  const area = document.getElementById('chatArea');
  const row = document.createElement('div');
  row.className = 'row' + (isUser ? ' u' : '');
  row.innerHTML = \`<div class="mav \${isUser?'u':'b'}">\${isUser?'أنت':'أخ'}</div><div class="bub \${isUser?'u':'b'}">\${text}</div>\`;
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
}
</script>
</body>
</html>`;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(HTML);
  }

  if (req.method === 'POST') {
    const { messages } = req.body;
    const payload = JSON.stringify({
      model: 'gpt-4o',
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
        try {
          const parsed = JSON.parse(data);
          res.status(200).json({ reply: parsed.choices[0].message.content });
        } catch (e) {
          res.status(500).json({ error: 'Error processing AI response' });
        }
      });
    });

    apiReq.write(payload);
    apiReq.end();
  }
}
