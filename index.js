const http = require('http');
const https = require('https');

const OPENAI_API_KEY = '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';

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

const HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>your Muslim bro</title>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Cairo',sans-serif;background:#f0f4f2;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:10px;}
.phone{width:390px;max-width:100%;background:#f7faf8;border-radius:28px;overflow:hidden;box-shadow:0 8px 40px rgba(15,110,86,0.13);display:flex;flex-direction:column;height:92vh;max-height:820px;}
.header{background:#fff;border-bottom:1px solid #e0ede8;padding:14px 16px 12px;display:flex;align-items:center;gap:10px;}
.av{width:40px;height:40px;border-radius:50%;background:#0F6E56;display:flex;align-items:center;justify-content:center;font-size:14px;color:#E1F5EE;font-weight:600;border:2px solid #5DCAA5;flex-shrink:0;}
.hname{font-size:15px;font-weight:600;color:#1a1a1a;}
.hstatus{font-size:11px;color:#1D9E75;margin-top:1px;}
.ornament{font-family:'Amiri',serif;font-size:13px;color:#0F6E56;text-align:center;padding:9px 0 6px;background:#fff;border-bottom:1px solid #e0ede8;}
.chat{flex:1;overflow-y:auto;padding:10px 13px;display:flex;flex-direction:column;gap:9px;scroll-behavior:smooth;}
.ts{font-size:10px;color:#999;text-align:center;padding:2px 0;}
.row{display:flex;align-items:flex-end;gap:7px;}
.row.u{flex-direction:row-reverse;}
.mav{width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;}
.mav.b{background:#E1F5EE;color:#0F6E56;border:1px solid #9FE1CB;}
.mav.u{background:#EEEDFE;color:#534AB7;border:1px solid #CECBF6;}
.bub{max-width:78%;padding:10px 13px;font-size:13.5px;line-height:1.75;border-radius:16px;}
.bub.b{background:#fff;border:1px solid #ddeee8;border-bottom-right-radius:4px;color:#1a1a1a;}
.bub.u{background:#0F6E56;color:#E1F5EE;border-bottom-left-radius:4px;}
.ayah{margin-top:8px;padding:8px 10px;background:#E1F5EE;border-right:3px solid #1D9E75;font-family:'Amiri',serif;font-size:14px;color:#085041;line-height:2;}
.asrc{font-size:10.5px;color:#0F6E56;margin-top:3px;font-family:'Cairo',sans-serif;}
.typing{display:flex;align-items:center;gap:4px;padding:10px 13px;background:#fff;border:1px solid #ddeee8;border-radius:16px;border-bottom-right-radius:4px;width:fit-content;}
.dot{width:6px;height:6px;background:#1D9E75;border-radius:50%;animation:blink 1.2s infinite;opacity:0.6;}
.dot:nth-child(2){animation-delay:.2s;}.dot:nth-child(3){animation-delay:.4s;}
@keyframes blink{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-5px);opacity:1;}}
.sugs{padding:6px 13px 7px;display:flex;flex-wrap:wrap;gap:6px;background:#f7faf8;border-top:1px solid #e0ede8;}
.chip{background:#fff;border:1px solid #9FE1CB;border-radius:20px;padding:5px 12px;font-size:12px;color:#0F6E56;cursor:pointer;font-family:'Cairo',sans-serif;font-weight:500;}
.chip:hover{background:#E1F5EE;}
.inp-area{background:#fff;border-top:1px solid #e0ede8;padding:10px 12px;display:flex;gap:8px;align-items:flex-end;}
.tinp{flex:1;border:1px solid #c5e8d8;border-radius:20px;padding:9px 14px;font-family:'Cairo',sans-serif;font-size:13.5px;resize:none;min-height:40px;max-height:90px;outline:none;color:#1a1a1a;background:#f7faf8;direction:rtl;overflow-y:auto;}
.tinp:focus{border-color:#1D9E75;background:#fff;}
.tinp::placeholder{color:#aaa;}
.sbtn{width:40px;height:40px;border-radius:50%;background:#0F6E56;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s,transform .1s;}
.sbtn:hover{background:#1D9E75;}.sbtn:active{transform:scale(0.94);}
.disc{font-size:10px;color:#aaa;text-align:center;padding:4px 16px 10px;background:#fff;}
.err{background:#fff3f3;border:1px solid #f0b0b0;border-radius:10px;padding:8px 12px;font-size:12px;color:#a33;margin:6px 13px;display:none;}
</style>
</head>
<body>
<div class="phone">
  <div class="header">
    <div class="av">أخ</div>
    <div style="flex:1;">
      <div class="hname">your Muslim bro 🤍</div>
      <div class="hstatus">متاح دائمًا · مصادر موثوقة فقط</div>
    </div>
  </div>
  <div class="ornament">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
  <div class="err" id="errMsg"></div>
  <div class="chat" id="chatArea">
    <div class="ts">اليوم</div>
    <div class="row">
      <div class="mav b">أخ</div>
      <div class="bub b">
        السلام عليكم ورحمة الله 🌿<br><br>
        أنا هنا أسمعك وأساعدك — سواء كان عندك سؤال ديني، أو تمر بضغط نفسي 🤍
        <div class="ayah">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ<div class="asrc">📖 سورة الرعد · آية 28</div></div>
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
let history=[];let busy=false;
function addMsg(text,isUser){
  const area=document.getElementById('chatArea');
  const row=document.createElement('div');row.className='row'+(isUser?' u':'');
  const av=document.createElement('div');av.className='mav '+(isUser?'u':'b');av.textContent=isUser?'أنت':'أخ';
  const bub=document.createElement('div');bub.className='bub '+(isUser?'u':'b');
  if(!isUser){bub.innerHTML=text.replace(/\[آية:\s*([^|]+)\|([^\]]+)\]/g,(_,v,s)=>'<div class="ayah">'+v.trim()+'<div class="asrc">📖 '+s.trim()+'</div></div>').replace(/\[حديث:\s*([^|]+)\|([^\]]+)\]/g,(_,h,s)=>'<div class="ayah">'+h.trim()+'<div class="asrc">📚 '+s.trim()+'</div></div>').replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>');}
  else{bub.textContent=text;}
  row.appendChild(av);row.appendChild(bub);area.appendChild(row);area.scrollTop=area.scrollHeight;
}
function showTyping(){const area=document.getElementById('chatArea');const row=document.createElement('div');row.className='row';row.id='trow';const av=document.createElement('div');av.className='mav b';av.textContent='أخ';const t=document.createElement('div');t.className='typing';t.innerHTML='<div class="dot"></div><div class="dot"></div><div class="dot"></div>';row.appendChild(av);row.appendChild(t);area.appendChild(row);area.scrollTop=area.scrollHeight;}
function removeTyping(){const t=document.getElementById('trow');if(t)t.remove();}
function showErr(m){const e=document.getElementById('errMsg');e.textContent=m;e.style.display='block';}
function hideErr(){document.getElementById('errMsg').style.display='none';}
async function callAPI(msg){
  history.push({role:'user',content:msg});
  try{
    const res=await fetch('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})});
    const data=await res.json();
    if(data.error){showErr('خطأ: '+data.error);history.pop();return null;}
    hideErr();history.push({role:'assistant',content:data.reply});return data.reply;
  }catch(e){showErr('تعذّر الاتصال.');history.pop();return null;}
}
async function handleSend(){
  if(busy)return;
  const inp=document.getElementById('userInput');const msg=inp.value.trim();if(!msg)return;
  document.getElementById('sugs').style.display='none';hideErr();
  inp.value='';inp.style.height='auto';addMsg(msg,true);busy=true;showTyping();
  const reply=await callAPI(msg);removeTyping();if(reply)addMsg(reply,false);busy=false;
}
function sendSug(t){document.getElementById('userInput').value=t;handleSend();}
document.getElementById('userInput').addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,90)+'px';});
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
  } else if (req.method === 'POST' && req.url === '/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { messages } = JSON.parse(body);
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
        const apiReq = https.request(options, apiRes => {
          let data = '';
          apiRes.on('data', chunk => data += chunk);
          apiRes.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: parsed.error.message }));
              } else {
                const reply = parsed.choices?.[0]?.message?.content || '';
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ reply }));
              }
            } catch(e) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Parse error' }));
            }
          });
        });
        apiReq.on('error', e => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        });
        apiReq.write(payload);
        apiReq.end();
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
