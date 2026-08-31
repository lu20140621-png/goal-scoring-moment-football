(()=>{
  const CARD_PNG={
    RUN:'cards/run-card.png',
    PASS:'cards/pass-card.png',
    TACKLE:'cards/tackle-card.png',
    INTERCEPTION:'cards/interception-card.png',
    BLOCK:'cards/block-card.png',
    BLITZ:'cards/blitz-card.png'
  };

  const CARD_WEBP={
    RUN:'cards/run-card.webp',
    PASS:'cards/pass-card.webp',
    TACKLE:'cards/tackle-card.webp',
    INTERCEPTION:'cards/interception-card.webp',
    BLOCK:'cards/block-card.webp',
    BLITZ:'cards/blitz-card.webp'
  };

  let lastSignature='';
  let timer=null;


  function displayName(card){
    return card==='BLITZ'
      ? 'BREAK THROUGH'
      : card;
  }


  function createReveal(){
    let root=document.getElementById('aiCardReveal');

    if(root) return root;

    root=document.createElement('div');

    root.id='aiCardReveal';
    root.className='aiCardReveal';

    root.innerHTML=`
      <div class="aiCardRevealLabel">
        BLUE AI PLAYED
      </div>

      <img
        id="aiCardRevealImg"
        alt=""
      >

      <div
        class="aiCardRevealName"
        id="aiCardRevealName">
      </div>
    `;

    document.body.appendChild(root);

    return root;
  }


  function setImageWithFallback(img,card){

    const webp=CARD_WEBP[card];
    const png=CARD_PNG[card];

    img.onerror=null;

    img.onerror=()=>{
      img.onerror=null;
      img.src=png;
    };

    img.src=webp;
  }


  function reveal(card){

    if(!window.matchMedia('(max-width:560px)').matches){
      return;
    }


    if(card==='BREAK THROUGH'){
      card='BLITZ';
    }


    if(!CARD_WEBP[card]){
      return;
    }


    const root=createReveal();

    const img=document.getElementById(
      'aiCardRevealImg'
    );

    const name=document.getElementById(
      'aiCardRevealName'
    );


    name.textContent=displayName(card);

    img.alt=displayName(card)+' card';


    /* WEBP FIRST -> PNG FALLBACK */
    setImageWithFallback(img,card);


    root.classList.remove('show');

    void root.offsetWidth;

    root.classList.add('show');


    clearTimeout(timer);

    timer=setTimeout(()=>{
      root.classList.remove('show');
    },1400);
  }


  function detectCard(line){

    let m=line.match(
      /Blue AI(?:\s+B\d+)?\s+plays\s+(RUN|PASS|TACKLE|INTERCEPTION|BLOCK|BLITZ|BREAK THROUGH)/i
    );

    if(m){
      return m[1].toUpperCase();
    }


    m=line.match(
      /Blue AI(?:\s+B\d+)?\s+uses\s+(?:a\s+final\s+)?(RUN|PASS|TACKLE|INTERCEPTION|BLOCK|BLITZ|BREAK THROUGH)/i
    );

    if(m){
      return m[1].toUpperCase();
    }


    if(
      /Blue AI uses a final BLITZ/i.test(line) ||
      /Blue AI uses a final BREAK THROUGH/i.test(line)
    ){
      return 'BLITZ';
    }


    return null;
  }


  function scanLog(){

  const log=document.getElementById('log');

  if(!log){
    return;
  }

  const lines=log.innerText
    .split('\n')
    .map(x=>x.trim())
    .filter(Boolean);

  if(!lines.length){
    return;
  }

  /* Only check the newest log entry.
     This prevents an older PASS/RUN from being shown again
     when AI later chooses No Defense or skips a response. */
  const line=lines[lines.length-1];

  const card=detectCard(line);

  if(!card){
    return;
  }

  const signature=
    lines.length+'|'+line;

  if(signature===lastSignature){
    return;
  }

  lastSignature=signature;

  reveal(card);
}
