(()=>{
const zh=`
<div style="font-size:15px;line-height:1.78">
<b style="font-size:18px">🏈 策略模式怎么玩？</b><br>
第一次玩也没关系。单人模式里，<b>你只操作红队，蓝队由电脑自动操作</b>。按照下面顺序做，就能把一整轮攻防玩明白。<br><br>

<b>① 先选人数</b><br>
• <b>2v2：</b>每名球员 7 张牌。<br>
• <b>3v3：</b>每名球员 6 张牌。<br>
• <b>4v4：</b>每名球员 5 张牌。<br>
单人模式里，你负责红队所有球员；电脑负责蓝队所有球员。你不需要帮电脑出牌。<br><br>

<b>② 先记住怎么赢</b><br>
每支队伍都从 <b>50码线</b> 开始。一次成功进攻就前进一格：<br>
<b>50 → 40 → 30 → 20 → 10</b><br>
第 4 次成功到达 10 码线后，当前持球者会自动冲进 <b>END ZONE</b>，完成 <b>TOUCHDOWN</b>。<br>
1 次 TOUCHDOWN = 1 个 🏈。<b>先拿到 3 个 🏈 的队伍获胜。</b><br><br>

<b>③ 一轮开始：先选持球者</b><br>
轮到红队进攻时，系统会让你从红队里选一名有 <b>RUN</b> 或 <b>PASS</b> 的球员当持球者。<br>
只有当前持球者可以发动这次进攻。<br><br>

<b>④ 进攻时，你主要有两个选择</b><br>
<b>RUN 🏃</b>：持球者自己带球往前跑。<br>
<b>PASS 🎯</b>：把球传给一名队友。点击 PASS 后，系统会让你选择接球队友。<br><br>

<b>⑤ 如果你打出 RUN，会发生什么？</b><br>
流程是：<br>
<b>你出 RUN → 电脑蓝队防守 → 你可能反制 → 系统判定成功或失败。</b><br><br>
电脑可能做 3 种事：<br>
• <b>TACKLE 💥</b>：拦住这次 RUN。<br>
• <b>BLITZ ⚡</b>：直接让这次进攻失败。<br>
• <b>不防守</b>：RUN 直接成功，你的球队自动前进一格。<br><br>
如果电脑出了 <b>TACKLE</b>，系统会切回你这边。<br>
如果你手里有 <b>BLOCK 🛡️</b>，可以打出 BLOCK 取消 TACKLE。<br>
你用了 BLOCK 后，电脑还有最后一次机会使用 <b>BLITZ</b>。<br>
• 电脑出 BLITZ → 这次 RUN 失败。<br>
• 电脑不出 BLITZ → 这次 RUN 成功，你前进一格。<br><br>

<b>⑥ 如果你打出 PASS，会发生什么？</b><br>
流程是：<br>
<b>你出 PASS → 选择接球队友 → 如果是 QB 可先决定技能 → 电脑防守 → 你可能反制 → 系统判定。</b><br><br>
电脑可能做 3 种事：<br>
• <b>INTERCEPTION 🦅</b>：抄截这次 PASS。成功后，出这张牌的蓝队球员直接获得球权。<br>
• <b>BLITZ ⚡</b>：直接让 PASS 失败。<br>
• <b>不防守</b>：PASS 成功，接球队友成为新的持球者，你的球队前进一格。<br><br>
如果电脑出了 <b>INTERCEPTION</b>，系统会切回你这边。<br>
如果你有 <b>BLOCK 🛡️</b>，可以用 BLOCK 取消 INTERCEPTION。<br>
BLOCK 后，电脑仍然可以再用 BLITZ 做最后反制。<br><br>

<b>⑦ QB 身份技能什么时候用？</b><br>
如果打出 PASS 的球员是 <b>QB</b>，而且技能还没用过，系统会先弹出：<br>
<b>“是否使用 QB 身份技能？”</b><br>
• 选择“使用技能” → 技能立刻消耗。<br>
• 如果这次 PASS 最终成功 → 本次推进按 <b>2格</b> 计算。<br>
• 如果 PASS 最后被 INTERCEPTION 或 BLITZ 拦住 → 技能也不会返还。<br><br>

<b>⑧ 防守牌分别记什么？</b><br>
<b>TACKLE 💥</b>：主要阻止 RUN。它不会拿走球员，也不会自动抢走球。<br>
<b>INTERCEPTION 🦅</b>：主要阻止 PASS。成功后防守方获得球权。<br>
<b>BLOCK 🛡️</b>：用来取消 TACKLE 或 INTERCEPTION。<br>
<b>BLITZ ⚡</b>：强力防守牌，可以让 RUN 或 PASS 直接失败，也可以在 BLOCK 后做最后反制。<br><br>

<b>⑨ 一次进攻什么时候算成功？</b><br>
只有当整条攻防结束后，RUN 或 PASS 没有被成功拦住，系统才会判定：<b>进攻成功</b>。<br>
进攻成功 → 自动前进。<br>
进攻失败 → 不前进，场上位置保持不变。<br><br>

<b>⑩ 什么时候会换球权？</b><br>
• <b>INTERCEPTION 成功</b> → 球权马上给蓝队。<br>
• 当前持球者已经没有 RUN / PASS，而另一队还有进攻牌 → 球权换给另一队。<br>
• 双方都没有 RUN / PASS → 这一轮结束，系统重新发牌。<br>
• TOUCHDOWN → 这一轮结束，下一轮重新从 50 码线开始。<br><br>

<b>⑪ 一轮结束后会发生什么？</b><br>
系统会把本轮使用过和剩下的牌重新整理，再按照人数重新发牌。<br>
下一轮由另一方先攻。<br><br>

<b>⑫ 最容易懂的一整套攻防例子</b><br>
<b>例子 A：RUN</b><br>
红队持球者出 RUN → 蓝队电脑出 TACKLE → 你出 BLOCK → 蓝队没有 BLITZ → RUN 成功 → 红队从 50 前进到 40。<br><br>
<b>例子 B：PASS</b><br>
红队持球者出 PASS → 选择红队队友 → 蓝队电脑出 INTERCEPTION → 你出 BLOCK → 蓝队再出 BLITZ → PASS 失败 → 红队不前进。<br><br>
<b>例子 C：QB 技能</b><br>
红队 QB 出 PASS → 选择队友 → 选择“使用 QB 技能” → 蓝队不防守 → PASS 成功 → 本次直接推进 2 格。<br><br>

<b>⭐ 最简单记法</b><br>
你的操作顺序：<br>
<b>选持球者 → RUN 或 PASS → 等电脑防守 → 有 BLOCK 就决定要不要反制 → 成功就前进。</b><br>
<b>连续 4 次成功 = TOUCHDOWN = 1 个 🏈；先拿 3 个 🏈 就赢。</b>
</div>`;

const en=`
<div style="font-size:15px;line-height:1.78">
<b style="font-size:18px">🏈 HOW TO PLAY STRATEGY MODE</b><br>
New to the game? No problem. In Solo Mode, <b>you only control Red Team and the computer controls Blue Team</b>. Follow these steps in order and you can play the full attack-and-defense flow.<br><br>

<b>1. Choose the game size</b><br>
• <b>2v2:</b> 7 cards per player.<br>
• <b>3v3:</b> 6 cards per player.<br>
• <b>4v4:</b> 5 cards per player.<br>
In Solo Mode, you control every Red player. The computer controls every Blue player. You never need to play Blue's cards yourself.<br><br>

<b>2. Know how to win</b><br>
Each team starts at the <b>50-yard line</b>. Every successful offensive play moves your team one space:<br>
<b>50 → 40 → 30 → 20 → 10</b><br>
On the 4th successful play, the current ball carrier reaches the 10 and automatically runs into the <b>END ZONE</b> for a <b>TOUCHDOWN</b>.<br>
1 TOUCHDOWN = 1 🏈. <b>The first team to collect 3 🏈 wins.</b><br><br>

<b>3. Start a drive by choosing a ball carrier</b><br>
When Red Team is on offense, choose a Red player who has a <b>RUN</b> or <b>PASS</b> card. That player becomes the ball carrier.<br>
Only the current ball carrier can start the next offensive play.<br><br>

<b>4. Your two main offensive choices</b><br>
<b>RUN 🏃</b>: The ball carrier tries to run forward with the ball.<br>
<b>PASS 🎯</b>: Pass the ball to a teammate. After you tap PASS, choose the teammate who will receive it.<br><br>

<b>5. What happens after you play RUN?</b><br>
The flow is:<br>
<b>You play RUN → Blue computer defends → you may counter → the game decides success or failure.</b><br><br>
The computer may do one of three things:<br>
• <b>TACKLE 💥</b>: Stops the RUN.<br>
• <b>BLITZ ⚡</b>: Makes the offensive play fail immediately.<br>
• <b>No Defense</b>: Your RUN succeeds and your team automatically advances one space.<br><br>
If the computer plays <b>TACKLE</b>, the game switches back to you.<br>
If you have <b>BLOCK 🛡️</b>, you may play BLOCK to cancel the TACKLE.<br>
After BLOCK, the computer gets one final chance to use <b>BLITZ</b>.<br>
• Blue uses BLITZ → the RUN fails.<br>
• Blue does not use BLITZ → the RUN succeeds and Red advances one space.<br><br>

<b>6. What happens after you play PASS?</b><br>
The flow is:<br>
<b>You play PASS → choose a receiver → if the passer is QB, decide on the skill → Blue defends → you may counter → the game decides the result.</b><br><br>
The computer may do one of three things:<br>
• <b>INTERCEPTION 🦅</b>: Intercepts the PASS. If it succeeds, the Blue player who used the card takes possession.<br>
• <b>BLITZ ⚡</b>: Makes the PASS fail immediately.<br>
• <b>No Defense</b>: The PASS succeeds, the receiver becomes the new ball carrier, and Red advances one space.<br><br>
If the computer plays <b>INTERCEPTION</b>, the game switches back to you.<br>
If you have <b>BLOCK 🛡️</b>, you may use BLOCK to cancel the INTERCEPTION.<br>
After BLOCK, Blue may still use BLITZ as the final response.<br><br>

<b>7. When do you use the QB skill?</b><br>
If the player who uses PASS is the <b>QB</b> and the skill has not been used yet, the game asks:<br>
<b>“Use QB Skill?”</b><br>
• Choose Use Skill → the skill is consumed immediately.<br>
• If the PASS succeeds → this play advances <b>2 spaces</b> instead of 1.<br>
• If the PASS is later stopped by INTERCEPTION or BLITZ → the skill is still spent and does not return.<br><br>

<b>8. Remember what each defense card does</b><br>
<b>TACKLE 💥</b>: Mainly stops RUN. It does not remove a player and does not automatically steal the ball.<br>
<b>INTERCEPTION 🦅</b>: Mainly stops PASS. If it succeeds, the defense gains possession.<br>
<b>BLOCK 🛡️</b>: Cancels TACKLE or INTERCEPTION.<br>
<b>BLITZ ⚡</b>: A strong defense card that can make a RUN or PASS fail, including as the final answer after BLOCK.<br><br>

<b>9. When is an offensive play successful?</b><br>
RUN or PASS only counts as successful after the full response chain ends and the defense has not stopped it.<br>
Successful play → the system advances your team automatically.<br>
Failed play → no advance; your field position stays where it is.<br><br>

<b>10. When does possession change?</b><br>
• <b>Successful INTERCEPTION</b> → possession immediately goes to Blue.<br>
• The current ball carrier has no RUN/PASS and the other team still has offense cards → possession changes sides.<br>
• Neither team has any RUN/PASS → the round ends and the game redeals.<br>
• TOUCHDOWN → the round ends and the next drive starts again from the 50-yard line.<br><br>

<b>11. What happens when a round ends?</b><br>
The game collects the used and remaining cards, mixes them again, and redeals based on the selected game size.<br>
The other team starts the next round on offense.<br><br>

<b>12. Easy full-play examples</b><br>
<b>Example A — RUN</b><br>
Red ball carrier plays RUN → Blue computer plays TACKLE → you play BLOCK → Blue has no BLITZ → RUN succeeds → Red moves from the 50 to the 40.<br><br>
<b>Example B — PASS</b><br>
Red plays PASS → chooses a Red receiver → Blue plays INTERCEPTION → you play BLOCK → Blue plays BLITZ → PASS fails → Red does not advance.<br><br>
<b>Example C — QB Skill</b><br>
Red QB plays PASS → chooses a receiver → you choose Use QB Skill → Blue does not defend → PASS succeeds → this play advances 2 spaces.<br><br>

<b>⭐ EASY WAY TO REMEMBER IT</b><br>
Your turn is always:<br>
<b>choose a ball carrier → play RUN or PASS → wait for the computer's defense → use BLOCK if you want to counter → if the play succeeds, advance.</b><br>
<b>4 successful plays = TOUCHDOWN = 1 🏈. First to 3 🏈 wins.</b>
</div>`;

function applyRules(){
 const el=document.getElementById('rulesBody');
 if(!el)return;
 const isZh=(document.documentElement.lang||'').toLowerCase().startsWith('zh');
 const wanted=isZh?zh:en;
 if(el.innerHTML!==wanted)el.innerHTML=wanted;
}
window.addEventListener('DOMContentLoaded',()=>{
 applyRules();
 const body=document.getElementById('rulesBody');
 if(body)new MutationObserver(()=>setTimeout(applyRules,0)).observe(body,{childList:true,subtree:true,characterData:true});
 const lang=document.getElementById('langToggleBtn');
 if(lang)lang.addEventListener('click',()=>setTimeout(applyRules,0));
 const rules=document.getElementById('rulesBtn');
 if(rules)rules.addEventListener('click',()=>setTimeout(applyRules,0));
});
})();