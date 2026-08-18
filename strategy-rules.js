(()=>{
const zh=`
<div style="font-size:15px;line-height:1.75">
<b>🏈 游戏目标</b><br>
把你的球队从 <b>50码线</b> 一步一步推进到对方端区。每完成 <b>4次成功进攻</b>，就完成一次 <b>TOUCHDOWN（达阵）</b>，获得 1 个🏈。<b>先获得3个🏈的队伍获胜！</b><br><br>

<b>👥 1. 先选择怎么玩</b><br>
• <b>2v2：</b>每名球员7张牌。<br>
• <b>3v3：</b>每名球员6张牌。<br>
• <b>4v4：</b>每名球员5张牌。<br>
• <b>单人模式：</b>你控制红队，蓝队由电脑控制。<br>
• <b>多人本地：</b>红蓝双方由真人轮流操作，同一台手机或电脑也能玩。<br><br>

<b>🏈 2. 开始比赛</b><br>
双方从 <b>50码线</b> 开始。50只是起点，不算成功一次。选择一名有 RUN 或 PASS 的球员当持球者，然后开始进攻。<br><br>

<b>🎴 3. 进攻牌怎么用？</b><br>
<b>RUN 🏃：</b>持球者自己带球向前跑。对方可以用 TACKLE 或 BLITZ 阻止。<br>
<b>PASS 🎯：</b>把球传给一名队友。先点击 PASS，再选择接球队友。对方可以用 INTERCEPTION 或 BLITZ 阻止。<br><br>

<b>🛡️ 4. 防守牌怎么用？</b><br>
<b>TACKLE 💥：</b>阻止对方的 RUN。它不会把球员拿走，也不会直接抢走球。<br>
<b>INTERCEPTION 🦅：</b>只能对 PASS 使用。成功后，防守球员抄截并直接获得球权。<br>
<b>BLITZ ⚡：</b>强力阻止本次进攻，可用于对付 RUN 或 PASS。<br><br>

<b>🔁 5. BLOCK 是反制牌</b><br>
如果你的 RUN 被 TACKLE，或 PASS 被 INTERCEPTION，你可以打出 <b>BLOCK 🛡️</b> 来保护这次进攻。<br>
打出 BLOCK 后，对方还有最后一次机会使用 <b>BLITZ</b>。如果对方不使用 BLITZ，这次进攻成功。<br><br>

<b>⭐ 6. QB 身份技能</b><br>
每队有一名 <b>Quarterback（QB）</b>。当 QB 打出 PASS 时，游戏会问你：<b>“是否使用身份卡技能？”</b><br>
如果使用，而且 PASS 最终成功，这次可以<b>额外推进1格</b>。技能一旦确认使用就会消耗；即使 PASS 后来失败或被抄截，也不会返还。<br><br>

<b>📏 7. 怎么推进？</b><br>
每次 RUN 或 PASS 最终成功，系统会自动前进：<br>
<b>开始：50码</b><br>
第1次成功 → 40码<br>
第2次成功 → 30码<br>
第3次成功 → 20码<br>
第4次成功 → 10码，然后持球者<b>自动冲进 END ZONE</b>！<br>
所以不是5次，<b>第4次成功就直接 TOUCHDOWN。</b><br><br>

<b>🏆 8. 怎么赢？</b><br>
TOUCHDOWN = 获得 1 个🏈。达阵后，该队下一轮重新从50码开始。<br>
<b>第一个拿到3个🏈的队伍赢得整场比赛。</b><br><br>

<b>💡 最简单的记法</b><br>
进攻：<b>RUN / PASS</b> → 对方防守 → 必要时用 <b>BLOCK</b> → 成功就前进。<br>
<b>成功4次 = 1个🏈；拿到3个🏈 = 获胜。</b>
</div>`;
const en=`
<div style="font-size:15px;line-height:1.75">
<b>🏈 GOAL OF THE GAME</b><br>
Move your team from the <b>50-yard line</b> toward the other team’s end zone. Every <b>4 successful offensive plays</b> scores a <b>TOUCHDOWN</b> and earns 1 🏈. <b>The first team to collect 3 🏈 wins!</b><br><br>

<b>👥 1. CHOOSE HOW TO PLAY</b><br>
• <b>2v2:</b> 7 cards per player.<br>
• <b>3v3:</b> 6 cards per player.<br>
• <b>4v4:</b> 5 cards per player.<br>
• <b>Solo:</b> You control the Red Team. The computer controls the Blue Team.<br>
• <b>Local Multiplayer:</b> Real players control both teams and take turns on the same device.<br><br>

<b>🏈 2. START THE GAME</b><br>
Both teams begin at the <b>50-yard line</b>. The 50 is only the starting point—it does not count as a successful play. Choose a player who has a RUN or PASS card to be the ball carrier.<br><br>

<b>🎴 3. OFFENSIVE CARDS</b><br>
<b>RUN 🏃:</b> The ball carrier runs with the ball. The defense may stop it with TACKLE or BLITZ.<br>
<b>PASS 🎯:</b> Pass the ball to a teammate. Play PASS, then choose the teammate who will receive it. The defense may stop it with INTERCEPTION or BLITZ.<br><br>

<b>🛡️ 4. DEFENSIVE CARDS</b><br>
<b>TACKLE 💥:</b> Stops a RUN. It does not remove a player and does not automatically steal the ball.<br>
<b>INTERCEPTION 🦅:</b> Can only be used against a PASS. If it succeeds, the defender catches the pass and takes possession.<br>
<b>BLITZ ⚡:</b> A strong defensive play that can stop either a RUN or a PASS.<br><br>

<b>🔁 5. BLOCK IS YOUR COUNTER</b><br>
If your RUN is stopped by TACKLE, or your PASS is stopped by INTERCEPTION, you may play <b>BLOCK 🛡️</b> to protect the play.<br>
After BLOCK, the defense gets one final chance to play <b>BLITZ</b>. If no BLITZ is played, the offensive play succeeds.<br><br>

<b>⭐ 6. QB ROLE SKILL</b><br>
Each team has one <b>Quarterback (QB)</b>. When the QB plays PASS, the game asks: <b>“Use your role skill?”</b><br>
If you use it and the PASS succeeds, your team <b>advances 1 extra space</b>. Once you choose to use the skill, it is spent. It is not returned if the PASS later fails or is intercepted.<br><br>

<b>📏 7. HOW FIELD PROGRESS WORKS</b><br>
Whenever a RUN or PASS finally succeeds, the game moves your team automatically:<br>
<b>Start: 50-yard line</b><br>
1st success → 40-yard line<br>
2nd success → 30-yard line<br>
3rd success → 20-yard line<br>
4th success → 10-yard line, then the ball carrier <b>automatically runs into the END ZONE!</b><br>
There is no fifth play. <b>The 4th successful play scores the TOUCHDOWN.</b><br><br>

<b>🏆 8. HOW TO WIN</b><br>
A TOUCHDOWN earns 1 🏈. After scoring, that team starts its next drive from the 50-yard line again.<br>
<b>The first team to collect 3 🏈 wins the game.</b><br><br>

<b>💡 EASY WAY TO REMEMBER</b><br>
Offense plays <b>RUN / PASS</b> → Defense responds → Use <b>BLOCK</b> if needed → A successful play moves you forward.<br>
<b>4 successful plays = 1 🏈. Collect 3 🏈 = WIN.</b>
</div>`;
function applyRules(){const el=document.getElementById('rulesBody');if(!el)return;const isZh=(document.documentElement.lang||'').toLowerCase().startsWith('zh');const wanted=isZh?zh:en;if(el.innerHTML!==wanted)el.innerHTML=wanted;}
window.addEventListener('DOMContentLoaded',()=>{applyRules();const body=document.getElementById('rulesBody');if(body)new MutationObserver(()=>setTimeout(applyRules,0)).observe(body,{childList:true,subtree:true,characterData:true});const lang=document.getElementById('langToggleBtn');if(lang)lang.addEventListener('click',()=>setTimeout(applyRules,0));const rules=document.getElementById('rulesBtn');if(rules)rules.addEventListener('click',()=>setTimeout(applyRules,0));});
})();