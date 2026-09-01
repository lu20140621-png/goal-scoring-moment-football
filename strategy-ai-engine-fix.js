/* AI runtime reliability fix.
   Keeps gameplay logic independent from UI rendering failures. */
(()=>{
  function safeRender(){
    try{
      render();
    }catch(err){
      console.error('Render error:',err);
    }
  }

  function queue(fn,delay=450){
    setTimeout(()=>{
      try{
        fn();
      }catch(err){
        console.error('AI runtime error:',err);
      }
    },delay);
  }

  aiDefend=function(){
    const play=G.pending;
    if(!play||play.team!=='red') return;

    G.phase='ai';

    /* Schedule first so a UI/render problem cannot stop the AI turn. */
    queue(()=>{
      if(!G.pending||G.pending!==play) return;

      const pool=teamPlayers('blue');
      const target=play.action==='RUN'?'TACKLE':'INTERCEPTION';
      const blitz=pool.find(p=>p.hand.includes('BLITZ'));
      const normal=pool.find(p=>p.hand.includes(target));
      const roll=Math.random();

      if(blitz&&roll<.42){
        consume(blitz,'BLITZ');
        safeAiReveal('BLITZ');
        flash('BLITZ!');
        addLog('蓝队电脑使用 BLITZ。','Blue AI plays BREAK THROUGH.');
        resolveFail(L('BLITZ 直接终止本次进攻。','BREAK THROUGH immediately stops the play.'));
        return;
      }

      if(normal&&roll<.88){
        consume(normal,target);
        safeAiReveal(target);
        G.pending.defender=normal.id;
        G.pending.defense=target;
        flash(target+'!');
        addLog(`蓝队电脑使用 ${target}。`,`Blue AI plays ${target}.`);

        const blocker=teamPlayers('red').find(p=>p.hand.includes('BLOCK'));
        if(blocker){
          G.currentRed=blocker.id;
          G.phase='block';
          showPrompt(
            L(`${target} 正在阻止你。是否使用 BLOCK？`,`${target} is stopping the play. Use BLOCK?`),
            [
              {label:L('使用 BLOCK','Use BLOCK'),gold:true,fn:()=>{G.currentRed=blocker.id;playHumanCard('BLOCK')}},
              {label:L('不用 BLOCK','No BLOCK'),fn:()=>resolveDefenseSuccess()}
            ]
          );
          safeRender();
        }else{
          resolveDefenseSuccess();
        }
        return;
      }

      addLog('蓝队电脑选择不防守。','Blue AI chooses no defense.');
      resolveSuccess();
    },450);

    safeRender();
  };

  beginPossession=function(){
    hidePrompt();
    G.pending=null;

    if(G.offense==='red'){
      G.phase='choose';
      G.holder=null;

      const ps=teamPlayers('red').filter(hasOff);
      if(!ps.length){
        afterPlay();
        return;
      }

      G.currentRed=ps[0].id;
      addLog(
        '红队进攻：请选择一名有 RUN/PASS 的球员持球。',
        'Red offense: choose any Red teammate with RUN/PASS to hold the FOOTBALL CARD.'
      );
      safeRender();
      return;
    }

    if(G.offense==='blue'){
      const ps=teamPlayers('blue').filter(hasOff);
      if(!ps.length){
        G.holder=null;
        afterPlay();
        return;
      }

      const h=ps[Math.floor(Math.random()*ps.length)];
      G.holder=h.id;
      G.phase='ai';

      addLog(
        `蓝队电脑选择 ${h.id} 持有 FOOTBALL CARD。`,
        `Blue AI chooses ${h.id} to hold the FOOTBALL CARD.`
      );

      /* Queue AI before rendering the field. */
      queue(()=>{
        if(G.offense==='blue'&&G.holder===h.id&&G.phase==='ai'){
          aiAttack();
        }
      },450);

      safeRender();
    }
  };

  aiAttack=function(){
    if(G.offense!=='blue') return;

    let p=holder();
    if(!p||p.team!=='blue'||!hasOff(p)){
      const ps=teamPlayers('blue').filter(hasOff);
      if(!ps.length){
        G.holder=null;
        afterPlay();
        return;
      }
      p=ps[Math.floor(Math.random()*ps.length)];
      G.holder=p.id;
    }

    const opts=p.hand.filter(c=>c==='RUN'||c==='PASS');
    if(!opts.length){
      G.holder=null;
      beginPossession();
      return;
    }

    const c=opts[Math.floor(Math.random()*opts.length)];
    if(!consume(p,c)){
      G.holder=null;
      beginPossession();
      return;
    }

    G.pending={
      action:c,
      attacker:p.id,
      team:'blue',
      receiver:null,
      qbBoost:false
    };

    if(c==='PASS'){
      const rec=teamPlayers('blue').filter(x=>x.id!==p.id);
      if(rec.length){
        G.pending.receiver=rec[Math.floor(Math.random()*rec.length)].id;
      }

      if(p.role==='QB'&&!p.skill&&Math.random()<.45){
        p.skill=true;
        G.pending.qbBoost=true;
        addLog('蓝队 QB 使用身份技能。','Blue QB uses the role skill.');
      }
    }

    G.phase='defense';
    flash(c+'!');
    addLog(`蓝队电脑 ${p.id} 打出 ${c}。`,`Blue AI ${p.id} plays ${c}.`);
    safeAiReveal(c);

    const need=c==='RUN'?'TACKLE':'INTERCEPTION';
    const eligible=teamPlayers('red').filter(
      x=>x.hand.includes(need)||x.hand.includes('BLITZ')
    );

    if(!eligible.length){
      addLog(
        '红队没有可用防守牌，电脑进攻自动成功。',
        'Red has no valid defensive card; Blue succeeds automatically.'
      );
      queue(()=>{
        if(G.pending&&G.pending.attacker===p.id){
          resolveSuccess();
        }
      },400);
      safeRender();
      return;
    }

    G.currentRed=eligible[0].id;
    showPrompt(
      L(
        `电脑打出 ${c}。可使用 ${need} / BREAK THROUGH，或不防守。`,
        `Blue plays ${c}. Use ${need} / BREAK THROUGH, or choose No Defense.`
      ),
      [{label:L('不防守','No Defense'),fn:()=>resolveSuccess()}]
    );
    safeRender();
  };

  afterPlay=function(){
    hidePrompt();
    if(G.phase==='gameover'||G.phase==='touchdown') return;

    G.pending=null;

    if(!teamHasOff('red')&&!teamHasOff('blue')){
      endRound('exhausted');
      return;
    }

    if(!teamHasOff(G.offense)){
      const other=G.offense==='red'?'blue':'red';
      addLog(
        `${G.offense==='red'?'红队':'蓝队'}已经没有 RUN/PASS，球权交给${other==='red'?'红队':'蓝队'}。`,
        `${teamName(G.offense)} has no RUN/PASS left. Possession moves to ${teamName(other)}.`
      );
      G.offense=other;
      G.holder=null;
      beginPossession();
      return;
    }

    if(!holder()||!hasOff(holder())){
      G.holder=null;
      beginPossession();
      return;
    }

    if(G.offense==='red'){
      G.phase='attack';
      G.currentRed=G.holder;
      safeRender();
      return;
    }

    G.phase='ai';
    queue(()=>{
      if(G.offense==='blue'&&G.phase==='ai'){
        aiAttack();
      }
    },450);
    safeRender();
  };
})();
