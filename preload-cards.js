(()=>{
  const CARDS=[
    'run-card',
    'pass-card',
    'tackle-card',
    'interception-card',
    'block-card',
    'blitz-card',
    'football-card'
  ];

  let readyPromise=null;

  function makeLoader(){
    let el=document.getElementById('gameAssetLoader');
    if(el)return el;

    el=document.createElement('div');
    el.id='gameAssetLoader';

    el.innerHTML=`
      <div class="loadBox">
        <div class="loadBall">🏈</div>
        <div class="loadTitle">LOADING GAME</div>
        <div class="loadText" id="loadText">Loading cards...</div>
        <div class="loadTrack">
          <div class="loadBar" id="loadBar"></div>
        </div>
      </div>
    `;

    const style=document.createElement('style');
    style.textContent=`
      #gameAssetLoader{
        position:fixed;
        inset:0;
        z-index:99999;
        display:none;
        align-items:center;
        justify-content:center;
        background:#06140eeF;
        backdrop-filter:blur(8px);
      }

      #gameAssetLoader.show{
        display:flex;
      }

      .loadBox{
        width:min(330px,84vw);
        padding:28px 24px;
        text-align:center;
        background:#0d2418;
        border:2px solid #d9b455;
        border-radius:20px;
        box-shadow:0 20px 60px #000b;
      }

      .loadBall{
        font-size:46px;
        animation:loadSpin .9s infinite alternate ease-in-out;
      }

      .loadTitle{
        margin-top:10px;
        color:#f4d477;
        font-size:20px;
        font-weight:950;
      }

      .loadText{
        margin-top:8px;
        color:#d5e0d9;
        font-size:12px;
      }

      .loadTrack{
        height:8px;
        margin-top:16px;
        overflow:hidden;
        background:#07110c;
        border-radius:999px;
      }

      .loadBar{
        width:0%;
        height:100%;
        background:#e2bb57;
        border-radius:999px;
        transition:width .2s ease;
      }

      @keyframes loadSpin{
        from{transform:rotate(-12deg) scale(.94)}
        to{transform:rotate(12deg) scale(1.08)}
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(el);

    return el;
  }

  function loadCard(name){
    return new Promise(resolve=>{
      const img=new Image();

      let fallback=false;

      img.onload=()=>resolve();

      img.onerror=()=>{
        if(!fallback){
          fallback=true;
          img.src=`cards/${name}.png`;
        }else{
          resolve();
        }
      };

      img.src=`cards/${name}.webp`;
    });
  }

  function preloadAll(){
    if(readyPromise)return readyPromise;

    let done=0;

    readyPromise=Promise.all(
      CARDS.map(name=>
        loadCard(name).then(()=>{
          done++;

          const bar=document.getElementById('loadBar');
          const text=document.getElementById('loadText');

          if(bar){
            bar.style.width=(done/CARDS.length*100)+'%';
          }

          if(text){
            text.textContent=`Loading cards ${done} / ${CARDS.length}`;
          }
        })
      )
    );

    return readyPromise;
  }

  function start(){
    makeLoader();

    /* Begin caching quietly while user is on homepage */
    preloadAll();

    const links=document.querySelectorAll(
      'a[href="strategy-game-en.html"],' +
      'a[href="strategy-tutorial-en.html"],' +
      'a[href="casual-en.html"]'
    );

    links.forEach(link=>{
      link.addEventListener('click',async e=>{
        e.preventDefault();

        const target=link.href;

        const loader=document.getElementById('gameAssetLoader');
        loader.classList.add('show');

        await preloadAll();

        const text=document.getElementById('loadText');
        const bar=document.getElementById('loadBar');

        if(bar)bar.style.width='100%';
        if(text)text.textContent='Ready!';

        setTimeout(()=>{
          location.href=target;
        },180);
      });
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start);
  }else{
    start();
  }
})();
