(() => {
'use strict';

const $ = id => document.getElementById(id);
const ASSETS = {
  FOOTBALL:'cards/football-card.webp',
  RUN:'cards/run-card.webp',
  PASS:'cards/pass-card.webp',
  TACKLE:'cards/tackle-card.webp',
  INTERCEPTION:'cards/interception-card.webp',
  BLOCK:'cards/block-card.webp',
  BLITZ:'cards/blitz-card.webp'
};
const COACH_IMG='https://raw.githubusercontent.com/lu20140621-png/goal-scoring-moment/main/images/coach-guide.webp';
const LESSONS=[
  ['First to 3','Collect 3 footballs before anyone else.'],
  ['Your Turn','Play Actions first. Your normal draw ends the turn.'],
  ['Score the Football','Score it, reshuffle it, then draw again.'],
  ['RUN · INTERCEPTION · BLOCK','Learn an extra draw and a reaction chain.'],
  ['PASS','See the top 3. Draw only the top card.'],
  ['INTERCEPTION','Cancel RUN, PASS, or one draw.'],
  ['TACKLE · BLOCK','Take a random Action Card. BLOCK can stop it.'],
  ['BREAK THROUGH','Make another player draw one extra card.'],
  ['Recycle the Deck','At 10 or fewer, recycle the discard pile.'],
  ['The Winning Football','Your 3rd football ends the game.'],
  ['Final Challenge','Read the table and finish a real sequence.']
];

const state={
  lesson:0, typing:false, timer:0, fullText:'', next:null, action:null,
  prompt:'', wrongLocked:false, hand:[], scores:[0,0,0], counts:[5,5,5],
  deck:34, discard:0, turn:0
};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const displayName=t=>t==='BLITZ'?'BREAK THROUGH':t;

function setProgress(done,total){
  const pct=Math.max(0,Math.min(100,Math.round(done/total*100)));
  $('bootBar').style.width=pct+'%';
  $('bootPct').textContent=pct+'%';
  $('bootText').textContent=done===total?'Ready!':`Loading assets ${done} / ${total}`;
}
function loadImage(src){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    const timer=setTimeout(()=>reject(new Error('Timeout: '+src)),12000);
    img.onload=()=>{clearTimeout(timer);resolve(src)};
    img.onerror=()=>{clearTimeout(timer);reject(new Error('Failed: '+src))};
    img.src=src;
  });
}
async function boot(){
  const list=[...Object.values(ASSETS),COACH_IMG];
  let done=0;setProgress(0,list.length);
  try{
    await Promise.all(list.map(src=>loadImage(src).then(()=>setProgress(++done,list.length))));
    if(document.fonts?.ready)await document.fonts.ready;
    await delay(140);
    document.documentElement.classList.remove('is-loading');
    $('bootLoader').style.display='none';
    $('tutorialApp').setAttribute('aria-hidden','false');
    startLesson(0);
  }catch(err){
    console.error(err);
    $('bootText').textContent='An asset did not load.';
    $('bootRetry').hidden=false;
  }
}

function setScores(v){state.scores=[...v];v.forEach((n,i)=>$('score'+i).textContent=`🏈 ${n} / 3`)}
function setCounts(v){state.counts=[...v];v.forEach((n,i)=>$('count'+i).textContent=`${n} card${n===1?'':'s'}`)}
function setDeck(n){state.deck=n;$('deckCount').textContent=n}
function setDiscard(n){state.discard=n;$('discardCount').textContent=n}
function setTurn(p,label){
  state.turn=p;
  document.querySelectorAll('.playerSeat').forEach((el,i)=>el.classList.toggle('turn',i===p));
  $('turnBanner').textContent=label||(p===0?'YOUR TURN':`AI ${p} TURN`);
}
function event(text,tone=''){$('eventBanner').textContent=text;$('eventBanner').className='eventBanner '+tone}
function clearFocus(){
  document.querySelectorAll('.focus,.dim').forEach(el=>el.classList.remove('focus','dim'));
  document.querySelectorAll('[data-callout]').forEach(el=>el.removeAttribute('data-callout'));
}
function focus(el,label=''){if(!el)return;el.classList.add('focus');if(label)el.dataset.callout=label}
function focusOnly(el,label=''){
  clearFocus();
  document.querySelectorAll('.playerSeat,.pile,.cardBtn,.peekCard').forEach(x=>{if(x!==el)x.classList.add('dim')});
  focus(el,label);
}
function focusPlayers(players,label='TARGET'){
  clearFocus();
  document.querySelectorAll('.playerSeat').forEach((el,i)=>{
    if(players.includes(i))focus(el,label);else el.classList.add('dim');
  });
}
function renderProgress(){
  $('lessonNo').textContent=`LESSON ${state.lesson+1} / ${LESSONS.length}`;
  $('lessonTitle').textContent=LESSONS[state.lesson][0];
  $('stepbar').innerHTML=LESSONS.map((_,i)=>`<i class="${i<=state.lesson?'on':''}"></i>`).join('');
}
function resetVisualState(){
  clearTimeout(state.timer);
  state.typing=false;state.next=null;state.action=null;state.prompt='';state.wrongLocked=false;
  clearFocus();event('');$('tableReveal').innerHTML='';$('peekRow').innerHTML='';$('peekRow').classList.remove('show');
  $('contextActions').innerHTML='';$('normalDrawNote').classList.remove('show');
  setScores([0,0,0]);setCounts([5,5,5]);setDeck(34);setDiscard(0);setTurn(0);
}
function typeText(text,done){
  const out=$('guideText');state.fullText=text;state.typing=true;out.textContent='';clearTimeout(state.timer);
  let i=0;const tick=()=>{out.textContent=text.slice(0,++i);if(i<text.length)state.timer=setTimeout(tick,12);else{state.typing=false;done?.()}};tick();
}
function say(text,{next=null,label='›',wait=false}={}){
  state.next=next;const btn=$('guideContinue');btn.hidden=true;btn.textContent=label;btn.classList.toggle('wide',label.length>2);
  typeText(text,()=>{btn.hidden=wait||!next});
}
function finishTyping(){clearTimeout(state.timer);$('guideText').textContent=state.fullText;state.typing=false;$('guideContinue').hidden=!state.next||!!state.action}
function onContinue(){if(state.typing){finishTyping();return}if(state.next){const fn=state.next;state.next=null;fn()}}
$('guideDialogue').addEventListener('click',e=>{if(!e.target.closest('button'))onContinue()});
$('guideDialogue').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();onContinue()}});
$('guideContinue').onclick=e=>{e.stopPropagation();onContinue()};

function setAction(prompt,handler,{focusEl=null,callout=''}={}){
  state.prompt=prompt;state.action=handler;state.next=null;say(prompt,{wait:true});if(focusEl)focusOnly(focusEl,callout);
}
function dispatch(kind,value,el){
  if(state.wrongLocked)return;
  if(!state.action){wrong('Not yet. Stay with me.',el);return}
  state.action({kind,value,el});
}
function wrong(message,el){
  if(state.wrongLocked)return;
  state.wrongLocked=true;
  if(el){el.classList.remove('wrong');void el.offsetWidth;el.classList.add('wrong')}
  const prompt=state.prompt;
  const retry=()=>{state.wrongLocked=false;if(el)el.classList.remove('wrong');say(prompt,{wait:true})};
  say(message,{next:retry,label:'TRY AGAIN →'});
}
function renderHand(types){
  state.hand=[...types];const root=$('handCards');root.innerHTML='';
  types.forEach((type,index)=>{
    const b=document.createElement('button');b.className='cardBtn';b.type='button';b.dataset.type=type;b.dataset.index=index;
    b.innerHTML=`<img src="${ASSETS[type]}" alt="${displayName(type)} card"><span class="cardName">${displayName(type)}</span>`;
    b.onclick=()=>dispatch('card',type,b);root.appendChild(b);
  });
}
function removeCard(type){const i=state.hand.indexOf(type);if(i>=0)state.hand.splice(i,1);renderHand(state.hand);setDiscard(state.discard+1)}
function addCard(type){state.hand.push(type);renderHand(state.hand)}
function showPlayed(who,type){$('tableReveal').innerHTML=`<div class="playedWrap"><div class="playedLabel">${who} PLAYED</div><img src="${ASSETS[type]}" alt="${displayName(type)} card"></div>`}
function showSingleCard(type,label=''){
  $('tableReveal').innerHTML=`<button class="peekCard tableCard" type="button" data-table="${type}"><img src="${ASSETS[type]}" alt="${displayName(type)} card">${label?`<span>${label}</span>`:''}</button>`;
  const el=$('tableReveal').querySelector('[data-table]');el.onclick=()=>dispatch('tableCard',type,el);return el;
}
function showPeek(types,topLabel=true){
  const root=$('peekRow');root.innerHTML='';root.classList.add('show');
  types.forEach((type,i)=>{const b=document.createElement('button');b.className='peekCard';b.type='button';b.dataset.peek=i;b.innerHTML=`<img src="${ASSETS[type]}" alt="${displayName(type)} card">${topLabel&&i===0?'<span>TOP</span>':''}`;b.onclick=()=>dispatch('peek',i,b);root.appendChild(b)});
}
function highlightCard(type,label='PLAY THIS'){const el=[...document.querySelectorAll('.cardBtn')].find(x=>x.dataset.type===type);focusOnly(el,label);return el}
function pulseScore(p){const el=$('score'+p);el.classList.remove('scorePop');void el.offsetWidth;el.classList.add('scorePop')}
function pulseDeck(){const el=$('deck');el.classList.remove('shufflePulse');void el.offsetWidth;el.classList.add('shufflePulse')}
async function fly(src,from,to){
  if(!from||!to)return;const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();const img=document.createElement('img');img.className='flyingCard';img.src=src;img.alt='';
  img.style.left=(a.left+a.width/2-39)+'px';img.style.top=(a.top+a.height/2-58)+'px';document.body.appendChild(img);await delay(25);
  img.style.transform=`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(.72)`;img.style.opacity='.35';await delay(500);img.remove();
}
async function drawTo(target,type){
  await fly(ASSETS[type],$('deck'),target===0?$('handCards'):$('player'+target));
  if(type==='FOOTBALL'){pulseScore(target);event('+1 FOOTBALL','good')}
  else{if(target===0)addCard(type);else{state.counts[target]++;setCounts(state.counts)}event(`${target===0?'YOU':`AI ${target}`} DRAWS ${displayName(type)}`,'good')}
}
function nextLessonButton(text='Nice work.'){
  state.action=null;clearFocus();say(text,{next:()=>{if(state.lesson<LESSONS.length-1)startLesson(state.lesson+1);else finishTutorial()},label:state.lesson===LESSONS.length-1?'FINISH →':'NEXT LESSON →'});
}
function startLesson(index){
  state.lesson=index;resetVisualState();renderProgress();$('handNote').textContent=LESSONS[index][1];
  [lesson1,lesson2,lesson3,lesson4,lesson5,lesson6,lesson7,lesson8,lesson9,lesson10,lesson11][index]();
}

function lesson1(){
  renderHand(['RUN','PASS','TACKLE']);setDeck(33);
  say('Welcome to Casual Mode.',{next:()=>{
    say('Everyone plays for themselves.',{next:()=>{
      document.querySelectorAll('.seatScore').forEach(x=>focus(x));
      say('First to 3 footballs wins.',{next:()=>{
        clearFocus();const card=showSingleCard('FOOTBALL','THE CARD YOU WANT');
        setAction('Tap the FOOTBALL CARD.',({kind,value,el})=>{
          if(kind!=='tableCard'||value!=='FOOTBALL')return wrong('That is not the scoring card.',el);
          state.action=null;clearFocus();setScores([1,0,0]);pulseScore(0);event('+1 FOOTBALL','good');
          nextLessonButton('Good. FOOTBALL gives you +1.');
        },{focusEl:card,callout:'TAP FOOTBALL'});
      }});
    }});
  }});
}
function lesson2(){
  renderHand(['RUN','PASS','TACKLE','BLOCK']);setDeck(28);
  say('Your turn.',{next:()=>{
    focus($('handPanel'),'ACTIONS FIRST');
    say('You may play Action Cards first.',{next:()=>{
      clearFocus();setAction('When you are finished, tap the shared deck.',async ({kind,el})=>{
        if(kind!=='deck')return wrong('That does not end your turn. Use the shared deck.',el);
        state.action=null;clearFocus();setDeck(27);await drawTo(0,'INTERCEPTION');setTurn(1);event('TURN ENDS');
        nextLessonButton('That normal draw ended your turn.');
      },{focusEl:$('deck'),callout:'NORMAL DRAW'});
    }});
  }});
}
function lesson3(){
  renderHand(['RUN','PASS','TACKLE']);setDeck(24);
  say('Now draw from the shared deck.',{next:()=>{
    setAction('Tap the deck.',async ({kind,el})=>{
      if(kind!=='deck')return wrong('Draw from the shared deck.',el);
      state.action=null;clearFocus();await fly(ASSETS.FOOTBALL,$('deck'),$('score0'));setScores([1,0,0]);pulseScore(0);event('+1 FOOTBALL','good');
      say('You found FOOTBALL. That scores +1.',{next:()=>{
        showSingleCard('FOOTBALL','SHUFFLE BACK');focus($('deck'),'BACK INTO DECK');
        say('It is not your 3rd, so it goes back in.',{next:async()=>{
          pulseDeck();event('RESHUFFLE','good');await delay(380);$('tableReveal').innerHTML='';clearFocus();
          say('Keep FOOTBALL off the bottom.',{next:()=>{
            setAction('Now draw the replacement card.',async ({kind,el})=>{
              if(kind!=='deck')return wrong('The replacement also comes from the shared deck.',el);
              state.action=null;clearFocus();setDeck(23);await drawTo(0,'TACKLE');
              nextLessonButton('That is the FOOTBALL loop: score, reshuffle, draw again.');
            },{focusEl:$('deck'),callout:'DRAW AGAIN'});
          }});
        }});
      }});
    },{focusEl:$('deck'),callout:'DRAW'});
  }});
}
function lesson4(){
  renderHand(['RUN','PASS','TACKLE','BLOCK']);setDeck(22);setDiscard(0);
  say('RUN gives you one extra draw.',{next:()=>{
    const run=highlightCard('RUN','PLAY RUN');
    setAction('Play RUN.',async ({kind,value,el})=>{
      if(kind!=='card'||value!=='RUN')return wrong('That card does something else. Use RUN.',el);
      state.action=null;clearFocus();removeCard('RUN');showPlayed('YOU','RUN');event('RUN');await delay(320);
      showPlayed('AI 1','INTERCEPTION');setDiscard(state.discard+1);focus($('player1'),'REACTION');event('RUN CANCELED','bad');
      say('AI 1 plays INTERCEPTION. RUN is canceled.',{next:()=>{
        clearFocus();const block=highlightCard('BLOCK','COUNTER');
        setAction('Play BLOCK.',async ({kind,value,el})=>{
          if(kind!=='card'||value!=='BLOCK')return wrong('BLOCK is the counter here.',el);
          state.action=null;clearFocus();removeCard('BLOCK');showPlayed('YOU','BLOCK');event('INTERCEPTION CANCELED','good');
          say('Good. BLOCK cancels that INTERCEPTION.',{next:async()=>{
            $('normalDrawNote').classList.add('show');setDeck(21);await drawTo(0,'PASS');event('RUN EXTRA DRAW','good');
            say('That was the RUN draw.',{next:()=>{
              setAction('Your normal draw is still owed. Tap the deck.',async ({kind,el})=>{
                if(kind!=='deck')return wrong('Finish with your normal draw.',el);
                state.action=null;clearFocus();setDeck(20);await drawTo(0,'TACKLE');$('normalDrawNote').classList.remove('show');setTurn(1);event('TURN ENDS');
                nextLessonButton('Exactly. RUN adds a draw. It does not replace your normal draw.');
              },{focusEl:$('deck'),callout:'NORMAL DRAW'});
            }});
          }});
        },{focusEl:block,callout:'PLAY BLOCK'});
      }});
    },{focusEl:run,callout:'PLAY RUN'});
  }});
}
function lesson5(){
  renderHand(['PASS','RUN','TACKLE','BLITZ']);setDeck(20);
  say('PASS lets you see the top 3 cards.',{next:()=>{
    const pass=highlightCard('PASS','PLAY PASS');
    setAction('Play PASS.',({kind,value,el})=>{
      if(kind!=='card'||value!=='PASS')return wrong('Use PASS for this lesson.',el);
      state.action=null;clearFocus();removeCard('PASS');showPlayed('YOU','PASS');showPeek(['BLOCK','FOOTBALL','TACKLE']);
      say('Here are the top 3.',{next:()=>{
        const top=$('peekRow').querySelector('[data-peek="0"]');
        setAction('Draw the top card.',async ({kind,value,el})=>{
          if(kind!=='peek')return wrong('Choose from the 3 cards PASS revealed.',el);
          if(value!==0)return wrong('PASS does not let you choose or reorder.',el);
          state.action=null;clearFocus();$('peekRow').classList.remove('show');setDeck(19);await drawTo(0,'BLOCK');
          nextLessonButton('Right. You see 3, but you draw only the top card.');
        },{focusEl:top,callout:'TOP CARD'});
      }});
    },{focusEl:pass,callout:'PLAY PASS'});
  }});
}
function lesson6(){
  renderHand(['INTERCEPTION','RUN','PASS','TACKLE']);setDiscard(1);showPlayed('AI 1','RUN');setTurn(1,'AI 1 ACTION');focus($('player1'),'RUN');
  say('AI 1 plays RUN.',{next:()=>{
    say('An extra draw is about to happen.',{next:()=>{
      clearFocus();const inter=highlightCard('INTERCEPTION','REACTION');
      setAction('Cancel RUN.',({kind,value,el})=>{
        if(kind!=='card'||value!=='INTERCEPTION')return wrong('Use INTERCEPTION in this reaction window.',el);
        state.action=null;clearFocus();removeCard('INTERCEPTION');event('RUN CANCELED','good');$('tableReveal').innerHTML='';
        say('Good. INTERCEPTION can cancel RUN or PASS.',{next:()=>{
          addCard('INTERCEPTION');setTurn(2,'AI 2 DRAWING');event('AI 2 ABOUT TO DRAW');const nextInter=highlightCard('INTERCEPTION','REACTION');
          setAction('Now cancel this draw.',({kind,value,el})=>{
            if(kind!=='card'||value!=='INTERCEPTION')return wrong('INTERCEPTION is the draw-cancel reaction.',el);
            state.action=null;clearFocus();removeCard('INTERCEPTION');event('DRAW CANCELED','good');
            nextLessonButton('Exactly. INTERCEPTION cancels RUN, PASS, or one draw.');
          },{focusEl:nextInter,callout:'CANCEL DRAW'});
        }});
      },{focusEl:inter,callout:'INTERCEPT'});
    }});
  }});
}
function lesson7(){
  renderHand(['TACKLE','PASS','BLOCK','RUN']);setCounts([4,5,5]);
  say('TACKLE takes one random Action Card.',{next:()=>{
    const tackle=highlightCard('TACKLE','PLAY TACKLE');
    setAction('Play TACKLE.',({kind,value,el})=>{
      if(kind!=='card'||value!=='TACKLE')return wrong('Use TACKLE for this play.',el);
      state.action=null;clearFocus();removeCard('TACKLE');showPlayed('YOU','TACKLE');focusPlayers([1,2],'TARGET');
      setAction('Choose another player.',async ({kind,value,el})=>{
        if(kind!=='player')return wrong('TACKLE needs a player target.',el);
        if(value===0)return wrong('You cannot target yourself.',el);
        state.action=null;clearFocus();state.counts[value]--;setCounts(state.counts);await fly(ASSETS.PASS,$('player'+value),$('handCards'));addCard('PASS');event('RANDOM CARD TAKEN','good');
        say('You do not choose the stolen card. It is random.',{next:()=>{
          showPlayed('AI 1','TACKLE');setDiscard(state.discard+1);setTurn(1,'AI 1 TARGETS YOU');focus($('player0'),'TARGET');event('TACKLE → YOU','bad');
          say('Now AI 1 uses TACKLE on you.',{next:()=>{
            clearFocus();const block=highlightCard('BLOCK','REACTION');
            setAction('Stop it with BLOCK.',({kind,value,el})=>{
              if(kind!=='card'||value!=='BLOCK')return wrong('BLOCK is the reaction that stops TACKLE.',el);
              state.action=null;clearFocus();removeCard('BLOCK');event('TACKLE CANCELED','good');$('tableReveal').innerHTML='';
              nextLessonButton('Perfect. BLOCK stops TACKLE.');
            },{focusEl:block,callout:'BLOCK IT'});
          }});
        }});
      });
    },{focusEl:tackle,callout:'PLAY TACKLE'});
  }});
}
function lesson8(){
  renderHand(['BLITZ','RUN','PASS','TACKLE']);setDeck(18);
  say('BREAK THROUGH makes another player draw one extra card.',{next:()=>{
    const blitz=highlightCard('BLITZ','PLAY THIS');
    setAction('Play BREAK THROUGH.',({kind,value,el})=>{
      if(kind!=='card'||value!=='BLITZ')return wrong('Use BREAK THROUGH for this play.',el);
      state.action=null;clearFocus();removeCard('BLITZ');showPlayed('YOU','BLITZ');focusPlayers([1,2],'TARGET');
      setAction('Choose who takes the extra draw.',async ({kind,value,el})=>{
        if(kind!=='player')return wrong('Choose another player.',el);
        if(value===0)return wrong('BREAK THROUGH targets another player, not you.',el);
        state.action=null;clearFocus();setDeck(17);await drawTo(value,'RUN');event(`AI ${value} DRAWS 1 EXTRA`,'good');
        nextLessonButton('Good. Because it is a draw, INTERCEPTION can still cancel it.');
      });
    },{focusEl:blitz,callout:'BREAK THROUGH'});
  }});
}
function lesson9(){
  renderHand(['RUN','PASS','TACKLE']);setDeck(10);setDiscard(7);focus($('deck'),'10 CARDS LEFT');
  say('The shared deck is down to 10 cards.',{next:()=>{
    clearFocus();focus($('discardPile'),'RECYCLE');
    say('At 10 or fewer, recycle every discarded Action Card.',{next:()=>{
      setAction('Tap the discard pile.',async ({kind,el})=>{
        if(kind!=='discard')return wrong('Recycle the discard pile, not the deck.',el);
        state.action=null;clearFocus();event('RECYCLING DISCARDS','good');
        for(const type of ['RUN','PASS','BLOCK'])await fly(ASSETS[type],$('discardPile'),$('deck'));
        setDeck(17);setDiscard(0);pulseDeck();await delay(280);event('DECK REFILLED','good');
        say('Do not wait for the deck to run out.',{next:()=>nextLessonButton('And keep FOOTBALL off the bottom whenever you reshuffle.')});
      },{focusEl:$('discardPile'),callout:'TAP DISCARD'});
    }});
  }});
}
function lesson10(){
  renderHand(['RUN','PASS','TACKLE']);setScores([2,1,0]);focus($('score0'),'2 / 3');
  say('You already have 2 footballs.',{next:()=>{
    say('One more ends the game.',{next:()=>{
      clearFocus();setAction('Tap the player who is one score from winning.',({kind,value,el})=>{
        if(kind!=='player')return wrong('Tap a player.',el);
        if(value!==0)return wrong('Check the scores again. YOU are at 2 / 3.',el);
        state.action=null;clearFocus();focus($('score0'),'ONE AWAY');event('1 FOOTBALL FROM WINNING','good');
        nextLessonButton('Exactly. Your 3rd football wins immediately.');
      });
    }});
  }});
}

function resetFinalOwnTurn(){
  setTurn(0);setScores([2,2,0]);setCounts([5,5,5]);setDeck(12);setDiscard(3);renderHand(['PASS','RUN','TACKLE','BLOCK','BLITZ']);
  $('peekRow').classList.remove('show');$('tableReveal').innerHTML='';$('normalDrawNote').classList.remove('show');event('YOUR TURN','good');clearFocus();
  state.prompt='Your turn. You also have 2 footballs. Make the call.';state.action=finalOwnHandler;say(state.prompt,{wait:true});
}
function finalOwnHandler({kind,value,el}){
  if(kind==='deck')return finalBadNormalDraw();
  if(kind!=='card')return wrong('Use your hand, or make the normal draw.',el);
  if(value==='BLOCK')return wrong('BLOCK is a reaction. Nothing is targeting you right now.',el);
  if(value==='TACKLE'){
    removeCard('TACKLE');showPlayed('YOU','TACKLE');focusPlayers([1,2],'TARGET');
    setAction('Choose a TACKLE target.',({kind,value,el})=>{
      if(kind!=='player'||value===0)return wrong('TACKLE must target another player.',el);
      event('LEGAL PLAY · NO SCORE');state.action=null;clearFocus();say('Legal, but it does not move you toward the winning football.',{next:resetFinalOwnTurn,label:'TRY AGAIN →'});
    });return;
  }
  if(value==='BLITZ'){
    removeCard('BLITZ');showPlayed('YOU','BLITZ');focusPlayers([1,2],'TARGET');
    setAction('Choose a BREAK THROUGH target.',({kind,value,el})=>{
      if(kind!=='player'||value===0)return wrong('Choose another player.',el);
      event(`AI ${value} GETS AN EXTRA DRAW`,'bad');state.action=null;clearFocus();say('Legal, but giving an opponent an extra draw is risky here.',{next:resetFinalOwnTurn,label:'TRY AGAIN →'});
    });return;
  }
  if(value==='PASS')return finalPass();
  if(value==='RUN')return finalRun();
  return wrong('That play will not help you finish this situation.',el);
}
async function finalBadNormalDraw(){
  state.action=null;clearFocus();setDeck(11);await drawTo(0,'TACKLE');setTurn(1);event('TURN ENDS','bad');
  say('Legal, but you ended your turn while AI 1 is still one score from winning.',{next:resetFinalOwnTurn,label:'TRY AGAIN →'});
}
function finalPass(){
  state.action=null;removeCard('PASS');showPlayed('YOU','PASS');showPeek(['TACKLE','FOOTBALL','BLOCK'],false);
  state.prompt='PASS showed 3 cards. Resolve it.';
  state.action=async ({kind,value,el})=>{
    if(kind!=='peek')return wrong('Use the cards PASS revealed.',el);
    if(value!==0)return wrong('PASS does not let you choose. Draw the top card.',el);
    state.action=null;clearFocus();$('peekRow').classList.remove('show');setDeck(11);await drawTo(0,'TACKLE');$('normalDrawNote').classList.add('show');
    finalWinningDrawPrompt('PASS is done. Your normal draw is still owed.');
  };say(state.prompt,{wait:true});
}
async function finalRun(){
  state.action=null;removeCard('RUN');showPlayed('YOU','RUN');setDeck(11);await drawTo(0,'TACKLE');$('normalDrawNote').classList.add('show');
  finalWinningDrawPrompt('RUN gave you the extra draw. Your normal draw is still owed.');
}
function finalWinningDrawPrompt(text){
  state.prompt=text;state.action=async ({kind,el})=>{
    if(kind!=='deck')return wrong('Finish with the normal draw from the shared deck.',el);
    state.action=null;clearFocus();setDeck(10);await fly(ASSETS.FOOTBALL,$('deck'),$('score0'));setScores([3,2,0]);pulseScore(0);event('3 / 3 · YOU WIN','good');$('normalDrawNote').classList.remove('show');
    say('That is your 3rd football. Game over — you win.',{next:finishTutorial,label:'FINISH TUTORIAL →'});
  };focus($('deck'),'NORMAL DRAW');say(text,{wait:true});
}
function lesson11(){
  renderHand(['INTERCEPTION','PASS','RUN','TACKLE','BLOCK','BLITZ']);setScores([2,2,0]);setDeck(13);setDiscard(2);setTurn(1,'AI 1 ABOUT TO DRAW');event('AI 1 IS ONE SCORE FROM WINNING','bad');
  say('Final Challenge.',{next:()=>{
    focus($('player1'),'2 / 3');focus($('deck'),'DRAW PENDING');
    say('AI 1 has 2 footballs and is about to draw.',{next:()=>{
      clearFocus();state.prompt='Stop the win. Then finish the game yourself.';
      state.action=({kind,value,el})=>{
        if(kind!=='card')return wrong('This is a reaction window. Use a card from your hand.',el);
        if(value!=='INTERCEPTION'){
          if(value==='BLOCK')return wrong('BLOCK cannot cancel a draw.',el);
          return wrong('That card is not a legal reaction to this draw.',el);
        }
        state.action=null;removeCard('INTERCEPTION');event('AI 1 DRAW CANCELED','good');showPlayed('YOU','INTERCEPTION');
        say('Great stop.',{next:resetFinalOwnTurn});
      };say(state.prompt,{wait:true});
    }});
  }});
}

function finishTutorial(){state.action=null;clearFocus();$('done').classList.add('show');$('done').setAttribute('aria-hidden','false')}
function buildPicker(){
  const root=$('lessonGrid');root.innerHTML='';LESSONS.forEach((l,i)=>{const b=document.createElement('button');b.className='lessonPick';b.type='button';b.innerHTML=`<b>LESSON ${i+1}</b>${l[0]}`;b.onclick=()=>{$('lessonModal').classList.remove('show');$('lessonModal').setAttribute('aria-hidden','true');startLesson(i)};root.appendChild(b)});
}
function restart(){$('done').classList.remove('show');$('done').setAttribute('aria-hidden','true');$('lessonModal').classList.remove('show');startLesson(0)}
$('deck').onclick=()=>dispatch('deck',null,$('deck'));
$('discardPile').onclick=()=>dispatch('discard',null,$('discardPile'));
document.querySelectorAll('.playerSeat').forEach((el,i)=>el.onclick=()=>dispatch('player',i,el));
$('chooseBtn').onclick=()=>{buildPicker();$('lessonModal').classList.add('show');$('lessonModal').setAttribute('aria-hidden','false')};
$('closeLessonBtn').onclick=()=>{$('lessonModal').classList.remove('show');$('lessonModal').setAttribute('aria-hidden','true')};
$('restartBtn').onclick=restart;$('restartModalBtn').onclick=restart;$('againBtn').onclick=restart;
$('bootRetry').onclick=()=>location.reload();
buildPicker();boot();
})();
