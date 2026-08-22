(()=>{
const manual={
zh:`<div style="font-size:15px;line-height:1.82">
<b style="font-size:20px">🏈 策略模式 · 单人模式完整说明书</b><br>
这份说明书按<b>整场游戏真正发生的顺序</b>来写：开局 → 分队 → 身份 → 石头剪刀布 → 发牌 → 选持球者 → 进攻 → 防守 → 成功/失败 → 换球权 → 回合结束 → TOUCHDOWN → 获胜。<br><br>

<b>一、选择人数并分队</b><br>
先选择：<b>2v2 / 3v3 / 4v4</b>。<br>
• 2v2：红队2名球员，蓝队2名球员，每人7张牌。<br>
• 3v3：红队3名球员，蓝队3名球员，每人6张牌。<br>
• 4v4：红队4名球员，蓝队4名球员，每人5张牌。<br>
<b>单人模式：</b>你固定控制红队全部球员；蓝队全部球员由电脑控制。你不需要替蓝队选牌。<br><br>

<b>二、分配身份</b><br>
每队都会有普通球员和1名 <b>QUARTERBACK（QB）</b>，由系统分配。<br>
QB有一次技能：QB打出PASS并选好接球人后，可以选择是否使用。若该PASS最终成功，本次推进2格；若之后失败，技能也不会返还。<br><br>

<b>三、第一轮先攻：石头剪刀布</b><br>
游戏开始后不会直接默认红队先攻。<br>
你代表红队选择：<b>✊石头 / 🖐️布 / ✌️剪刀</b>。<br>
电脑蓝队同时随机选择。<br>
• 你赢 → 红队获得第一轮先攻。<br>
• 电脑赢 → 蓝队获得第一轮先攻。<br>
• 平局 → 重新选择，直到分出胜负。<br>
<b>只有第一轮用石头剪刀布。</b>之后每轮先攻方自动交替，例如：红 → 蓝 → 红 → 蓝。<br><br>

<b>四、发牌</b><br>
系统洗牌并按人数发牌：2v2每人7张、3v3每人6张、4v4每人5张。<br>
牌包括：<b>RUN、PASS、TACKLE、INTERCEPTION、BLOCK、BLITZ</b>。<br>
<b>出一张后不会立刻补一张。</b>本轮就使用当前手牌。等本轮结束后，系统统一收牌、洗牌、重新发牌。<br><br>

<b>五、每轮开始：先选择持球者</b><br>
本轮先攻方先从自己队伍里选择一名<b>手里有RUN或PASS</b>的球员作为持球者。<br>
球会显示在这个球员身上。<br>
只有当前持球者可以发动下一次RUN或PASS。<br><br>

<b style="font-size:18px">六、RUN 的完整流程</b><br>
<b>步骤1：进攻方打出 RUN 🏃</b><br>
持球者自己带球进攻。<br><br>
<b>步骤2：防守方选择</b><br>
对RUN，防守方可以：<br>
• <b>不防守</b><br>
• <b>TACKLE 💥</b><br>
• <b>BLITZ ⚡</b><br><br>
<b>情况A：不防守</b><br>
→ RUN <b>成功</b><br>
→ 系统自动推进1格<br>
→ 原持球者继续持球<br>
→ 如果还有RUN/PASS，可以继续进攻。<br><br>
<b>情况B：直接BLITZ</b><br>
→ RUN <b>失败</b><br>
→ 不推进<br>
→ 球仍在原进攻方<br>
→ 系统检查该队是否还能继续进攻。<br><br>
<b>情况C：TACKLE</b><br>
系统切回进攻方。进攻方可以：<br>
• <b>不用BLOCK</b> → TACKLE生效 → RUN失败 → 不推进。<br>
• <b>打出BLOCK 🛡️</b> → 取消TACKLE。<br><br>
如果进攻方用了BLOCK，系统再切回防守方：<br>
• <b>防守方不再出BLITZ</b> → RUN成功 → 推进1格。<br>
• <b>防守方再出BLITZ</b> → RUN失败 → 不推进。<br><br>
<b>RUN所有结果：</b><br>
RUN → 不防守 = <b>成功</b><br>
RUN → BLITZ = <b>失败</b><br>
RUN → TACKLE → 不BLOCK = <b>失败</b><br>
RUN → TACKLE → BLOCK → 不BLITZ = <b>成功</b><br>
RUN → TACKLE → BLOCK → BLITZ = <b>失败</b><br><br>

<b style="font-size:18px">七、PASS 的完整流程</b><br>
<b>步骤1：进攻方打出 PASS 🎯</b><br>
<b>步骤2：选择一名同队队友作为接球人</b><br>
如果PASS成功，这名接球人会成为新的持球者。<br><br>
<b>步骤3：QB技能判断</b><br>
如果传球者是QB且技能还没用过，系统先问是否使用技能。<br>
• 暂不使用 → 技能保留。<br>
• 使用 → 技能立即消耗；PASS若最终成功，本次推进2格。<br><br>
<b>步骤4：防守方选择</b><br>
对PASS，防守方可以：<br>
• <b>不防守</b><br>
• <b>INTERCEPTION 🦅</b><br>
• <b>BLITZ ⚡</b><br><br>
<b>情况A：不防守</b><br>
→ PASS <b>成功</b><br>
→ 接球人成为新持球者<br>
→ 系统推进1格；若QB技能生效则推进2格。<br><br>
<b>情况B：直接BLITZ</b><br>
→ PASS <b>失败</b><br>
→ 不推进<br>
→ 球仍属于原进攻方。<br><br>
<b>情况C：INTERCEPTION</b><br>
系统切回进攻方。进攻方可以：<br>
• <b>不用BLOCK</b> → INTERCEPTION成功 → 出INTERCEPTION的防守球员直接拿到球 → <b>立即换球权</b>。<br>
• <b>打出BLOCK</b> → 取消INTERCEPTION。<br><br>
如果进攻方用了BLOCK，系统再次切回防守方：<br>
• <b>不再出BLITZ</b> → PASS成功 → 接球人持球 → 推进。<br>
• <b>再出BLITZ</b> → PASS失败 → 不推进。<br><br>
<b>PASS所有结果：</b><br>
PASS → 选接球人 → 不防守 = <b>成功</b><br>
PASS → 选接球人 → BLITZ = <b>失败</b><br>
PASS → 选接球人 → INTERCEPTION → 不BLOCK = <b>抄截成功，换球权</b><br>
PASS → 选接球人 → INTERCEPTION → BLOCK → 不BLITZ = <b>成功</b><br>
PASS → 选接球人 → INTERCEPTION → BLOCK → BLITZ = <b>失败</b><br><br>

<b>八、当电脑蓝队进攻时，你怎么防守</b><br>
单人模式中，如果蓝队拿到球，电脑会自动选持球者并自动出RUN或PASS。<br>
你只负责红队防守：<br>
• 电脑出RUN → 你选 TACKLE / BLITZ / 不防守。<br>
• 电脑出PASS → 你选 INTERCEPTION / BLITZ / 不防守。<br>
如果你的TACKLE或INTERCEPTION被电脑BLOCK，你还可以决定是否再用BLITZ。<br>
<b>红队进攻和蓝队进攻使用完全相同的成功/失败规则，只是双方角色互换。</b><br><br>

<b>九、一次进攻结算后做什么</b><br>
<b>成功：</b>系统自动推进；RUN时通常原球员继续持球，PASS成功时接球人成为新持球者。<br>
<b>失败：</b>不推进，系统检查当前进攻方是否还能继续。<br>
<b>INTERCEPTION成功：</b>立刻换球权，原防守方成为新的进攻方。<br><br>

<b>十、什么时候重新选持球者</b><br>
如果当前持球者已经没有RUN/PASS，但同队其他球员还有RUN/PASS，系统会要求同队重新选持球者。<br>
如果整支队伍都没有RUN/PASS，而另一队还有RUN/PASS，则球权交给另一队，由另一队选持球者。<br><br>

<b>十一、一轮什么时候结束</b><br>
当<b>红队和蓝队都没有可以继续使用的RUN/PASS</b>时，本轮结束。<br>
系统会：<br>
1. 收回本轮已使用和未使用的牌；<br>
2. 重新洗牌；<br>
3. 按2v2/3v3/4v4重新发牌；<br>
4. 下一轮由上一轮先攻方的对手先攻。<br>
<b>普通轮次结束不会清空已经推进的码线。</b><br><br>

<b>十二、推进与TOUCHDOWN</b><br>
每队自己的推进从50码开始：<br>
第1次成功：<b>50 → 40</b><br>
第2次成功：<b>40 → 30</b><br>
第3次成功：<b>30 → 20</b><br>
第4次成功：<b>20 → 10</b>，然后当前持球者自动冲进 <b>END ZONE</b>。<br>
→ 弹出 <b>TOUCHDOWN</b><br>
→ 获得1个🏈<br>
→ 该队下一次达阵推进重新从50码开始。<br>
<b>不需要第5次成功。</b><br><br>

<b>十三、整场比赛完整顺序</b><br>
<b>选人数/模式 → 分队和QB → 石头剪刀布决定第一轮先攻 → 发牌 → 先攻方选持球者 → RUN/PASS → 对方防守 → BLOCK反制（如有） → BLITZ最终反制（如有） → 系统判定成功/失败/抄截 → 推进或换球权 → 继续下一次攻防 → 双方无RUN/PASS后本轮结束 → 重新发牌 → 下一轮换另一队先攻 → 第4次成功TOUCHDOWN → 获得🏈 → 继续比赛。</b><br><br>
<b>先获得3个🏈的队伍立即获胜。</b>
</div>`,
en:`<div style="font-size:15px;line-height:1.82">
<b style="font-size:20px">🏈 STRATEGY MODE · SOLO MODE COMPLETE RULEBOOK</b><br>
This rulebook follows the actual game from start to finish: setup → teams → roles → Rock-Paper-Scissors → deal → choose ball carrier → offense → defense → success/failure → possession changes → round end → touchdown → win.<br><br>
<b>1. Choose team size and teams</b><br>
Choose <b>2v2 / 3v3 / 4v4</b>.<br>• 2v2: 2 Red vs 2 Blue; 7 cards each.<br>• 3v3: 3 Red vs 3 Blue; 6 cards each.<br>• 4v4: 4 Red vs 4 Blue; 5 cards each.<br><b>Solo Mode:</b> you control all Red players; the computer controls all Blue players.<br><br>
<b>2. Assign roles</b><br>
Each team includes one <b>QUARTERBACK (QB)</b>. The game assigns roles. The QB has a once-per-game PASS skill. If used and the PASS finally succeeds, advance 2 spaces. If the play later fails, the skill is still spent.<br><br>
<b>3. First offense: Rock-Paper-Scissors</b><br>
The game does not automatically give Red first offense. You choose Rock, Paper, or Scissors for Red while the Blue computer chooses randomly.<br>• Red wins → Red attacks first.<br>• Blue wins → Blue attacks first.<br>• Tie → choose again until there is a winner.<br><b>Only Round 1 uses Rock-Paper-Scissors.</b> After that, first offense alternates each round.<br><br>
<b>4. Deal cards</b><br>
Deal 7 each in 2v2, 6 each in 3v3, or 5 each in 4v4. Cards are RUN, PASS, TACKLE, INTERCEPTION, BLOCK, and BLITZ.<br><b>Do not draw a replacement card after every play.</b> Hands are used during the round. The game gathers, shuffles, and redeals only when the round ends.<br><br>
<b>5. Start each round: choose the ball carrier</b><br>
The team attacking first chooses a player with RUN or PASS to hold the ball. Only the current ball carrier can start the next RUN or PASS.<br><br>
<b style="font-size:18px">6. Complete RUN flow</b><br>
RUN → defense chooses No Defense / TACKLE / BLITZ.<br><br>
<b>No Defense:</b> RUN succeeds → advance 1 → same ball carrier keeps possession.<br><br>
<b>BLITZ:</b> RUN fails → no advance → offense keeps possession.<br><br>
<b>TACKLE:</b> offense may use BLOCK.<br>• No BLOCK → RUN fails.<br>• BLOCK → TACKLE is canceled → defense gets one final BLITZ choice.<br>　• No BLITZ → RUN succeeds.<br>　• BLITZ → RUN fails.<br><br>
<b>All RUN results:</b><br>RUN → No Defense = <b>SUCCESS</b><br>RUN → BLITZ = <b>FAIL</b><br>RUN → TACKLE → No BLOCK = <b>FAIL</b><br>RUN → TACKLE → BLOCK → No BLITZ = <b>SUCCESS</b><br>RUN → TACKLE → BLOCK → BLITZ = <b>FAIL</b><br><br>
<b style="font-size:18px">7. Complete PASS flow</b><br>
Play PASS → choose a teammate receiver → QB skill decision if available → defense chooses No Defense / INTERCEPTION / BLITZ.<br><br>
<b>No Defense:</b> PASS succeeds → receiver becomes ball carrier → advance 1, or 2 if QB skill applies.<br><br>
<b>BLITZ:</b> PASS fails → no advance → original offense keeps possession.<br><br>
<b>INTERCEPTION:</b> offense may use BLOCK.<br>• No BLOCK → interception succeeds → defender who played INTERCEPTION takes possession immediately.<br>• BLOCK → interception is canceled → defense gets one final BLITZ choice.<br>　• No BLITZ → PASS succeeds.<br>　• BLITZ → PASS fails.<br><br>
<b>All PASS results:</b><br>PASS → receiver → No Defense = <b>SUCCESS</b><br>PASS → receiver → BLITZ = <b>FAIL</b><br>PASS → receiver → INTERCEPTION → No BLOCK = <b>INTERCEPTION; POSSESSION CHANGES</b><br>PASS → receiver → INTERCEPTION → BLOCK → No BLITZ = <b>SUCCESS</b><br>PASS → receiver → INTERCEPTION → BLOCK → BLITZ = <b>FAIL</b><br><br>
<b>8. When Blue computer is on offense</b><br>
The computer chooses Blue's ball carrier and RUN/PASS automatically. You defend as Red.<br>Against RUN: choose TACKLE / BLITZ / No Defense.<br>Against PASS: choose INTERCEPTION / BLITZ / No Defense.<br>If the computer BLOCKs your TACKLE/INTERCEPTION, you may still use BLITZ as the final response.<br><br>
<b>9. After each play</b><br><b>Success:</b> advance automatically.<br><b>Failure:</b> no advance; the system checks whether the offense can continue.<br><b>Successful INTERCEPTION:</b> possession changes immediately.<br><br>
<b>10. Choose a new ball carrier</b><br>If the current carrier has no RUN/PASS but a teammate does, choose a new carrier. If the whole team has no RUN/PASS and the opponent still does, possession goes to the opponent.<br><br>
<b>11. When a round ends</b><br>A round ends when neither team has a RUN/PASS available. The game gathers, shuffles, and redeals. The other team attacks first next round. <b>Normal round endings do not erase field progress.</b><br><br>
<b>12. TOUCHDOWN</b><br>1st success: 50→40.<br>2nd: 40→30.<br>3rd: 30→20.<br>4th: 20→10, then the ball carrier automatically runs into the END ZONE.<br>TOUCHDOWN → earn 1 🏈 → that team's next touchdown drive starts again from the 50. <b>There is no 5th successful play.</b><br><br>
<b>13. Full game order</b><br><b>Choose size/mode → assign teams and QB → Rock-Paper-Scissors for Round 1 → deal → choose ball carrier → RUN/PASS → defense → BLOCK if needed → final BLITZ if needed → system decides success/failure/interception → advance or change possession → continue → when both teams have no RUN/PASS, redeal → other team starts next round → 4th success scores TOUCHDOWN → earn 🏈 → continue.</b><br><br><b>First team to collect 3 🏈 wins immediately.</b>
</div>`};
function build(){const top=document.querySelector('.topbar > div:last-child');if(!top||document.getElementById('manualBtn'))return;const btn=document.createElement('button');btn.className='btn';btn.id='manualBtn';top.insertBefore(btn,document.getElementById('rulesBtn'));const modal=document.createElement('div');modal.className='modal';modal.id='manualModal';modal.innerHTML='<div class="modalBox"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><h2 style="margin:0" id="manualHeading"></h2><button class="btn" id="closeManualBtn"></button></div><div style="margin-top:12px;line-height:1.75;color:#dbe5de" id="manualBody"></div></div>';document.body.appendChild(modal);btn.onclick=()=>{render();modal.classList.add('show')};document.getElementById('closeManualBtn').onclick=()=>modal.classList.remove('show');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});render()}
function render(){if(!document.getElementById('manualBtn'))return;const lang=document.documentElement.lang.startsWith('en')?'en':'zh',en=lang==='en';document.getElementById('manualBtn').textContent=en?'Rulebook':'说明书';document.getElementById('manualHeading').textContent=en?'Strategy Mode Rulebook':'策略模式说明书';document.getElementById('closeManualBtn').textContent=en?'Close':'关闭';document.getElementById('manualBody').innerHTML=manual[lang]}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();document.addEventListener('click',e=>{if(e.target&&e.target.id==='langToggleBtn')setTimeout(render,0)});
})();