(()=>{
  const box=document.getElementById('aiCardReveal');
  const img=document.getElementById('aiCardImg');
  const who=document.getElementById('aiCardWho');
  const name=document.getElementById('aiCardName');
  const log=document.getElementById('log');
  if(!box||!img||!who||!name||!log)return;

  const images={
    RUN:'cards/run-card.png',
    PASS:'cards/pass-card.png',
    TACKLE:'cards/tackle-card.png',
    INTERCEPTION:'cards/interception-card.png',
    BLOCK:'cards/block-card.png',
    'BREAK THROUGH':'cards/blitz-card.png',
    BLITZ:'cards/blitz-card.png'
  };
  let last='',timer=null;

  function reveal(line){
    const upper=line.toUpperCase();
    let card=null;
    for(const key of ['BREAK THROUGH','INTERCEPTION','TACKLE','BLOCK','PASS','RUN','BLITZ']){
      if(upper.includes(key)){card=key;break}
    }
    if(!card||!upper.includes('BLUE AI'))return;
    if(!/(PLAYS|USES)/.test(upper))return;
    const id=(line.match(/Blue AI\s+(B\d+)/i)||[])[1];
    const display=card==='BLITZ'?'BREAK THROUGH':card;
    const signature=line+'|'+display;
    if(signature===last)return;
    last=signature;
    who.textContent=id?`${id} · BLUE AI PLAYS`:'BLUE AI PLAYS';
    name.textContent=display;
    img.src=images[card];
    img.alt=display+' card';
    box.classList.add('show');
    clearTimeout(timer);
    timer=setTimeout(()=>box.classList.remove('show'),1500);
  }

  function scan(){
    const lines=(log.innerText||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
    for(let i=lines.length-1;i>=0;i--){
      if(/Blue AI/i.test(lines[i])&&/(plays|uses)/i.test(lines[i])){reveal(lines[i]);break}
    }
  }

  new MutationObserver(scan).observe(log,{childList:true,subtree:true,characterData:true});
})();
