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

  let timer=null;

  function displayName(card){
    return card==='BLITZ'
      ? 'BREAK THROUGH'
      : card;
  }

  window.showAiPlayedCard=function(card){

    try{

      if(card==='BREAK THROUGH'){
        card='BLITZ';
      }

      if(!WEBP[card]){
        return;
      }

      const box=document.getElementById('aiCardReveal');
      const img=document.getElementById('aiCardRevealImg');
      const who=document.getElementById('aiCardWho');
      const name=document.getElementById('aiCardRevealName');

      /*
       * Missing visual elements must NEVER stop gameplay.
       */
      if(!box || !img || !who || !name){
        console.warn('AI reveal elements missing.');
        return;
      }

      /*
       * Desktop: never show the mobile popup.
       */
      if(!window.matchMedia('(max-width:560px)').matches){
        box.classList.remove('show');
        return;
      }

      who.textContent='BLUE AI PLAYED';
      name.textContent=displayName(card);
      img.alt=displayName(card)+' card';

      /*
       * WebP first.
       * PNG only if WebP fails.
       */
      img.onerror=()=>{
        img.onerror=null;
        img.src=PNG[card];
      };

      img.src=WEBP[card];

      box.classList.remove('show');

      void box.offsetWidth;

      box.classList.add('show');

      clearTimeout(timer);

      timer=setTimeout(()=>{
        box.classList.remove('show');
      },1400);

    }catch(err){

      /*
       * Image/UI errors are never allowed
       * to stop the actual game.
       */
      console.warn('AI reveal failed:',err);
    }
  };

})();
