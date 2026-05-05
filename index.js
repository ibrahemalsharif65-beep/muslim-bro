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
const HTML = `<!DOCTYPE html> ... [
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>your Muslim bro</title>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Cairo', sans-serif;
    background: #f0f4f2;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 10px;
  }

  .phone {
    width: 390px;
    max-width: 100%;
    background: #f7faf8;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(15,110,86,0.13);
    display: flex;
    flex-direction: column;
    height: 92vh;
    max-height: 820px;
  }

  .header {
    background: #fff;
    border-bottom: 1px solid #e0ede8;
    padding: 14px 16px 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .av {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: #0F6E56;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; color: #E1F5EE; font-weight: 600;
    border: 2px solid #5DCAA5;
    flex-shrink: 0;
  }

  .hname { font-size: 15px; font-weight: 600; color: #1a1a1a; }
  .hstatus { font-size: 11px; color: #1D9E75; margin-top: 1px; }

  .ornament {
    font-family: 'Amiri', serif;
    font-size: 13px;
    color: #0F6E56;
    text-align: center;
    padding: 9px 0 5px;
    background: #fff;
    border-bottom: 1px solid #e0ede8;
    letter-spacing: 0.5px;
  }

  .key-bar {
    background: #eaf5f0;
    border-bottom: 1px solid #c5e8d8;
    padding: 8px 14px;
    display: flex;
    gap: 7px;
    align-items: center;
  }

  .key-bar label { font-size: 12px; color: #085041; white-space: nowrap; }

  .key-inp {
    flex: 1;
    border: 1px solid #9FE1CB;
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 12px;
    outline: none;
    background: #fff;
    direction: ltr;
    color: #1a1a1a;
  }
  .key-inp:focus { border-color: #1D9E75; }

  .key-btn {
    background: #0F6E56;
    color: #E1F5EE;
    border: none;
    border-radius: 8px;
    padding: 5px 12px;
    font-size: 12px;
    cursor: pointer;
    font-family: 'Cairo', sans-serif;
    font-weight: 500;
  }
  .key-btn:hover { background: #1D9E75; }

  .chat {
    flex: 1;
    overflow-y: auto;
    padding: 10px 13px;
    display: flex;
    flex-direction: column;
    gap: 9px;
    scroll-behavior: smooth;
  }

  .ts {
    font-size: 10px;
    color: #999;
    text-align: center;
    padding: 2px 0;
  }

  .row { display: flex; align-items: flex-end; gap: 7px; }
  .row.u { flex-direction: row-reverse; }

  .mav {
    width: 28px; height: 28px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 600;
  }
  .mav.b { background: #E1F5EE; color: #0F6E56; border: 1px solid #9FE1CB; }
  .mav.u { background: #EEEDFE; color: #534AB7; border: 1px solid #CECBF6; }

  .bub {
    max-width: 78%;
    padding: 10px 13px;
    font-size: 13.5px;
    line-height: 1.75;
    border-radius: 16px;
  }
  .bub.b {
    background: #fff;
    border: 1px solid #ddeee8;
    border-bottom-right-radius: 4px;
    color: #1a1a1a;
  }
  .bub.u {
    background: #0F6E56;
    color: #E1F5EE;
    border-bottom-left-radius: 4px;
  }

  .ayah {
    margin-top: 8px;
    padding: 8px 10px;
    background: #E1F5EE;
    border-right: 3px solid #1D9E75;
    font-family: 'Amiri', serif;
    font-size: 14px;
    color: #085041;
    line-height: 2;
  }
  .asrc {
    font-size: 10.5px;
    color: #0F6E56;
    margin-top: 3px;
    font-family: 'Cairo', sans-serif;
  }

  .typing {
    display: flex; align-items: center; gap: 4px;
    padding: 10px 13px;
    background: #fff;
    border: 1px solid #ddeee8;
    border-radius: 16px;
    border-bottom-right-radius: 4px;
    width: fit-content;
  }
  .dot {
    width: 6px; height: 6px;
    background: #1D9E75;
    border-radius: 50%;
    animation: blink 1.2s infinite;
    opacity: 0.6;
  }
  .dot:nth-child(2) { animation-delay: .2s; }
  .dot:nth-child(3) { animation-delay: .4s; }
  @keyframes blink {
    0%,80%,100% { transform: translateY(0); }
    40% { transform: translateY(-5px); opacity: 1; }
  }

  .sugs {
    padding: 6px 13px 7px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    background: #f7faf8;
    border-top: 1px solid #e0ede8;
  }
  .chip {
    background: #fff;
    border: 1px solid #9FE1CB;
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 12px;
    color: #0F6E56;
    cursor: pointer;
    font-family: 'Cairo', sans-serif;
    font-weight: 500;
    transition: background .15s;
  }
  .chip:hover { background: #E1F5EE; }

  .inp-area {
    background: #fff;
    border-top: 1px solid #e0ede8;
    padding: 10px 12px;
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }

  .tinp {
    flex: 1;
    border: 1px solid #c5e8d8;
    border-radius: 20px;
    padding: 9px 14px;
    font-family: 'Cairo', sans-serif;
    font-size: 13.5px;
    resize: none;
    min-height: 40px;
    max-height: 90px;
    outline: none;
    color: #1a1a1a;
    background: #f7faf8;
    direction: rtl;
    overflow-y: auto;
  }
  .tinp:focus { border-color: #1D9E75; background: #fff; }
  .tinp::placeholder { color: #aaa; }

  .sbtn {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: #0F6E56;
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background .15s, transform .1s;
  }
  .sbtn:hover { background: #1D9E75; }
  .sbtn:active { transform: scale(0.94); }

  .disc {
    font-size: 10px;
    color: #aaa;
    text-align: center;
    padding: 4px 16px 10px;
    background: #fff;
  }

  .error-msg {
    background: #fff3f3;
    border: 1px solid #f0b0b0;
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 12px;
    color: #a33;
    margin: 6px 13px;
    display: none;
  }
</style>
</head>
<body>
<div class="phone">
  <div class="header">
    <div class="av">أخ</div>
    <div style="flex:1;">
      <div class="hname">your Muslim bro 🤍</div>
      <div class="hstatus" id="statusTxt">أدخل API key للبدء</div>
    </div>
  </div>

  <div class="ornament">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>

  <div class="key-bar" id="keyBar">
    <label>OpenAI Key:</label>
    <input class="key-inp" id="keyInp" type="password" placeholder="sk-..." />
    <button class="key-btn" onclick="saveKey()">حفظ ✓</button>
  </div>

  <div class="error-msg" id="errMsg"></div>

  <div class="chat" id="chatArea">
    <div class="ts">اليوم</div>
    <div class="row">
      <div class="mav b">أخ</div>
      <div class="bub b">
        السلام عليكم ورحمة الله 🌿<br><br>
        أنا هنا أسمعك وأساعدك — سواء كان عندك سؤال ديني، أو تمر بضغط نفسي، أو عندك شيء في قلبك تبغى تتكلم عنه.<br><br>
        كلامنا هنا بمصادر موثوقة فقط من القرآن والسنة الصحيحة 🤍
        <div class="ayah">
          أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
          <div class="asrc">📖 سورة الرعد · آية 28</div>
        </div>
      </div>
    </div>
  </div>

  <div class="sugs" id="sugs">
    <div class="chip" onclick="sendSug('عندي وسواس في الصلاة')">وسواس في الصلاة</div>
    <div class="chip" onclick="sendSug('أشعر بالذنب وأريد التوبة')">أريد التوبة</div>
    <div class="chip" onclick="sendSug('أنا حزين ومضغوط')">أنا مضغوط</div>
    <div class="chip" onclick="sendSug('سؤال عن حكم شرعي')">سؤال شرعي</div>
  </div>

  <div class="inp-area">
    <button class="sbtn" onclick="handleSend()">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#E1F5EE" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </button>
    <textarea class="tinp" id="userInput" placeholder="اكتب سؤالك أو ما يشغل بالك..." rows="1"
      onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();handleSend();}"></textarea>
  </div>

  <div class="disc">ليس بديلًا عن العلماء أو الأطباء المتخصصين</div>
</div>

<script>
const SYSTEM = `أنت مساعد إسلامي-نفسي باسم "your Muslim bro".

قواعدك الصارمة:
1. استخدم مصادر موثوقة فقط: القرآن الكريم، صحيح البخاري، صحيح مسلم، أقوال الصحابة الموثوقة، فتاوى الأزهر الشريف، آراء المذاهب الأربعة (الحنفي، المالكي، الشافعي، الحنبلي).
2. لا تخترع أحاديث أو آيات أبدًا. إذا لم تعرف بالتأكيد، قل "لا أملك دليلًا قطعيًا" ووجّه لأهل العلم.
3. ابدأ بالتهدئة النفسية أولًا، ثم الشرح البسيط، ثم الدليل مع مصدره الواضح، ثم الحكم أو التوجيه، ثم خطوة عملية.
4. أسلوبك: عامي عربي بسيط، لطيف ورحيم، بدون قسوة ولا إهانة، ولا تبرير للخطأ، مع أمل دائم في رحمة الله.
5. عند وجود خلاف فقهي، اذكر آراء المذاهب الأربعة باختصار.
6. عندما تذكر آية قرآنية، ضعها هكذا بالضبط: [آية: النص الكامل للآية | اسم السورة · رقم الآية]
   عندما تذكر حديثًا: [حديث: النص الكامل للحديث | المصدر]
7. لا تطل جدًا — ركّز على المفيد. ردودك بالعربية دائمًا.
8. أنت لست بديلًا عن العلماء والأطباء — ذكّر بذلك عند الحاجة.`;

let history = [];
let busy = false;
let apiKey = '';

function saveKey() {
  const v = document.getElementById('keyInp').value.trim();
  if (!v.startsWith('sk-')) {
    showError('الـ API key يجب أن يبدأ بـ sk-');
    return;
  }
  apiKey = v;
  document.getElementById('keyBar').style.display = 'none';
  document.getElementById('statusTxt').textContent = 'متصل · جاهز للمساعدة';
  hideError();
}

function showError(msg) {
  const el = document.getElementById('errMsg');
  el.textContent = msg;
  el.style.display = 'block';
}
function hideError() {
  document.getElementById('errMsg').style.display = 'none';
}

function addMsg(text, isUser) {
  const area = document.getElementById('chatArea');
  const row = document.createElement('div');
  row.className = 'row' + (isUser ? ' u' : '');

  const av = document.createElement('div');
  av.className = 'mav ' + (isUser ? 'u' : 'b');
  av.textContent = isUser ? 'أنت' : 'أخ';

  const bub = document.createElement('div');
  bub.className = 'bub ' + (isUser ? 'u' : 'b');

  if (!isUser) {
    bub.innerHTML = text
      .replace(/\[آية:\s*([^\|]+)\|([^\]]+)\]/g, (_, v, s) =>
        `<div class="ayah">${v.trim()}<div class="asrc">📖 ${s.trim()}</div></div>`)
      .replace(/\[حديث:\s*([^\|]+)\|([^\]]+)\]/g, (_, h, s) =>
        `<div class="ayah">${h.trim()}<div class="asrc">📚 ${s.trim()}</div></div>`)
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  } else {
    bub.textContent = text;
  }

  row.appendChild(av);
  row.appendChild(bub);
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
}

function showTyping() {
  const area = document.getElementById('chatArea');
  const row = document.createElement('div');
  row.className = 'row';
  row.id = 'trow';
  const av = document.createElement('div');
  av.className = 'mav b';
  av.textContent = 'أخ';
  const t = document.createElement('div');
  t.className = 'typing';
  t.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  row.appendChild(av);
  row.appendChild(t);
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('trow');
  if (t) t.remove();
}

async function callAPI(msg) {
  history.push({ role: 'user', content: msg });
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 900,
        messages: [{ role: 'system', content: SYSTEM }, ...history]
      })
    });
    const data = await res.json();
    if (data.error) {
      showError('خطأ من OpenAI: ' + data.error.message);
      history.pop();
      return null;
    }
    hideError();
    const reply = data.choices?.[0]?.message?.content || 'عذرًا، لم أفهم. جرب مرة أخرى.';
    history.push({ role: 'assistant', content: reply });
    return reply;
  } catch (e) {
    showError('تعذّر الاتصال. تحقق من الإنترنت والـ API key.');
    history.pop();
    return null;
  }
}

async function handleSend() {
  if (busy) return;
  if (!apiKey) {
    showError('أدخل الـ API key أولًا في الأعلى ثم اضغط حفظ');
    return;
  }
  const inp = document.getElementById('userInput');
  const msg = inp.value.trim();
  if (!msg) return;
  document.getElementById('sugs').style.display = 'none';
  hideError();
  inp.value = '';
  inp.style.height = 'auto';
  addMsg(msg, true);
  busy = true;
  showTyping();
  const reply = await callAPI(msg);
  removeTyping();
  if (reply) addMsg(reply, false);
  busy = false;
}

function sendSug(t) {
  document.getElementById('userInput').value = t;
  handleSend();
}

document.getElementById('userInput').addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 90) + 'px';
});

document.getElementById('keyInp').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') saveKey();
});
</script>
</body>
</html>
] ... `;

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
