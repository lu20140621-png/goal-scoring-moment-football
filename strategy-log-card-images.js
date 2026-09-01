(()=>{
  const WEBP={
    RUN:'cards/run-card.webp',
    PASS:'cards/pass-card.webp',
    TACKLE:'cards/tackle-card.webp',
    INTERCEPTION:'cards/interception-card.webp',
    BLOCK:'cards/block-card.webp',
    BLITZ:'cards/blitz-card.webp'
  };

  const PNG={
    RUN:'cards/run-card.png',
    PASS:'cards/pass-card.png',
    TACKLE:'cards/tackle-card.png',
    INTERCEPTION:'cards/interception-card.png',
    BLOCK:'cards/block-card.png',
    BLITZ:'cards/blitz-card.png'
  };

  function normalizeCard(name){
    const value=(name||'').toUpperCase();
    return value==='BREAK THROUGH' ? 'BLITZ' : value;
  }

  function playedCardFromLine(line){
    const text=(line||'').trim();
    if(!/BLUE AI/i.test(text)) return null;

    let m=text.match(/Blue AI(?:\s+B\d+)?\s+plays\s+(RUN|PASS|TACKLE|INTERCEPTION|BLOCK|BLITZ|BREAK THROUGH)/i);
    if(m) return normalizeCard(m[1]);

    m=text.match(/Blue AI(?:\s+B\d+)?\s+uses\s+(?:a\s+final\s+)?(RUN|PASS|TACKLE|INTERCEPTION|BLOCK|BLITZ|BREAK THROUGH)/i);
    if(m) return normalizeCard(m[1]);

    return null;
  }

  function makeEntry(text,card){
    const entry=document.createElement('span');
    entry.className='aiLogCardEntry';

    const img=document.createElement('img');
    img.className='aiLogCardThumb';
    img.src=WEBP[card];
    img.dataset.png=PNG[card];
    img.alt=(card==='BLITZ'?'BREAK THROUGH':card)+' card';
    img.onerror=()=>{
      img.onerror=null;
      img.src=img.dataset.png;
    };

    const copy=document.createElement('span');
    copy.className='aiLogCardText';
    copy.textContent=text;

    entry.appendChild(img);
    entry.appendChild(copy);
    return entry;
  }

  function decorateLog(){
    const log=document.getElementById('log');
    if(!log) return;

    [...log.childNodes].forEach(node=>{
      if(node.nodeType!==Node.TEXT_NODE) return;

      const text=(node.nodeValue||'').trim();
      if(!text) return;

      const card=playedCardFromLine(text);
      if(!card || !WEBP[card]) return;

      node.replaceWith(makeEntry(text,card));
    });
  }

  function addStyles(){
    if(document.getElementById('aiLogCardStyles')) return;

    const style=document.createElement('style');
    style.id='aiLogCardStyles';
    style.textContent=`
      .aiLogCardEntry{
        display:inline-flex;
        align-items:center;
        gap:7px;
        min-height:44px;
        vertical-align:middle;
      }
      .aiLogCardThumb{
        flex:0 0 auto;
        width:28px;
        height:42px;
        object-fit:cover;
        border:1px solid #e2bb57;
        border-radius:4px;
        box-shadow:0 2px 7px #0008;
      }
      .aiLogCardText{
        min-width:0;
      }
      @media (max-width:560px){
        .aiLogCardEntry{
          gap:5px;
          min-height:36px;
        }
        .aiLogCardThumb{
          width:22px;
          height:33px;
          border-radius:3px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function start(){
    const log=document.getElementById('log');
    if(!log){
      setTimeout(start,100);
      return;
    }

    addStyles();
    decorateLog();

    let scheduled=false;
    const observer=new MutationObserver(()=>{
      if(scheduled) return;
      scheduled=true;
      requestAnimationFrame(()=>{
        scheduled=false;
        decorateLog();
      });
    });

    observer.observe(log,{childList:true,subtree:false,characterData:true});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start);
  }else{
    start();
  }
})();
