(()=>{
  // Solo mode AI: Red is the human side; Blue is controlled automatically.
  const $=id=>document.getElementById(id);
  let timer=null,busy=false;
  const text=el=>(el?.textContent||'').trim();
  const isSingle=()=>text($('viewModeChip')).includes('单人')||text($('viewModeChip')).includes('Solo');
  const blueActive=()=>text($('activeModeTag')).startsWith('蓝队')||text($('activeModeTag')).startsWith('Blue Team');
  const actionTitle=()=>text($('actionTitle'));
  const cards=()=>Array.from(document.querySelectorAll('#hand .card'));
  const enabled=name=>cards().find(c=>!c.classList.contains('disabled')&&c.classList.contains(name.toLowerCase()));
  const clickLater=(el,delay=550)=>{if(!el||busy)return;busy=true;clearTimeout(timer);timer=setTimeout(()=>{busy=false;el.click();},delay)};

  function ensureOverlay(){
    let panel=document.querySelector('.cardPanel');if(!panel)return null;
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
    let o=ensureOverlay();if(!o)return;
    o.style.display=on?'flex':'none';
    const field=$('fieldPlayers');if(field)field.style.pointerEvents=on?'none':'';
    const zh=document.documentElement.lang!=='en';
    o.querySelector('.aiTitle').textContent=zh?'电脑回合':'Computer Turn';
    o.querySelector('.aiSub').textContent=zh?'蓝队正在自动操作…':'Blue Team is playing automatically…';
    if($('footerNote'))$('footerNote').innerHTML=zh?'单人模式：红队由你操作，蓝队由电脑自动操作。<br>多人本地模式：红蓝双方都由现场玩家操作。<br>对局记录与说明固定在最底部。':'Solo mode: you control Red; Blue is controlled by the computer.<br>Local multiplayer: both teams are controlled by players.<br>Match log and notes stay at the bottom.';
    if($('viewDesc'))$('viewDesc').textContent=zh?'单人模式：你只操作红队，蓝队由电脑自动完成进攻、防守和技能决策。':'Solo mode: you control only Red; Blue automatically handles offense, defense and skill decisions.';
  }
  function chooseHolder(){const b=Array.from(document.querySelectorAll('#actionButtons button'));if(b.length)clickLater(b[0],500)}
  function attack(){clickLater(enabled('PASS')||enabled('RUN'),650)}
  function defense(){const title=actionTitle();let c=/RUN|持球推进/.test(title)?enabled('TACKLE')||enabled('BLITZ'):enabled('INTERCEPTION')||enabled('BLITZ');if(c)clickLater(c,650);else clickLater(Array.from(document.querySelectorAll('#actionButtons button'))[0],450)}
  function response(){clickLater(enabled('BLOCK')||Array.from(document.querySelectorAll('#actionButtons button'))[0],650)}
  function finalBlitz(){clickLater(enabled('BLITZ')||Array.from(document.querySelectorAll('#actionButtons button'))[0],550)}
  function passTarget(){const b=Array.from(document.querySelectorAll('#actionButtons button'));if(b.length)clickLater(b[Math.floor(Math.random()*b.length)],500)}
  function skill(){clickLater($('useSkillBtn')||$('skipSkillBtn'),650)}
  function tick(){
    if(!isSingle()||!blueActive()){overlay(false);busy=false;return}
    overlay(true);
    if($('skillModal')?.classList.contains('show')){skill();return}
    if($('touchdownModal')?.classList.contains('show')){clickLater($('touchdownContinueBtn'),900);return}
    const ap=$('actionPanel'),title=actionTitle();
    if(ap?.classList.contains('hidden')){attack();return}
    if(/选择持球者|Choose Ball Carrier/.test(title)){chooseHolder();return}
    if(/PASS 给哪名队友|Choose a PASS target/.test(title)){passTarget();return}
    if(/对方发动|Opponent used/.test(title)){defense();return}
    if(/对方使用|Opponent played/.test(title)){response();return}
    if(/最终反制|Final response|BLOCK/.test(title)){finalBlitz();return}
  }
  setInterval(tick,700);
})();
