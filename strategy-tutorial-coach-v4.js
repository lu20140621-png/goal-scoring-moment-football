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
const LESSONS = [
  ['The Goal','Learn the match goal, teams, and hand sizes.'],
  ['Possession','The FOOTBALL CARD stays with its carrier. A teammate receives it only after a successful PASS.'],
  ['Who Starts?','Use Rock-Paper-Scissors for Round 1.'],
  ['Who Can Act?','Only the current ball carrier may start RUN or PASS.'],
  ['RUN','Start a running play and resolve success.'],
  ['RUN Defense Chain','TACKLE, BLOCK, then the final BREAK THROUGH window.'],
  ['PASS','Choose a receiver and move possession on success.'],
  ['PASS Defense Chain','INTERCEPTION, BLOCK, and BREAK THROUGH.'],
  ['Interception','A successful interception changes possession immediately.'],
  ['QB Skill','Use the QB PASS skill once per game.'],
  ['No Free Handoff','A teammate cannot become the carrier just because the current carrier runs out of offense.'],
  ['Touchdown & Rounds','Score, redeal, alternate first offense, and race to 3.'],
  ['Final Challenge','Read the field and finish a real sequence without card hints.']
];

const state = {
  lesson:0, typing:false, timer:0, fullText:'', next:null, action:null, prompt:'',
  wrongLocked:false, hand:[], holder:'r1', redTD:0, blueTD:0, redProgress:0, blueProgress:0,
  round:1, firstOffense:'RED', finalPhase:''
};

const delay = ms => new Promise(r=>setTimeout(r,ms));
const displayName = t => t === 'BLITZ' ? 'BREAK THROUGH' : t;
const playerName = id => ({r1:'R1',r2:'R2',b1:'B1',b2:'B2'})[id] || id.toUpperCase();

function loadImage(src){
  return new Promise((resolve,reject)=>{
    const img = new Image();
    const timer = setTimeout(()=>reject(new Error('Timeout: '+src)),12000);
    img.onload=()=>{clearTimeout(timer);resolve(src)};
    img.onerror=()=>{clearTimeout(timer);reject(new Error('Failed: '+src))};
    img.src=src;
  });
}
function setProgress(done,total){
  const pct=Math.max(0,Math.min(100,Math.round(done/total*100)));
  $('bootBar').style.width=pct+'%';
  $('bootPct').textContent=pct+'%';
  $('bootText').textContent=done===total?'Ready!':`Loading assets ${done} / ${total}`;
}
async function boot(){
  const list=[...Object.values(ASSETS),COACH_IMG];
  let done=0; setProgress(0,list.length);
  try{
    await Promise.all(list.map(src=>loadImage(src).then(()=>setProgress(++done,list.length))));
    if(document.fonts?.ready) await document.fonts.ready;
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

function renderProgress(){
  $('lessonNo').textContent=`LESSON ${state.lesson+1} / ${LESSONS.length}`;
  $('lessonTitle').textContent=LESSONS[state.lesson][0];
  $('stepbar').innerHTML=LESSONS.map((_,i)=>`<i class="${i<state.lesson?'done':i===state.lesson?'on':''}"></i>`).join('');
}
function setTD(red,blue){
  state.redTD=red; state.blueTD=blue;
  $('redScore').textContent=`🏈 ${red} / 3`;
  $('blueScore').textContent=`🏈 ${blue} / 3`;
}
function setRound(round,first='RED'){
  state.round=round; state.firstOffense=first;
  $('roundInfo').textContent=`ROUND ${round} · ${first} FIRST OFFENSE`;
}
function setDrive(team,progress){
  progress=Math.max(0,Math.min(4,progress));
  if(team==='RED') state.redProgress=progress; else state.blueProgress=progress;
  const values=['50','40','30','20','10'];
  const text=progress>=4?'10 → TD':values[progress];
  $((team==='RED'?'red':'blue')+'Yard').textContent=`${text} YD`;
  const root=$((team==='RED'?'red':'blue')+'DriveDots');
  root.innerHTML=[0,1,2,3].map(i=>`<i class="${i<progress?'on':''}"></i>`).join('');
}
function setHolder(id){
  state.holder=id;
  document.querySelectorAll('.playerSeat').forEach(el=>{
    el.classList.toggle('holder',el.dataset.player===id);
    el.querySelector('.ballMini')?.remove();
  });
  const seat=document.querySelector(`[data-player="${id}"]`);
  if(seat){
    const img=document.createElement('img');
    img.className='ballMini'; img.src=ASSETS.FOOTBALL; img.alt='FOOTBALL CARD';
    seat.appendChild(img);
  }
  $('possessionText').textContent=`POSSESSION · ${playerName(id)}`;
}
function event(text,tone=''){
  $('eventBanner').textContent=text;
  $('eventBanner').className='eventBanner '+tone;
}
function clearFocus(){
  document.querySelectorAll('.focus,.dim,.wrong,.target').forEach(el=>el.classList.remove('focus','dim','wrong','target'));
  document.querySelectorAll('[data-callout]').forEach(el=>el.removeAttribute('data-callout'));
}
function focus(el,label=''){
  if(!el)return;
  el.classList.add('focus');
  if(label)el.dataset.callout=label;
}
function focusOnly(el,label=''){
  clearFocus();
  document.querySelectorAll('.playerSeat,.cardBtn,.choiceBtn,.driveBox').forEach(x=>{if(x!==el)x.classList.add('dim')});
  focus(el,label);
}
function focusPlayers(ids,label='TARGET'){
  clearFocus();
  document.querySelectorAll('.playerSeat').forEach(el=>{
    if(ids.includes(el.dataset.player)){el.classList.add('focus','target');el.dataset.callout=label;}
    else el.classList.add('dim');
  });
}
function resetBoard(){
  clearTimeout(state.timer);
  state.typing=false; state.next=null; state.action=null; state.prompt=''; state.wrongLocked=false; state.finalPhase='';
  clearFocus(); event('');
  $('tableReveal').innerHTML=''; $('contextActions').innerHTML='';
  setTD(0,0); setRound(1,'RED'); setDrive('RED',0); setDrive('BLUE',0); setHolder('r1');
  renderHand([]);
}
function typeText(text,done){
  const out=$('guideText');
  state.fullText=text; state.typing=true; out.textContent=''; clearTimeout(state.timer);
  let i=0;
  const tick=()=>{
    out.textContent=text.slice(0,++i);
    if(i<text.length) state.timer=setTimeout(tick,13);
    else {state.typing=false;done?.();}
  };
  tick();
}
function say(text,{next=null,label='›',wait=false}={}){
  state.next=next;
  const btn=$('guideContinue');
  btn.hidden=true; btn.textContent=label; btn.classList.toggle('wide',label.length>2);
  typeText(text,()=>{btn.hidden=wait||!next;});
}
function finishTyping(){
  clearTimeout(state.timer);
  $('guideText').textContent=state.fullText;
  state.typing=false;
  $('guideContinue').hidden=!state.next || !!state.action;
}
function onContinue(){
  if(state.typing){finishTyping();return}
  if(state.next){const fn=state.next; state.next=null; fn();}
}
$('guideDialogue').addEventListener('click',e=>{if(e.target.closest('button'))return;onContinue()});
$('guideDialogue').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();onContinue()}});
$('guideContinue').onclick=e=>{e.stopPropagation();onContinue()};

function setAction(prompt,handler,{focusEl=null,callout='',targets=null}={}){
  state.prompt=prompt; state.action=handler; state.next=null;
  say(prompt,{wait:true});
  if(focusEl) focusOnly(focusEl,callout);
  if(targets) focusPlayers(targets,callout||'TARGET');
}
function dispatch(kind,value,el){
  if(state.wrongLocked)return;
  if(!state.action){wrong('Not yet. Follow the coach first.',el);return}
  state.action({kind,value,el});
}
function wrong(message,el){
  if(state.wrongLocked)return;
  state.wrongLocked=true;
  if(el){el.classList.remove('wrong');void el.offsetWidth;el.classList.add('wrong')}
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
  const root=$('handCards'); root.innerHTML='';
  types.forEach((type,index)=>{
    const b=document.createElement('button');
    b.className='cardBtn'; b.type='button'; b.dataset.type=type; b.dataset.index=index;
    b.innerHTML=`<img src="${ASSETS[type]}" alt="${displayName(type)} card"><span>${displayName(type)}</span>`;
    b.onclick=()=>dispatch('card',type,b);
    root.appendChild(b);
  });
}
function removeCard(type){
  const i=state.hand.indexOf(type); if(i>=0) state.hand.splice(i,1);
  renderHand(state.hand);
}
function highlightCard(type,label='PLAY THIS'){
  const el=[...document.querySelectorAll('.cardBtn')].find(x=>x.dataset.type===type);
  focusOnly(el,label); return el;
}
function addChoice(label,value,tone=''){
  const b=document.createElement('button');
  b.className='choiceBtn '+tone; b.type='button'; b.textContent=label;
  b.onclick=()=>dispatch('choice',value,b);
  $('contextActions').appendChild(b);
  return b;
}
function showPlayed(who,type){
  $('tableReveal').innerHTML=`<div class="played"><b>${who} PLAYED</b><img src="${ASSETS[type]}" alt="${displayName(type)} card"><span>${displayName(type)}</span></div>`;
}
function showChain(items,result=''){
  $('tableReveal').innerHTML=`<div class="chain">${items.map((x,i)=>`${i?'<em>→</em>':''}<div><img src="${ASSETS[x]}" alt="${displayName(x)}"><span>${displayName(x)}</span></div>`).join('')}${result?`<strong>${result}</strong>`:''}</div>`;
}
async function fly(src,from,to){
  if(!from||!to)return;
  const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();
  const img=document.createElement('img'); img.className='flyingCard'; img.src=src; img.alt='';
  img.style.left=(a.left+a.width/2-35)+'px'; img.style.top=(a.top+a.height/2-52)+'px';
  document.body.appendChild(img); await delay(20);
  img.style.transform=`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(.72)`;
  img.style.opacity='.3'; await delay(470); img.remove();
}
async function moveFootball(fromId,toId){
  const from=document.querySelector(`[data-player="${fromId}"]`);
  const to=document.querySelector(`[data-player="${toId}"]`);
  await fly(ASSETS.FOOTBALL,from,to);
  setHolder(toId);
}
function nextLesson(text='Nice work.'){
  state.action=null; clearFocus();
  say(text,{next:()=>{if(state.lesson<LESSONS.length-1)startLesson(state.lesson+1);else finishTutorial()},label:state.lesson===LESSONS.length-1?'FINISH →':'NEXT LESSON →'});
}

function startLesson(index){
  state.lesson=index;
  resetBoard(); renderProgress();
  $('handNote').textContent=LESSONS[index][1];
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
    case 11:return lesson12();
    case 12:return lesson13();
  }
}

function lesson1(){
  setHolder('r1'); setTD(0,0); setDrive('RED',0); setDrive('BLUE',0);
  say('Welcome to Strategy Mode.',{next:()=>{
    document.querySelectorAll('.teamBox').forEach(x=>focus(x));
    say('Red plays Blue. First team to score 3 touchdowns wins.',{next:()=>{
      clearFocus(); focus($('handSizeInfo'),'SETUP');
      say('Choose 2v2, 3v3, or 4v4 before the match. Each team has one QB.',{next:()=>{
        say('Deal 7, 6, or 5 Action Cards per player. No mid-round refills.',{next:()=>{
          nextLesson('That is the match frame. Now let’s track possession.');
        }});
      }});
    }});
  }});
}

function lesson2(){
  setHolder('r1');
  renderHand(['RUN','PASS','BLOCK']);
  say('There is exactly one FOOTBALL CARD in the match.',{next:()=>{
    const r1=document.querySelector('[data-player="r1"]');
    const r2=document.querySelector('[data-player="r2"]');
    focusOnly(r1,'POSSESSION');
    say('R1 has it, so R1 is the ball carrier.',{next:()=>{
      clearFocus();
      r2?.classList.add('wrong');
      event('NO FREE HANDOFF','bad');
      say('R2 cannot take the FOOTBALL CARD just because you tap R2.',{next:()=>{
        r2?.classList.remove('wrong');
        focusOnly(r1,'STAYS WITH R1');
        say('R1 keeps possession until a PASS succeeds. Then the FOOTBALL CARD moves to the receiver.',{next:()=>{
          clearFocus();event('');
          nextLesson('Remember it: RUN keeps the same carrier. A successful PASS changes the same-team carrier. A successful INTERCEPTION can move possession to the defender.');
        }});
      }});
    }});
  }});
}

function lesson3(){
  $('contextActions').innerHTML='';
  const rock=addChoice('✊ ROCK','rock','gold');
  addChoice('🖐 PAPER','paper');
  addChoice('✌ SCISSORS','scissors');
  say('Round 1 starts with Rock-Paper-Scissors.',{next:()=>{
    setAction('Win this tutorial toss. Choose Rock.',({kind,value,el})=>{
      if(kind!=='choice'||value!=='rock')return wrong('For this tutorial, Rock is the winning call.',el);
      state.action=null; clearFocus(); event('RED WINS FIRST OFFENSE','good'); setRound(1,'RED');
      nextLesson('Only Round 1 uses Rock-Paper-Scissors. Later rounds alternate first offense.');
    },{focusEl:rock,callout:'CHOOSE ROCK'});
  }});
}

function lesson4(){
  renderHand(['RUN','PASS','BLOCK']); setHolder('r1');
  say('Red has first offense, and R1 has the FOOTBALL CARD.',{next:()=>{
    say('Only the current ball carrier can start RUN or PASS.',{next:()=>{
      setAction('Tap the player who must act with the ball.',({kind,value,el})=>{
        if(kind!=='player')return wrong('Choose a player on the field.',el);
        if(value==='r2')return wrong('R2 is a teammate, but R2 does not have the FOOTBALL CARD. A successful PASS is required before R2 becomes the carrier.',el);
        if(value!=='r1')return wrong('That player does not have Red possession. Choose R1.',el);
        state.action=null;clearFocus();event('R1 IS THE BALL CARRIER','good');
        nextLesson('Correct. R1 stays the carrier. You cannot switch to R2 by tapping R2; use PASS to change the same-team carrier.');
      },{targets:['r1','r2'],callout:'WHO HAS THE BALL?'});
    }});
  }});
}

function lesson5(){
  setHolder('r1'); renderHand(['RUN','PASS','BLOCK']); setDrive('RED',0);
  say('R1 has possession.',{next:()=>{
    const run=highlightCard('RUN','OFFENSE');
    setAction('Start a running play.',async ({kind,value,el})=>{
      if(kind!=='card'||value!=='RUN')return wrong('PASS is also offense, but we are practicing RUN first.',el);
      state.action=null;clearFocus();removeCard('RUN');showPlayed('R1','RUN');event('RUN IN PROGRESS');
      say('Blue chooses not to defend this one.',{next:async()=>{
        setDrive('RED',1);event('RUN SUCCESS · RED 50 → 40','good');
        nextLesson('A successful RUN advances 1 step. R1 keeps the FOOTBALL CARD.');
      }});
    },{focusEl:run,callout:'PLAY RUN'});
  }});
}

function lesson6(){
  setHolder('r1'); renderHand(['RUN','PASS','BLOCK']); setDrive('RED',1);
  say('Against RUN, Blue can answer with TACKLE or BREAK THROUGH.',{next:()=>{
    const run=highlightCard('RUN');
    setAction('Play RUN.',({kind,value,el})=>{
      if(kind!=='card'||value!=='RUN')return wrong('Use RUN for this defense-chain lesson.',el);
      state.action=null;removeCard('RUN');showPlayed('R1','RUN');event('RUN');
      say('Blue plays TACKLE. TACKLE stops RUN, but it does not steal possession.',{next:()=>{
        showChain(['RUN','TACKLE'],'RUN STOPPED');
        const block=highlightCard('BLOCK','COUNTER');
        setAction('Cancel the TACKLE with BLOCK.',({kind,value,el})=>{
          if(kind!=='card'||value!=='BLOCK')return wrong('BLOCK is the card that cancels TACKLE here.',el);
          state.action=null;removeCard('BLOCK');showChain(['RUN','TACKLE','BLOCK'],'TACKLE CANCELED');
          say('One BLOCK is allowed on this offensive play.',{next:()=>{
            $('contextActions').innerHTML='';
            const no=addChoice('NO BREAK THROUGH','no','gold');
            addChoice('USE BREAK THROUGH','yes');
            setAction('Blue has one final defense window. Choose No BREAK THROUGH.',({kind,value,el})=>{
              if(kind!=='choice'||value!=='no')return wrong('BREAK THROUGH would directly stop the RUN. Choose No BREAK THROUGH for this success example.',el);
              state.action=null;clearFocus();setDrive('RED',2);event('RUN SUCCESS · RED 40 → 30','good');
              nextLesson('Right. BREAK THROUGH directly stops RUN or PASS, including after BLOCK.');
            },{focusEl:no,callout:'NO FINAL DEFENSE'});
          }});
        },{focusEl:block,callout:'PLAY BLOCK'});
      }});
    },{focusEl:run,callout:'PLAY RUN'});
  }});
}

function lesson7(){
  setHolder('r1');renderHand(['PASS','RUN','BLOCK']);setDrive('RED',0);
  say('Now R1 has the ball.',{next:()=>{
    const pass=highlightCard('PASS','OFFENSE');
    setAction('Play PASS.',({kind,value,el})=>{
      if(kind!=='card'||value!=='PASS')return wrong('Use PASS for this lesson.',el);
      state.action=null;removeCard('PASS');showPlayed('R1','PASS');
      setAction('Choose a Red teammate as the receiver.',async ({kind,value,el})=>{
        if(kind!=='player')return wrong('A PASS needs a teammate receiver.',el);
        if(value!=='r2')return wrong(value==='r1'?'R1 is the passer. Choose the teammate receiver.':'That player is on Blue. Choose R2.',el);
        state.action=null;clearFocus();event('R2 TARGETED');
        say('Blue does not defend this PASS.',{next:async()=>{
          await moveFootball('r1','r2');setDrive('RED',1);event('PASS COMPLETE · POSSESSION → R2','good');
          nextLesson('That is how a teammate becomes the new carrier: the PASS succeeds, then the FOOTBALL CARD moves to R2.');
        }});
      },{targets:['r2'],callout:'RECEIVER'});
    },{focusEl:pass,callout:'PLAY PASS'});
  }});
}

function lesson8(){
  setHolder('r1');renderHand(['PASS','RUN','BLOCK']);setDrive('RED',1);
  say('Against PASS, Blue can answer with INTERCEPTION or BREAK THROUGH.',{next:()=>{
    const pass=highlightCard('PASS');
    setAction('Play PASS.',({kind,value,el})=>{
      if(kind!=='card'||value!=='PASS')return wrong('Use PASS for this reaction chain.',el);
      state.action=null;removeCard('PASS');showPlayed('R1','PASS');
      setAction('Choose R2 as the receiver.',({kind,value,el})=>{
        if(kind!=='player'||value!=='r2')return wrong('Choose your teammate R2.',el);
        state.action=null;clearFocus();showChain(['PASS','INTERCEPTION'],'PASS THREATENED');
        say('Blue plays INTERCEPTION. INTERCEPTION only responds to PASS.',{next:()=>{
          const block=highlightCard('BLOCK','COUNTER');
          setAction('Cancel INTERCEPTION with BLOCK.',({kind,value,el})=>{
            if(kind!=='card'||value!=='BLOCK')return wrong('BLOCK cancels INTERCEPTION here.',el);
            state.action=null;removeCard('BLOCK');showChain(['PASS','INTERCEPTION','BLOCK'],'INTERCEPTION CANCELED');
            say('Blue could still use BREAK THROUGH as the final defense.',{next:()=>{
              $('contextActions').innerHTML='';
              const no=addChoice('NO BREAK THROUGH','no','gold');addChoice('USE BREAK THROUGH','yes');
              setAction('Let the PASS succeed. Choose No BREAK THROUGH.',async ({kind,value,el})=>{
                if(kind!=='choice'||value!=='no')return wrong('BREAK THROUGH would directly stop the PASS.',el);
                state.action=null;clearFocus();await moveFootball('r1','r2');setDrive('RED',2);event('PASS SUCCESS · RED 40 → 30','good');
                nextLesson('Exactly. PASS → INTERCEPTION → BLOCK → no BREAK THROUGH means the PASS succeeds and R2 receives the FOOTBALL CARD.');
              },{focusEl:no,callout:'NO FINAL DEFENSE'});
            }});
          },{focusEl:block,callout:'PLAY BLOCK'});
        }});
      },{targets:['r2'],callout:'RECEIVER'});
    },{focusEl:pass,callout:'PLAY PASS'});
  }});
}

function lesson9(){
  setHolder('r1');renderHand(['PASS','RUN']);setDrive('RED',2);setDrive('BLUE',1);
  say('Now watch the other branch.',{next:()=>{
    showChain(['PASS','INTERCEPTION'],'INTERCEPTION SUCCESS');
    say('R1 passes. B1 intercepts, and Red has no BLOCK.',{next:()=>{
      setAction('Tap B1 to complete the possession change.',async ({kind,value,el})=>{
        if(kind!=='player'||value!=='b1')return wrong('B1 made the interception. Move possession to B1.',el);
        state.action=null;clearFocus();await moveFootball('r1','b1');event('POSSESSION → BLUE B1','bad');
        nextLesson('Correct. A successful INTERCEPTION changes possession to the defender. That is a turnover, not a same-team handoff.');
      },{targets:['b1'],callout:'INTERCEPTOR'});
    }});
  }});
}

function lesson10(){
  setHolder('r2');renderHand(['PASS','RUN']);setDrive('RED',1);
  document.querySelector('[data-player="r2"]').classList.add('qbGlow');
  say('For this example, R2 starts with the FOOTBALL CARD. R2 is Red’s QB.',{next:()=>{
    say('The QB skill can be used once per game on a PASS.',{next:()=>{
      const pass=highlightCard('PASS');
      setAction('Play PASS.',({kind,value,el})=>{
        if(kind!=='card'||value!=='PASS')return wrong('The QB skill applies to PASS, so play PASS.',el);
        state.action=null;removeCard('PASS');showPlayed('R2','PASS');
        setAction('Choose R1 as the receiver.',({kind,value,el})=>{
          if(kind!=='player'||value!=='r1')return wrong('Choose teammate R1 as the receiver.',el);
          state.action=null;clearFocus();$('contextActions').innerHTML='';
          const use=addChoice('USE QB SKILL','use','gold');addChoice('SAVE IT','save');
          setAction('Use the QB skill for this PASS.',({kind,value,el})=>{
            if(kind!=='choice'||value!=='use')return wrong('Use the skill in this demonstration.',el);
            state.action=null;clearFocus();setDrive('RED',3);event('QB PASS SUCCESS · ADVANCE 2','good');
            nextLesson('If that PASS succeeds, it advances 2 steps. If it fails, the once-per-game skill is still spent.');
          },{focusEl:use,callout:'USE ONCE'});
        },{targets:['r1'],callout:'RECEIVER'});
      },{focusEl:pass,callout:'QB PASS'});
    }});
  }});
}

function lesson11(){
  setHolder('r1');renderHand(['BLOCK','TACKLE']);setDrive('RED',2);setDrive('BLUE',1);
  say('Mid-round, nobody refills their hand.',{next:()=>{
    say('R1 has the FOOTBALL CARD but no RUN or PASS, so R1 cannot start another offensive play.',{next:()=>{
      const r2=document.querySelector('[data-player="r2"]');
      clearFocus();
      r2?.classList.add('wrong');
      event('NO FREE HANDOFF','bad');
      say('R2 still cannot receive the FOOTBALL CARD for free.',{next:()=>{
        r2?.classList.remove('wrong');
        $('contextActions').innerHTML='';
        const passAnswer=addChoice('A SUCCESSFUL PASS','pass','gold');
        addChoice('JUST TAP R2','handoff');
        setAction('What would legally make R2 the new same-team carrier?',({kind,value,el})=>{
          if(kind!=='choice')return wrong('Choose one answer.',el);
          if(value!=='pass')return wrong('No free handoff. Tapping R2 never transfers same-team possession.',el);
          state.action=null;clearFocus();event('PASS REQUIRED','good');
          nextLesson('Correct. Same-team possession changes only when a PASS succeeds. If R1 has no RUN or PASS, do not move the ball to R2 for free.');
        },{focusEl:passAnswer,callout:'CHOOSE'});
      }});
    }});
  }});
}

function lesson12(){
  setHolder('r1');setTD(2,1);setDrive('RED',3);setDrive('BLUE',2);renderHand(['RUN','PASS']);
  say('Red already has 3 successful advances on this drive.',{next:()=>{
    focus($('redDrive'),'ONE MORE');
    say('One more successful play moves to the 10 and automatically scores a touchdown.',{next:()=>{
      setAction('Tap Red’s drive meter to score the 4th success.',({kind,value,el})=>{
        if(kind!=='drive'||value!=='RED')return wrong('Use Red’s drive meter for this touchdown demo.',el);
        state.action=null;clearFocus();setDrive('RED',4);setTD(3,1);event('TOUCHDOWN · RED +1 🏈','good');
        say('That touchdown ends the round. Red’s drive resets to the 50.',{next:()=>{
          setDrive('RED',0);setRound(2,'BLUE');
          say('Collect and redeal every Action Card: 7 each in 2v2, 6 in 3v3, 5 in 4v4.',{next:()=>{
            say('After Round 1, first offense alternates each round.',{next:()=>{
              nextLesson('And the first team to 3 touchdowns wins the match.');
            }});
          }});
        }});
      },{focusEl:$('redDrive'),callout:'4TH SUCCESS'});
    }});
  }});
}

function resetFinal(){
  state.finalPhase='defense';
  setTD(2,2);setDrive('RED',3);setDrive('BLUE',3);setRound(4,'BLUE');setHolder('b1');
  renderHand(['INTERCEPTION','TACKLE','BLOCK','RUN','PASS']);
  showPlayed('B1','PASS');event('BLUE IS ONE PLAY FROM WINNING','bad');
  state.prompt='Final Challenge. Blue passes. Stop the play and take possession.';
  state.action=finalDefense;
  say(state.prompt,{wait:true});
}
function finalDefense({kind,value,el}){
  if(kind!=='card')return wrong('React with a card from your hand.',el);
  if(value==='TACKLE')return wrong('TACKLE only stops RUN. Blue played PASS.',el);
  if(value==='BLOCK')return wrong('BLOCK cancels TACKLE or INTERCEPTION. There is nothing to BLOCK yet.',el);
  if(value!=='INTERCEPTION')return wrong('That card cannot stop this PASS.',el);
  state.action=null;removeCard('INTERCEPTION');showChain(['PASS','INTERCEPTION'],'INTERCEPTION SUCCESS');event('PASS INTERCEPTED','good');
  say('Good read. You stopped the PASS.',{next:async()=>{
    await moveFootball('b1','r1');
    state.finalPhase='offense';
    event('RED POSSESSION · ONE SUCCESS TO WIN','good');
    state.prompt='Your ball. Red is one successful play from the winning touchdown.';
    state.action=finalOffense;
    say(state.prompt,{wait:true});
  }});
}
function finalOffense({kind,value,el}){
  if(kind!=='card')return wrong('Choose an offensive card.',el);
  if(value==='BLOCK')return wrong('BLOCK is a reaction card. Start with RUN or PASS.',el);
  if(value==='TACKLE'||value==='INTERCEPTION')return wrong('That is a defensive card. Start the offense.',el);
  if(value==='RUN'){
    state.action=null;removeCard('RUN');showPlayed('R1','RUN');
    say('Blue answers with TACKLE.',{next:()=>{
      renderHand(state.hand);
      const block=highlightCard('BLOCK','COUNTER');
      setAction('Keep the winning RUN alive.',({kind,value,el})=>{
        if(kind!=='card'||value!=='BLOCK')return wrong('BLOCK cancels the TACKLE.',el);
        state.action=null;removeCard('BLOCK');showChain(['RUN','TACKLE','BLOCK'],'NO FINAL BREAK THROUGH');
        finalWin('RUN');
      },{focusEl:block,callout:'YOUR DECISION'});
    }});
    return;
  }
  if(value==='PASS'){
    state.action=null;removeCard('PASS');showPlayed('R1','PASS');
    setAction('Choose a Red receiver.',({kind,value,el})=>{
      if(kind!=='player'||value!=='r2')return wrong('Choose teammate R2 as the receiver.',el);
      state.action=null;clearFocus();
      say('Blue answers with INTERCEPTION.',{next:()=>{
        renderHand(state.hand);
        const block=highlightCard('BLOCK','COUNTER');
        setAction('Keep the winning PASS alive.',({kind,value,el})=>{
          if(kind!=='card'||value!=='BLOCK')return wrong('BLOCK cancels the INTERCEPTION.',el);
          state.action=null;removeCard('BLOCK');showChain(['PASS','INTERCEPTION','BLOCK'],'NO FINAL BREAK THROUGH');
          finalWin('PASS');
        },{focusEl:block,callout:'YOUR DECISION'});
      }});
    },{targets:['r2'],callout:'RECEIVER'});
  }
}
async function finalWin(type){
  clearFocus();event(`${type} SUCCESS · TOUCHDOWN`,'good');
  if(type==='PASS')await moveFootball('r1','r2');
  setDrive('RED',4);setTD(3,2);
  say('That is the winning touchdown.',{next:finishTutorial,label:'FINISH TUTORIAL →'});
}
function lesson13(){
  say('Final Challenge.',{next:()=>{
    say('I will give you the situation. You make the calls.',{next:resetFinal});
  }});
}

function finishTutorial(){
  state.action=null;clearFocus();
  $('done').classList.add('show');$('done').setAttribute('aria-hidden','false');
}
function buildPicker(){
  const root=$('lessonGrid');root.innerHTML='';
  LESSONS.forEach((l,i)=>{
    const b=document.createElement('button');b.className='lessonPick';b.type='button';
    b.innerHTML=`<b>LESSON ${i+1}</b>${l[0]}`;
    b.onclick=()=>{$('lessonModal').classList.remove('show');$('lessonModal').setAttribute('aria-hidden','true');startLesson(i)};
    root.appendChild(b);
  });
}
function restart(){
  $('done').classList.remove('show');$('done').setAttribute('aria-hidden','true');
  $('lessonModal').classList.remove('show');$('lessonModal').setAttribute('aria-hidden','true');
  startLesson(0);
}

document.querySelectorAll('.playerSeat').forEach(el=>el.onclick=()=>dispatch('player',el.dataset.player,el));
$('redDrive').onclick=()=>dispatch('drive','RED',$('redDrive'));
$('blueDrive').onclick=()=>dispatch('drive','BLUE',$('blueDrive'));
$('chooseBtn').onclick=()=>{buildPicker();$('lessonModal').classList.add('show');$('lessonModal').setAttribute('aria-hidden','false')};
$('closeLessonBtn').onclick=()=>{$('lessonModal').classList.remove('show');$('lessonModal').setAttribute('aria-hidden','true')};
$('restartBtn').onclick=restart;$('restartModalBtn').onclick=restart;$('againBtn').onclick=restart;
$('bootRetry').onclick=()=>location.reload();

buildPicker();
boot();
})();