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
  ['First to 3','Learn the goal and why everyone wants the FOOTBALL CARD.'],
  ['Your Turn','Play optional Actions, then make the normal draw that ends your turn.'],
  ['Score the Football','Draw FOOTBALL, score it, shuffle it back, then draw again.'],
  ['RUN · INTERCEPTION · BLOCK','Practice an extra draw and the reaction chain around it.'],
  ['PASS','Look at the top 3 without changing order, then draw only the top card.'],
  ['INTERCEPTION','Cancel RUN, PASS, or one upcoming draw.'],
  ['TACKLE · BLOCK','Steal one random Action Card and learn how BLOCK stops TACKLE.'],
  ['BREAK THROUGH','Choose another player and make that player draw one extra card.'],
  ['Recycle the Deck','At 10 cards or fewer, shuffle all discards back into the shared deck.'],
  ['The Winning Football','Your 3rd football wins immediately.'],
  ['Final Challenge','Stop an opponent from winning, then finish the game yourself.']
];

const state={
  lesson:0, typing:false, timer:0, fullText:'', next:null, action:null,
  prompt:'', wrongLocked:false, hand:[], scores:[0,0,0], counts:[5,5,5],
  deck:34, discard:0, turn:0, extraOwed:false, finalPhase:''
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
  let done=0; setProgress(0,list.length);
  try{
    await Promise.all(list.map(src=>loadImage(src).then(()=>setProgress(++done,list.length))));
    if(document.fonts?.ready) await document.fonts.ready;
    await delay(160);
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

function setScores(values){
  state.scores=[...values];
  values.forEach((n,i)=>{$('score'+i).textContent=`🏈 ${n} / 3`;});
}
function setCounts(values){
  state.counts=[...values];
  values.forEach((n,i)=>{$('count'+i).textContent=`${n} card${n===1?'':'s'}`;});
}
function setDeck(n){state.deck=n;$('deckCount').textContent=n;}
function setDiscard(n){state.discard=n;$('discardCount').textContent=n;}
function setTurn(p,label){
  state.turn=p;
  document.querySelectorAll('.playerSeat').forEach((el,i)=>el.classList.toggle('turn',i===p));
  $('turnBanner').textContent=label || (p===0?'YOUR TURN':`AI ${p} TURN`);
}
function event(text,tone=''){
  $('eventBanner').textContent=text;
  $('eventBanner').className='eventBanner '+tone;
}
function clearFocus(){
  document.querySelectorAll('.focus,.dim').forEach(el=>el.classList.remove('focus','dim'));
  document.querySelectorAll('[data-callout]').forEach(el=>el.removeAttribute('data-callout'));
}
function focus(el,label=''){
  if(!el)return;
  el.classList.add('focus');
  if(label)el.dataset.callout=label;
}
function focusOnly(el,label=''){
  clearFocus();
  document.querySelectorAll('.playerSeat,.pile,.cardBtn,.peekCard').forEach(x=>{if(x!==el)x.classList.add('dim')});
  focus(el,label);
}
function renderProgress(){
  $('lessonNo').textContent=`LESSON ${state.lesson+1} / ${LESSONS.length}`;
  $('lessonTitle').textContent=LESSONS[state.lesson][0];
  $('stepbar').innerHTML=LESSONS.map((_,i)=>`<i class="${i<=state.lesson?'on':''}"></i>`).join('');
}
function resetVisualState(){
  clearTimeout(state.timer);
  state.typing=false;state.next=null;state.action=null;state.prompt='';state.wrongLocked=false;state.extraOwed=false;
  clearFocus();event('');$('tableReveal').innerHTML='';$('peekRow').innerHTML='';$('peekRow').classList.remove('show');
  $('contextActions').innerHTML='';$('normalDrawNote').classList.remove('show');
  setScores([0,0,0]);setCounts([5,5,5]);setDeck(34);setDiscard(0);setTurn(0);
}
function typeText(text,done){
  const out=$('guideText');
  state.fullText=text;state.typing=true;out.textContent='';clearTimeout(state.timer);
  let i=0;
  const tick=()=>{
    out.textContent=text.slice(0,++i);
    if(i<text.length)state.timer=setTimeout(tick,13);
    else{state.typing=false;done?.();}
  };
  tick();
}
function say(text,{next=null,label='›',wait=false}={}){
  state.next=next;
  const btn=$('guideContinue');
  btn.hidden=true;btn.textContent=label;btn.classList.toggle('wide',label.length>2);
  typeText(text,()=>{btn.hidden=wait||!next;});
}
function finishTyping(){
  clearTimeout(state.timer);$('guideText').textContent=state.fullText;state.typing=false;
  const btn=$('guideContinue');btn.hidden=!state.next || !!state.action;
}
function onContinue(){
  if(state.typing){finishTyping();return}
  if(state.next){const fn=state.next;state.next=null;fn();}
}
$('guideDialogue').addEventListener('click',e=>{if(e.target.closest('button'))return;onContinue()});
$('guideDialogue').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();onContinue()}});
$('guideContinue').onclick=e=>{e.stopPropagation();onContinue()};

function setAction(prompt,handler,{focusEl=null,callout=''}={}){
  state.prompt=prompt;state.action=handler;state.next=null;
  say(prompt,{wait:true});
  if(focusEl)focusOnly(focusEl,callout);
}
function dispatch(kind,value,el){
  if(state.wrongLocked)return;
  if(!state.action){wrong('Not yet. Follow the coach first.',el);return}
  state.action({kind,value,el});
}
function wrong(message,el){
  if(state.wrongLocked)return;
  state.wrongLocked=true;
  if(el){el.classList.remove('wrong');void el.offsetWidth;el.classList.add('wrong');}
  const prompt=state.prompt;
  state.next=()=>{
    state.wrongLocked=false;
    if(el)el.classList.remove('wrong');
    say(prompt,{wait:true});
  };
  say(message,{next:state.next,label:'TRY AGAIN →'});
}
function renderHand(types){
  state.hand=[...types];
  const root=$('handCards');root.innerHTML='';
  types.forEach((type,index)=>{
    const b=document.createElement('button');b.className='cardBtn';b.type='button';b.dataset.type=type;b.dataset.index=index;
    b.innerHTML=`<img src="${ASSETS[type]}" alt="${displayName(type)} card"><span class="cardName">${displayName(type)}</span>`;
    b.onclick=()=>dispatch('card',type,b);root.appendChild(b);
  });
}
function removeCard(type){
  const i=state.hand.indexOf(type);if(i>=0)state.hand.splice(i,1);
  renderHand(state.hand);setDiscard(state.discard+1);
}
function addCard(type){state.hand.push(type);renderHand(state.hand)}
function showPlayed(who,type){
  $('tableReveal').innerHTML=`<div class="playedWrap"><div class="playedLabel">${who} PLAYED</div><img src="${ASSETS[type]}" alt="${displayName(type)} card"></div>`;
}
function showSingleCard(type,label=''){
  $('tableReveal').innerHTML=`<button class="peekCard tableCard" type="button" data-table="${type}"><img src="${ASSETS[type]}" alt="${displayName(type)} card">${label?`<span>${label}</span>`:''}</button>`;
  const el=$('tableReveal').querySelector('[data-table]');
  el.onclick=()=>dispatch('tableCard',type,el);
  return el;
}
function showPeek(types,topLabel=true){
  const root=$('peekRow');root.innerHTML='';root.classList.add('show');
  types.forEach((type,i)=>{
    const b=document.createElement('button');b.className='peekCard';b.type='button';b.dataset.peek=i;
    b.innerHTML=`<img src="${ASSETS[type]}" alt="${displayName(type)} card">${topLabel&&i===0?'<span>TOP</span>':''}`;
    b.onclick=()=>dispatch('peek',i,b);root.appendChild(b);
  });
}
function addAction(label,value='action',gold=true){
  const b=document.createElement('button');b.className='actionBtn'+(gold?' gold':'');b.type='button';b.textContent=label;
  b.onclick=()=>dispatch('action',value,b);$('contextActions').appendChild(b);return b;
}
function highlightCard(type,label='PLAY THIS'){
  const el=[...document.querySelectorAll('.cardBtn')].find(x=>x.dataset.type===type);
  focusOnly(el,label);return el;
}
function pulseScore(p){
  const el=$('score'+p);el.classList.remove('scorePop');void el.offsetWidth;el.classList.add('scorePop');
}
function pulseDeck(){
  $('deck').classList.remove('shufflePulse');void $('deck').offsetWidth;$('deck').classList.add('shufflePulse');
}
async function fly(src,from,to){
  if(!from||!to)return;
  const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();
  const img=document.createElement('img');img.className='flyingCard';img.src=src;img.alt='';
  img.style.left=(a.left+a.width/2-39)+'px';img.style.top=(a.top+a.height/2-58)+'px';
  document.body.appendChild(img);await delay(25);
  img.style.transform=`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(.72)`;
  img.style.opacity='.35';await delay(500);img.remove();
}
async function drawTo(target,type,{score=false}={}){
  await fly(ASSETS[type],$('deck'),target===0?$('handCards'):$('player'+target));
  if(type==='FOOTBALL'||score){
    pulseScore(target);event('+1 FOOTBALL','good');
  }else{
    if(target===0)addCard(type);else{state.counts[target]++;setCounts(state.counts)}
    event(`${target===0?'YOU':`AI ${target}`} DRAWS ${displayName(type)}`,'good');
  }
}
function nextLessonButton(text='Nice work.'){
  state.action=null;clearFocus();
  say(text,{next:()=>{if(state.lesson<LESSONS.length-1)startLesson(state.lesson+1);else finishTutorial()},label:state.lesson===LESSONS.length-1?'FINISH →':'NEXT LESSON →'});
}

function startLesson(index){
  state.lesson=index;state.finalPhase='';resetVisualState();renderProgress();$('handNote').textContent=LESSONS[index][1];
  switch(index){
    case 0:return lesson1();
    case 1:return lesson2();
    case 2:return lesson3();
    case 3:return lesson4();
    case 4:return lesson5();
    case 5:return lesson6();
    case 6:return lesson7();
    case 7:return lesson8();
    case 8:return lesson9();
    case 9:return lesson10();
    case 10:return lesson11();
  }
}

function lesson1(){
  renderHand(['RUN','PASS','TACKLE']);setDeck(33);
  say('Welcome to Casual Mode. Everyone is playing for themselves.',{next:()=>{
    document.querySelectorAll('.seatScore').forEach(x=>focus(x));
    say('The first player to collect 3 footballs wins immediately.',{next:()=>{
      clearFocus();const card=showSingleCard('FOOTBALL','THE CARD YOU WANT');
      setAction('Drawing FOOTBALL is good. Tap it to see what it scores.',({kind,value,el})=>{
        if(kind!=='tableCard'||value!=='FOOTBALL')return wrong('That is not the FOOTBALL CARD. Try the card on the table.',el);
        state.action=null;clearFocus();setScores([1,0,0]);pulseScore(0);event('+1 FOOTBALL','good');
        nextLessonButton('Exactly. FOOTBALL gives you +1. Get 3 and you win.');
      },{focusEl:card,callout:'TAP FOOTBALL'});
    }});
  }});
}
function lesson2(){
  renderHand(['RUN','PASS','TACKLE','BLOCK']);setDeck(28);
  say('Your turn.',{next:()=>say('You may play zero or more Action Cards first.',{next:()=>{
    setAction('When you are done, the normal draw ends your turn. Tap the shared deck.',async ({kind,el})=>{
      if(kind!=='deck')return wrong('That does not end the turn. The normal draw comes from the shared deck.',el);
      state.action=null;clearFocus();setDeck(27);await drawTo(0,'INTERCEPTION');setTurn(1);event('TURN ENDS');
      nextLessonButton('That card joined your hand, and your turn ended.');
    },{focusEl:$('deck'),callout:'NORMAL DRAW'});
  }})});
}
function lesson3(){
  renderHand(['RUN','PASS','TACKLE']);setDeck(24);
  say('Now let’s draw the card everyone wants.',{next:()=>{
    setAction('Tap the shared deck.',async ({kind,el})=>{
      if(kind!=='deck')return wrong('Draw from the shared deck.',el);
      state.action=null;clearFocus();await fly(ASSETS.FOOTBALL,$('deck'),$('score0'));setScores([1,0,0]);pulseScore(0);event('+1 FOOTBALL','good');
      say('Nice. You scored 1 football.',{next:()=>{
        say('Because that was not your 3rd, FOOTBALL goes back into the shared deck.',{next:async()=>{
          showSingleCard('FOOTBALL','SHUFFLING BACK');pulseDeck();event('RESHUFFLE','good');await delay(450);$('tableReveal').innerHTML='';
          say('Keep FOOTBALL off the bottom whenever you reshuffle.',{next:()=>{
            setAction('After the reshuffle, draw one replacement card.',async ({kind,el})=>{
              if(kind!=='deck')return wrong('The replacement card also comes from the shared deck.',el);
              state.action=null;clearFocus();setDeck(23);await drawTo(0,'TACKLE');
              nextLessonButton('That is the full FOOTBALL loop: score it, shuffle it back, then draw again.');
            },{focusEl:$('deck'),callout:'DRAW AGAIN'});
          }});
        }});
      }});
    },{focusEl:$('deck'),callout:'DRAW'});
  }});
}
function lesson4(){
  renderHand(['RUN','PASS','TACKLE','BLOCK']);setDeck(22);setDiscard(0);
  say('RUN gives you one extra draw right now.',{next:()=>{
    const run=highlightCard('RUN');
    setAction('Play RUN.',async ({kind,value,el})=>{
      if(kind!=='card'||value!=='RUN')return wrong(`${displayName(value||'That card')} does something different. We need RUN for this play.`,el);
      state.action=null;clearFocus();removeCard('RUN');showPlayed('YOU','RUN');event('RUN');
      await delay(350);showPlayed('AI 1','INTERCEPTION');setDiscard(state.discard+1);event('RUN CANCELED','bad');
      say('AI 1 answers with INTERCEPTION. Your RUN is canceled.',{next:()=>{
        const block=highlightCard('BLOCK');
        setAction('You can counter that reaction. Play BLOCK.',async ({kind,value,el})=>{
          if(kind!=='card'||value!=='BLOCK')return wrong('BLOCK is the card that cancels INTERCEPTION here.',el);
          state.action=null;clearFocus();removeCard('BLOCK');showPlayed('YOU','BLOCK');event('INTERCEPTION CANCELED','good');
          say('Good. BLOCK cancels INTERCEPTION, so RUN comes back.',{next:async()=>{
            $('normalDrawNote').classList.add('show');setDeck(21);await drawTo(0,'PASS');event('RUN EXTRA DRAW','good');
            setAction('That was only the extra draw. Your normal end-turn draw is still required.',async ({kind,el})=>{
              if(kind!=='deck')return wrong('RUN does not replace the normal draw. Finish with the shared deck.',el);
              state.action=null;clearFocus();setDeck(20);await drawTo(0,'TACKLE');$('normalDrawNote').classList.remove('show');setTurn(1);
              nextLessonButton('Perfect. RUN gives an extra draw, but the normal draw still ends the turn.');
            },{focusEl:$('deck'),callout:'NORMAL DRAW'});
          }});
        },{focusEl:block,callout:'COUNTER'});
      }});
    },{focusEl:run,callout:'PLAY RUN'});
  }});
}
function lesson5(){
  renderHand(['PASS','RUN','TACKLE','BLITZ']);setDeck(20);
  say('PASS lets you look at the top 3 cards without changing their order.',{next:()=>{
    const pass=highlightCard('PASS');
    setAction('Play PASS.',({kind,value,el})=>{
      if(kind!=='card'||value!=='PASS')return wrong('We are practicing PASS. Try the PASS card.',el);
      state.action=null;clearFocus();removeCard('PASS');showPlayed('YOU','PASS');showPeek(['BLOCK','FOOTBALL','TACKLE']);
      setAction('These are the top 3. Draw the top card only.',async ({kind,value,el})=>{
        if(kind!=='peek')return wrong('Choose from the three cards PASS revealed.',el);
        if(value!==0)return wrong('PASS does not let you choose or reorder. You must draw the top card.',el);
        state.action=null;clearFocus();$('peekRow').classList.remove('show');setDeck(19);await drawTo(0,'BLOCK');
        nextLessonButton('Exactly. PASS shows 3, but you only draw the top one.');
      },{focusEl:$('peekRow').querySelector('[data-peek="0"]'),callout:'TOP CARD'});
    },{focusEl:pass,callout:'PLAY PASS'});
  }});
}
function lesson6(){
  renderHand(['INTERCEPTION','RUN','PASS','TACKLE']);setDiscard(1);showPlayed('AI 1','RUN');focus($('player1'),'AI ACTION');
  say('AI 1 plays RUN and is about to take an extra draw.',{next:()=>{
    clearFocus();const inter=highlightCard('INTERCEPTION');
    setAction('Stop RUN before it resolves.',({kind,value,el})=>{
      if(kind!=='card'||value!=='INTERCEPTION')return wrong('Only INTERCEPTION can cancel RUN in this reaction window.',el);
      state.action=null;clearFocus();removeCard('INTERCEPTION');event('RUN CANCELED','good');$('tableReveal').innerHTML='';
      say('Good. INTERCEPTION can cancel RUN or PASS.',{next:()=>{
        addCard('INTERCEPTION');setTurn(2,'AI 2 DRAWING');event('AI 2 NORMAL DRAW');const nextInter=highlightCard('INTERCEPTION','REACTION');
        setAction('It can also cancel one draw. AI 2 is about to draw.',({kind,value,el})=>{
          if(kind!=='card'||value!=='INTERCEPTION')return wrong('To cancel a draw, use INTERCEPTION.',el);
          state.action=null;clearFocus();removeCard('INTERCEPTION');event('DRAW CANCELED','good');
          nextLessonButton('Exactly. INTERCEPTION cancels RUN, PASS, or one draw.');
        },{focusEl:nextInter,callout:'CANCEL DRAW'});
      }});
    },{focusEl:inter,callout:'INTERCEPT'});
  }});
}
function lesson7(){
  renderHand(['TACKLE','PASS','BLOCK','RUN']);setCounts([4,5,5]);
  say('TACKLE takes one random Action Card from another player.',{next:()=>{
    const tackle=highlightCard('TACKLE');
    setAction('Play TACKLE.',({kind,value,el})=>{
      if(kind!=='card'||value!=='TACKLE')return wrong('We need TACKLE for this steal.',el);
      state.action=null;clearFocus();removeCard('TACKLE');showPlayed('YOU','TACKLE');
      setAction('Choose another player as the target.',async ({kind,value,el})=>{
        if(kind!=='player')return wrong('TACKLE needs a player target.',el);
        if(value===0)return wrong('You cannot TACKLE yourself. Choose another player.',el);
        state.action=null;clearFocus();state.counts[value]--;setCounts(state.counts);await fly(ASSETS.PASS,$('player'+value),$('handCards'));addCard('PASS');event('RANDOM CARD TAKEN','good');
        say('You do not choose the stolen card. The Action Card is random.',{next:()=>{
          showPlayed('AI 1','TACKLE');setDiscard(state.discard+1);setTurn(1,'AI 1 TARGETS YOU');event('TACKLE → YOU','bad');const block=highlightCard('BLOCK');
          setAction('AI 1 uses TACKLE on you. Stop it with BLOCK.',({kind,value,el})=>{
            if(kind!=='card'||value!=='BLOCK')return wrong('BLOCK is the reaction that cancels TACKLE.',el);
            state.action=null;clearFocus();removeCard('BLOCK');event('TACKLE CANCELED','good');$('tableReveal').innerHTML='';
            nextLessonButton('Exactly. BLOCK stops TACKLE, so no card leaves your hand.');
          },{focusEl:block,callout:'BLOCK IT'});
        }});
      });
    },{focusEl:tackle,callout:'PLAY TACKLE'});
  }});
}
function lesson8(){
  renderHand(['BLITZ','RUN','PASS','TACKLE']);setDeck(18);
  say('BREAK THROUGH chooses another player and makes that player draw one extra card.',{next:()=>{
    const blitz=highlightCard('BLITZ','PLAY THIS');
    setAction('Play BREAK THROUGH.',({kind,value,el})=>{
      if(kind!=='card'||value!=='BLITZ')return wrong('We are practicing BREAK THROUGH. Try that card.',el);
      state.action=null;clearFocus();removeCard('BLITZ');showPlayed('YOU','BLITZ');
      setAction('Choose another player to take the extra draw.',async ({kind,value,el})=>{
        if(kind!=='player')return wrong('BREAK THROUGH needs another player as its target.',el);
        if(value===0)return wrong('Choose another player, not yourself.',el);
        state.action=null;clearFocus();setDeck(17);await drawTo(value,'RUN');event(`AI ${value} DRAWS 1 EXTRA`,'good');
        nextLessonButton('Good. That extra draw can still be canceled by INTERCEPTION because it is a draw.');
      });
    },{focusEl:blitz,callout:'BREAK THROUGH'});
  }});
}
function lesson9(){
  renderHand(['RUN','PASS','TACKLE']);setDeck(10);setDiscard(7);
  focus($('deckCount'));say('The shared draw pile is down to 10 cards.',{next:()=>{
    clearFocus();focus($('discardPile'),'RECYCLE');
    setAction('At 10 or fewer, all discarded Action Cards must go back in. Tap the discard pile to watch it happen.',async ({kind,el})=>{
      if(kind!=='discard')return wrong('The discard pile is what gets recycled into the shared deck.',el);
      state.action=null;clearFocus();event('RECYCLING DISCARDS','good');
      for(let i=0;i<3;i++){await fly(ASSETS[['RUN','PASS','BLOCK'][i]],$('discardPile'),$('deck'))}
      setDeck(17);setDiscard(0);pulseDeck();await delay(300);
      say('Right. Do not wait for the deck to run out.',{next:()=>{
        event('FOOTBALL NOT ON BOTTOM','good');nextLessonButton('Whenever you reshuffle, keep FOOTBALL off the bottom of the deck.');
      }});
    },{focusEl:$('discardPile'),callout:'TAP DISCARD'});
  }});
}
function lesson10(){
  renderHand(['RUN','PASS','TACKLE']);setScores([2,1,0]);focus($('score0'),'2 / 3');
  say('You already have 2 footballs.',{next:()=>{
    clearFocus();setAction('Who wins immediately after drawing one more FOOTBALL? Tap that player.',({kind,value,el})=>{
      if(kind!=='player')return wrong('Tap a player score.',el);
      if(value!==0)return wrong('Look at the scores. YOU are already at 2 / 3.',el);
      state.action=null;clearFocus();focus($('score0'),'ONE AWAY');event('1 FOOTBALL FROM WINNING','good');
      nextLessonButton('Exactly. Your 3rd football wins immediately.');
    });
  }});
}

function resetFinalOwnTurn(){
  state.finalPhase='own';
  setTurn(0);setScores([2,2,0]);setCounts([5,5,5]);setDeck(12);setDiscard(3);
  renderHand(['PASS','RUN','TACKLE','BLOCK','BLITZ']);$('peekRow').classList.remove('show');$('tableReveal').innerHTML='';event('YOUR TURN','good');$('normalDrawNote').classList.remove('show');
  state.prompt='Your turn. You also have 2 footballs. Make the call.';
  state.action=finalOwnHandler;say(state.prompt,{wait:true});
}
function finalOwnHandler({kind,value,el}){
  if(kind==='deck')return finalBadNormalDraw();
  if(kind!=='card')return wrong('Make a play from your hand, or choose the normal draw.',el);
  if(value==='BLOCK')return wrong('BLOCK is a reaction card. There is nothing to BLOCK right now.',el);
  if(value==='TACKLE'){
    removeCard('TACKLE');showPlayed('YOU','TACKLE');
    setAction('Choose a TACKLE target.',({kind,value,el})=>{
      if(kind!=='player'||value===0)return wrong('TACKLE must target another player.',el);
      event('LEGAL PLAY · NO SCORE');state.action=null;
      say('Legal play, but it does not move you toward the winning football.',{next:resetFinalOwnTurn,label:'TRY AGAIN →'});
    });
    return;
  }
  if(value==='BLITZ'){
    removeCard('BLITZ');showPlayed('YOU','BLITZ');
    setAction('Choose a BREAK THROUGH target.',({kind,value,el})=>{
      if(kind!=='player'||value===0)return wrong('BREAK THROUGH must target another player.',el);
      event(`AI ${value} GETS AN EXTRA DRAW`,'bad');state.action=null;
      say('Legal play, but giving an opponent an extra draw is risky here.',{next:resetFinalOwnTurn,label:'TRY AGAIN →'});
    });
    return;
  }
  if(value==='PASS')return finalPass();
  if(value==='RUN')return finalRun();
}
async function finalBadNormalDraw(){
  state.action=null;clearFocus();setDeck(11);await drawTo(0,'TACKLE');setTurn(1);event('TURN ENDS','bad');
  say('That was legal, but you ended your turn while AI 1 is still one football from winning.',{next:resetFinalOwnTurn,label:'TRY AGAIN →'});
}
function finalPass(){
  state.action=null;removeCard('PASS');showPlayed('YOU','PASS');showPeek(['TACKLE','FOOTBALL','BLOCK'],false);
  state.prompt='PASS revealed the top 3. Resolve it correctly.';
  state.action=async ({kind,value,el})=>{
    if(kind!=='peek')return wrong('Resolve the three cards PASS revealed.',el);
    if(value!==0)return wrong('PASS does not let you choose. Draw the top card only.',el);
    state.action=null;$('peekRow').classList.remove('show');setDeck(11);await drawTo(0,'TACKLE');$('normalDrawNote').classList.add('show');
    finalWinningDrawPrompt('PASS is done. Your normal end-turn draw still remains.');
  };
  say(state.prompt,{wait:true});
}
async function finalRun(){
  state.action=null;removeCard('RUN');showPlayed('YOU','RUN');setDeck(11);await drawTo(0,'TACKLE');$('normalDrawNote').classList.add('show');
  finalWinningDrawPrompt('RUN gave you the extra draw. Your normal end-turn draw still remains.');
}
function finalWinningDrawPrompt(text){
  state.prompt=text;state.action=async ({kind,el})=>{
    if(kind!=='deck')return wrong('Finish the turn with the normal draw from the shared deck.',el);
    state.action=null;clearFocus();setDeck(10);await fly(ASSETS.FOOTBALL,$('deck'),$('score0'));setScores([3,2,0]);pulseScore(0);event('3 / 3 · YOU WIN','good');$('normalDrawNote').classList.remove('show');
    say('Touchdown moment. That is your 3rd football, so the game ends immediately.',{next:finishTutorial,label:'FINISH TUTORIAL →'});
  };
  say(text,{wait:true});
}
function lesson11(){
  renderHand(['INTERCEPTION','PASS','RUN','TACKLE','BLOCK','BLITZ']);setScores([2,2,0]);setDeck(13);setDiscard(2);setTurn(1,'AI 1 ABOUT TO DRAW');event('AI 1 IS ONE SCORE FROM WINNING','bad');
  say('Final Challenge. AI 1 has 2 footballs and is about to draw.',{next:()=>{
    state.prompt='Stop the win, then finish the game yourself.';
    state.action=({kind,value,el})=>{
      if(kind!=='card')return wrong('This is a reaction window. Use a card from your hand.',el);
      if(value!=='INTERCEPTION'){
        if(value==='BLOCK')return wrong('BLOCK cannot cancel a draw. It cancels INTERCEPTION or TACKLE.',el);
        return wrong('That is not a legal reaction to another player’s draw.',el);
      }
      state.action=null;removeCard('INTERCEPTION');event('AI 1 DRAW CANCELED','good');showPlayed('YOU','INTERCEPTION');
      say('Great stop.',{next:resetFinalOwnTurn});
    };
    say(state.prompt,{wait:true});
  }});
}

function finishTutorial(){
  state.action=null;clearFocus();$('done').classList.add('show');$('done').setAttribute('aria-hidden','false');
}
function buildPicker(){
  const root=$('lessonGrid');root.innerHTML='';
  LESSONS.forEach((l,i)=>{
    const b=document.createElement('button');b.className='lessonPick';b.type='button';
    b.innerHTML=`<b>LESSON ${i+1}</b>${l[0]}`;b.onclick=()=>{$('lessonModal').classList.remove('show');$('lessonModal').setAttribute('aria-hidden','true');startLesson(i)};
    root.appendChild(b);
  });
}
function restart(){
  $('done').classList.remove('show');$('done').setAttribute('aria-hidden','true');$('lessonModal').classList.remove('show');startLesson(0);
}
$('deck').onclick=()=>dispatch('deck',null,$('deck'));
$('discardPile').onclick=()=>dispatch('discard',null,$('discardPile'));
document.querySelectorAll('.playerSeat').forEach((el,i)=>el.onclick=()=>dispatch('player',i,el));
$('chooseBtn').onclick=()=>{buildPicker();$('lessonModal').classList.add('show');$('lessonModal').setAttribute('aria-hidden','false')};
$('closeLessonBtn').onclick=()=>{$('lessonModal').classList.remove('show');$('lessonModal').setAttribute('aria-hidden','true')};
$('restartBtn').onclick=restart;$('restartModalBtn').onclick=restart;$('againBtn').onclick=restart;
$('bootRetry').onclick=()=>{location.reload()};
buildPicker();boot();
})();