(()=>{
  const CARD_WEBP={
    RUN:'cards/run-card.webp',
    PASS:'cards/pass-card.webp',
    TACKLE:'cards/tackle-card.webp',
    INTERCEPTION:'cards/interception-card.webp',
    BLOCK:'cards/block-card.webp',
    BLITZ:'cards/blitz-card.webp'
  };

  const CARD_PNG={
    RUN:'cards/run-card.png',
    PASS:'cards/pass-card.png',
    TACKLE:'cards/tackle-card.png',
    INTERCEPTION:'cards/interception-card.png',
    BLOCK:'cards/block-card.png',
    BLITZ:'cards/blitz-card.png'
  };

  let timer=null;

  function displayName(card){
    return card==='BLITZ'
      ? 'BREAK THROUGH'
      : card;
  }

  function isMobile(){
    return window.matchMedia('(max-width:560px)').matches;
  }

  function removeReveal(){
    const old=document.getElementById('aiCardReveal');

    if(old){
      old.remove();
    }
  }

  function createReveal(){

    let root=document.getElementById('aiCardReveal');

    if(root){
      return root;
    }

    root=document.createElement('div');

    root.id='aiCardReveal';
    root.className='aiCardReveal';

    root.innerHTML=`
      <div class="aiCardRevealLabel">
        BLUE AI PLAYED
      </div>

      <img id="aiCardRevealImg" alt="">

      <div
        class="aiCardRevealName"
        id="aiCardRevealName">
      </div>
    `;

    document.body.appendChild(root);

    return root;
  }

  function loadImage(img,card){

    img.onload=null;
    img.onerror=null;

    img.onerror=()=>{
      img.onerror=null;
      img.src=CARD_PNG[card];
    };

    /* WebP first */
    img.src=CARD_WEBP[card];
  }

  window.showAiPlayedCard=function(card){

    /*
      IMPORTANT:
      Only call this when Blue AI really spends/plays a card.
    */

    if(card==='BREAK THROUGH'){
      card='BLITZ';
    }

    if(!CARD_WEBP[card]){
      return;
    }

    /*
      Desktop:
      Never create/show the reveal card.
      This fixes the giant card staying under the field.
    */
    if(!isMobile()){
      removeReveal();
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

    loadImage(img,card);

    root.classList.remove('show');

    void root.offsetWidth;

    root.classList.add('show');

    clearTimeout(timer);

    timer=setTimeout(()=>{
      root.classList.remove('show');
    },1400);
  };

  /*
    If page changes from mobile width to desktop width,
    remove any existing reveal immediately.
  */
  window.addEventListener('resize',()=>{
    if(!isMobile()){
      removeReveal();
    }
  });

  if(!isMobile()){
    removeReveal();
  }

})();
