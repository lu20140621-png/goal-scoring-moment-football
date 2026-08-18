(()=>{
  // Solo mode AI: Red is the human side; Blue is controlled automatically.
  const $=id=>document.getElementById(id);
  let timer=null, busy=false;
  const text=el=>(el?.textContent||'').trim();
  const isSingle=()=>text($('viewModeChip')).includes('单人')||text($('viewModeChip')).includes('Solo');
  const blueActive=()=>text($('activeModeTag')).startsWith('蓝队')||text($('activeModeTag')).startsWith('Blue Team');
  const actionTitle=()=>text($('actionTitle'));
  const cards=()=>Array.from(document.querySelectorAll('#hand .card'));
  const enabled=name=>cards().find(c=>!c.classList.contains('disabled')&&c.classList.contains(name.toLowerCase()));
  const clickLater=(el,delay=550)=>{if(!el||busy)return;busy=true;clearTimeout(timer);timer=setTimeout(()=>{busy=false;el.click();},delay)};

  function ensureOverlay(){
    let panel=document.querySelector('.cardPanel');
    if(!panel)return null;
    let o=$('computerTurnOverlay');
    if(!o){
      panel.style.position='relative';
      o=document.createElement('div');o.id='computerTurnOverlay';o.innerHTML='<div class="aiBox"><div class="aiBall">🏈</div><b class="aiTitle">电脑回合</b><span class="aiSub">蓝队正在操作…</span></div>';
      o.style.cssText='position:absolute;inset:0;z-index:999;display:none;align-items:center;justify-content:center;background:rgba(4,14,10,.92);border-radius:18px;pointer-events:auto;';
      const st=document.createElement('style');st.textContent='#computerTurnOverlay .aiBox{text-align:center;color:#fff;padding:28px}#computerTurnOverlay .aiBall{font-size:46px;margin-bottom:10px}#computerTurnOverlay .aiTitle{display:block;font-size:24px}#computerTurnOverlay .aiSub{display:block;margin-top:8px;color:#aebdb4;font-size:14px}';document.head.appendChild(st);
      panel.appendChild(o);
    }
    return o;
  }
  function overlay(on){
    let o=ensureOverlay(); if(!o)return;
    o.style.display=on?'flex':'none';
    const zh=document.documentElement.lang!=='en';
    const title=o.querySelector('.aiTitle'),sub=o.querySelector('.aiSub');
    title.textContent=zh?'电脑回合':'Computer Turn';
    sub.textContent=zh?'蓝队正在自动操作…':'Blue Team is playing automatically…';
  }

  function chooseHolder(){
    const btns=Array.from(document.querySelectorAll('#actionButtons button'));
    if(btns.length) clickLater(btns[0],500);
  }
  function attack(){
    const pass=enabled('PASS'),run=enabled('RUN');
    // Prefer PASS when available, otherwise RUN.
    clickLater(pass||run,650);
  }
  function defense(){
    const title=actionTitle();
    let card;
    if(/RUN|持球推进/.test(title)) card=enabled('TACKLE')||enabled('BLITZ');
    else card=enabled('INTERCEPTION')||enabled('BLITZ');
    if(card) clickLater(card,650);
    else{
      const btns=Array.from(document.querySelectorAll('#actionButtons button'));
      clickLater(btns[0],450); // No Defense
    }
  }
  function response(){
    const block=enabled('BLOCK');
    if(block) clickLater(block,650);
    else{
      const btns=Array.from(document.querySelectorAll('#actionButtons button'));
      clickLater(btns[0],450); // No BLOCK
    }
  }
  function finalBlitz(){
    const blitz=enabled('BLITZ');
    if(blitz) clickLater(blitz,650);
    else{
      const btns=Array.from(document.querySelectorAll('#actionButtons button'));
      clickLater(btns[0],450); // Skip BLITZ
    }
  }
  function passTarget(){
    const btns=Array.from(document.querySelectorAll('#actionButtons button'));
    if(btns.length) clickLater(btns[Math.floor(Math.random()*btns.length)],500);
  }
  function skill(){
    const use=$('useSkillBtn'),skip=$('skipSkillBtn');
    // Use QB skill when available. It is consumed immediately by the game rules.
    clickLater(use||skip,650);
  }

  function tick(){
    if(!isSingle()||!blueActive()){overlay(false);busy=false;return;}
    overlay(true);
    if($('skillModal')?.classList.contains('show')){skill();return;}
    if($('touchdownModal')?.classList.contains('show')){const b=$('touchdownContinueBtn');if(b)clickLater(b,900);return;}
    const ap=$('actionPanel');
    const title=actionTitle();
    if(ap?.classList.contains('hidden')){attack();return;}
    if(/选择持球者|Choose Ball Carrier/.test(title)){chooseHolder();return;}
    if(/PASS 给哪名队友|Choose a PASS target/.test(title)){passTarget();return;}
    if(/对方发动|Opponent used/.test(title)){defense();return;}
    if(/对方使用|Opponent played/.test(title)){response();return;}
    if(/最终反制|Final response|BLOCK/.test(title)){finalBlitz();return;}
  }

  setInterval(tick,700);
})();
