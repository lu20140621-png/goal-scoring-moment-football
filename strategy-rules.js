(()=>{
const zh=`
<div style="font-size:15px;line-height:1.8">
<b style="font-size:19px">🏈 策略模式：从开局到获胜的完整流程</b><br>
这不是几个例子，而是<b>整场游戏所有主要流程</b>。第一次玩的玩家按顺序看，就能知道什么时候进攻、什么时候防守、什么时候反制、什么时候换球权。<br><br>

<b>① 选择人数和操作模式</b><br>
• 2v2：每人 7 张牌。<br>• 3v3：每人 6 张牌。<br>• 4v4：每人 5 张牌。<br>
<b>单人模式：</b>你控制红队，蓝队由电脑自动操作。<br>
<b>多人模式：</b>红蓝双方都由真人操作，轮到另一方时交接设备。<br><br>

<b>② 游戏目标</b><br>
双方都从 <b>50码线</b> 开始。每完成 1 次成功进攻就推进 1 格：<br>
<b>第1次：50→40　 第2次：40→30　 第3次：30→20　 第4次：20→10→自动冲入 END ZONE</b><br>
第4次成功直接 TOUCHDOWN，不需要第5次进攻。<br>
1次 TOUCHDOWN 获得 1 个 🏈；<b>先获得 3 个 🏈 的队伍获胜。</b><br><br>

<b>③ 一轮开始：确定进攻方和持球者</b><br>
系统确定本轮先攻方。进攻方从自己队伍中选择一名<b>手里有 RUN 或 PASS</b>的球员作为持球者。<br>
持球者确定后进入<b>进攻时刻</b>。当前持球者选择 RUN 或 PASS 发动一次进攻。<br><br>

<b style="font-size:17px">④ RUN 的完整进攻 → 防守 → 反制流程</b><br>
<b>步骤1：</b>持球者打出 <b>RUN 🏃</b>。<br>
<b>步骤2：</b>系统立刻进入防守时刻。防守方查看自己能使用的防守牌。<br>
<b>步骤3：防守方有三种选择：</b><br>
• <b>不防守</b> → RUN 直接成功。<br>
• <b>TACKLE 💥</b> → 尝试阻止 RUN。TACKLE 不会自动抢走球。<br>
• <b>BLITZ ⚡</b> → 这次 RUN 直接失败。<br><br>
<b>如果防守方选择“不防守”：</b><br>
RUN 成功 → 系统自动推进 1 格 → 原持球者继续持球 → 如果仍有 RUN/PASS，可以继续下一次进攻。<br><br>
<b>如果防守方打出 BLITZ：</b><br>
RUN 失败 → 不推进 → 球仍在原持球者手上 → 进入下一次可进行的进攻判断。<br><br>
<b>如果防守方打出 TACKLE：</b><br>
系统切回进攻方，进入<b>BLOCK反制时刻</b>。<br>
进攻方可以：<br>
• <b>不用 BLOCK</b> → TACKLE 生效 → RUN失败 → 不推进。<br>
• <b>打出 BLOCK 🛡️</b> → 取消这张 TACKLE。<br><br>
<b>如果进攻方打出 BLOCK：</b><br>
系统再次切回防守方，进入<b>最后反制</b>。防守方可以：<br>
• <b>放弃 BLITZ</b> → BLOCK成功保护RUN → RUN成功 → 推进1格。<br>
• <b>打出 BLITZ</b> → 最终阻止进攻 → RUN失败 → 不推进。<br><br>
<b>RUN完整链：</b><br>
RUN → 不防守 = 成功<br>
RUN → BLITZ = 失败<br>
RUN → TACKLE → 不BLOCK = 失败<br>
RUN → TACKLE → BLOCK → 不BLITZ = 成功<br>
RUN → TACKLE → BLOCK → BLITZ = 失败<br><br>

<b style="font-size:17px">⑤ PASS 的完整进攻 → 防守 → 反制流程</b><br>
<b>步骤1：</b>持球者打出 <b>PASS 🎯</b>。<br>
<b>步骤2：</b>从自己的队友中选择一名<b>接球队友</b>。PASS成功后，这名队友会成为新的持球者。<br>
<b>步骤3：</b>如果传球者是技能还没使用的 <b>QB</b>，系统先弹出“是否使用QB技能”。处理完技能后再进入防守。<br>
<b>步骤4：</b>系统进入防守时刻。防守方有三种选择：<br>
• <b>不防守</b> → PASS成功。<br>
• <b>INTERCEPTION 🦅</b> → 尝试抄截PASS。<br>
• <b>BLITZ ⚡</b> → PASS直接失败。<br><br>
<b>如果防守方选择“不防守”：</b><br>
PASS成功 → 接球队友获得球权 → 系统推进1格 → 新持球者可以继续进攻。<br><br>
<b>如果防守方打出 BLITZ：</b><br>
PASS失败 → 不推进 → 球仍由原进攻方持有。<br><br>
<b>如果防守方打出 INTERCEPTION：</b><br>
系统切回进攻方，进入<b>BLOCK反制时刻</b>。<br>
进攻方可以：<br>
• <b>不用 BLOCK</b> → INTERCEPTION成功 → 出INTERCEPTION的防守球员直接获得球权 → 攻守立即交换。<br>
• <b>打出 BLOCK 🛡️</b> → 取消INTERCEPTION。<br><br>
<b>如果进攻方用 BLOCK 取消抄截：</b><br>
系统再次切回防守方。防守方可以：<br>
• <b>放弃 BLITZ</b> → PASS成功 → 接球队友持球 → 推进1格。<br>
• <b>打出 BLITZ</b> → PASS最终失败 → 不推进。<br><br>
<b>PASS完整链：</b><br>
PASS → 选接球人 → 不防守 = 成功<br>
PASS → 选接球人 → BLITZ = 失败<br>
PASS → 选接球人 → INTERCEPTION → 不BLOCK = 抄截成功，防守方拿球<br>
PASS → 选接球人 → INTERCEPTION → BLOCK → 不BLITZ = PASS成功<br>
PASS → 选接球人 → INTERCEPTION → BLOCK → BLITZ = PASS失败<br><br>

<b style="font-size:17px">⑥ QB 身份技能的完整流程</b><br>
只有 <b>QB 打出 PASS</b> 时才会出现技能选择。<br>
PASS → 选择接球队友 → 系统弹出“是否使用身份卡技能？”<br>
• <b>暂不使用</b> → 技能保留，以后还能用。<br>
• <b>使用技能</b> → 技能立即消耗。<br>
如果这次PASS最终成功，本次推进按<b>2格</b>计算。<br>
如果已经选择使用技能，但PASS之后被 INTERCEPTION 或 BLITZ 阻止，<b>技能仍然算使用过，不返还。</b><br><br>

<b style="font-size:17px">⑦ 当蓝队/对方拿到球以后，攻防角色完全交换</b><br>
如果 INTERCEPTION 成功，蓝队马上成为进攻方。<br>
<b>单人模式：</b>电脑自动选择蓝队持球者并自动出 RUN/PASS；这时你是红队防守方。<br>
电脑出 <b>RUN</b> 后，你可以选择：<b>TACKLE / BLITZ / 不防守</b>。<br>
电脑出 <b>PASS</b> 后，你可以选择：<b>INTERCEPTION / BLITZ / 不防守</b>。<br>
如果你打出 TACKLE 或 INTERCEPTION，电脑可以根据手牌使用 BLOCK；如果电脑用了 BLOCK，你还有机会用 BLITZ 做最后反制。<br>
所以无论红队还是蓝队进攻，<b>攻防链规则完全相同，只是双方身份交换。</b><br><br>

<b style="font-size:17px">⑧ 每次进攻结束后发生什么？</b><br>
<b>进攻成功：</b>系统自动推进；持球者按RUN/PASS结果更新；如果当前进攻方还有可用的 RUN/PASS，就可以继续发动下一次进攻。<br>
<b>进攻失败：</b>不推进；系统检查当前队伍是否还能继续进攻。<br>
<b>抄截成功：</b>立即换球权，原防守方变成新的进攻方。<br><br>

<b style="font-size:17px">⑨ 什么时候需要重新选择持球者？</b><br>
如果当前持球者已经没有 RUN/PASS，但同队其他球员还有 RUN/PASS，系统会让该队<b>重新选择一名持球者</b>。<br>
如果整个队伍都没有 RUN/PASS，而另一队还有进攻牌，则球权交给另一队，由另一队选择持球者。<br><br>

<b style="font-size:17px">⑩ 一轮什么时候结束？</b><br>
当双方都已经没有可以继续使用的 RUN/PASS 时，本轮结束。<br>
系统收回并重新整理牌，然后按照人数重新发牌：2v2每人7张、3v3每人6张、4v4每人5张。<br>
下一轮由另一方先攻。<br>
<b>注意：普通的一轮结束不会把已经推进的码线清零；达阵后该队才重新从50码开始新的达阵推进。</b><br><br>

<b style="font-size:17px">⑪ TOUCHDOWN 的完整流程</b><br>
球队成功推进第1次：50→40。<br>
第2次：40→30。<br>
第3次：30→20。<br>
第4次：20→10。<br>
第4次成功后，当前持球者<b>自动从10码线冲入END ZONE</b> → 弹出 TOUCHDOWN → 获得1个🏈。<br>
不需要再出第5张进攻牌。<br>
达阵完成后，该队下一次达阵推进重新从50码线开始。<br><br>

<b style="font-size:17px">⑫ 整场比赛循环</b><br>
<b>选择持球者 → RUN/PASS进攻 → 对方防守 → 必要时BLOCK反制 → 必要时BLITZ最终反制 → 系统判定成功/失败 → 推进或换球权 → 继续下一次进攻 → 一轮结束重新发牌 → 第4次成功TOUCHDOWN → 获得🏈 → 继续比赛。</b><br><br>
当一支队伍获得第3个🏈时，系统立即结束比赛，这支队伍获胜。<br><br>

<b>⭐ 六张牌最简单记法</b><br>
🏃 RUN = 跑球进攻<br>
🎯 PASS = 传球进攻<br>
💥 TACKLE = 防RUN<br>
🦅 INTERCEPTION = 防PASS，成功会抢到球权<br>
🛡️ BLOCK = 取消TACKLE或INTERCEPTION<br>
⚡ BLITZ = 强力终止RUN/PASS，也可以在BLOCK后做最后反制
</div>`;

const en=`
<div style="font-size:15px;line-height:1.8">
<b style="font-size:19px">🏈 STRATEGY MODE: COMPLETE GAME FLOW</b><br>
This is not a list of examples. It explains the <b>full game flow</b> from the start of a drive to offense, defense, counters, possession changes, touchdowns, and winning the game.<br><br>

<b>1. Choose team size and play mode</b><br>
• 2v2: 7 cards per player.<br>• 3v3: 6 cards per player.<br>• 4v4: 5 cards per player.<br>
<b>Solo Mode:</b> you control Red Team and the computer controls Blue Team.<br>
<b>Local Multiplayer:</b> both teams are controlled by players and the device is passed when sides switch.<br><br>

<b>2. How to win</b><br>
Both teams begin at the <b>50-yard line</b>. Each successful offensive play advances one space:<br>
<b>1st: 50→40　 2nd: 40→30　 3rd: 30→20　 4th: 20→10→automatic run into the END ZONE</b><br>
The 4th successful play scores the TOUCHDOWN. There is no 5th play.<br>
Each TOUCHDOWN earns 1 🏈. <b>The first team to collect 3 🏈 wins.</b><br><br>

<b>3. Start a round: offense and ball carrier</b><br>
The game decides which team attacks first. The offensive team chooses a player who has a <b>RUN or PASS</b> card to become the ball carrier.<br>
The ball carrier then starts an offensive play by choosing RUN or PASS.<br><br>

<b style="font-size:17px">4. Complete RUN offense → defense → counter flow</b><br>
<b>Step 1:</b> The ball carrier plays <b>RUN 🏃</b>.<br>
<b>Step 2:</b> The game immediately enters the defense phase.<br>
<b>Step 3: The defense has three choices:</b><br>
• <b>No Defense</b> → RUN succeeds immediately.<br>
• <b>TACKLE 💥</b> → tries to stop RUN. TACKLE does not automatically steal possession.<br>
• <b>BLITZ ⚡</b> → the RUN fails immediately.<br><br>
<b>If the defense chooses No Defense:</b><br>
RUN succeeds → the system advances one space → the same ball carrier keeps the ball → if that offense still has RUN/PASS, it may continue attacking.<br><br>
<b>If the defense plays BLITZ:</b><br>
RUN fails → no advance → the original ball carrier keeps possession → the system checks the next available offensive action.<br><br>
<b>If the defense plays TACKLE:</b><br>
The game switches back to the offense for a <b>BLOCK response</b>.<br>
The offense may:<br>
• <b>Use no BLOCK</b> → TACKLE works → RUN fails.<br>
• <b>Play BLOCK 🛡️</b> → cancel TACKLE.<br><br>
<b>After BLOCK:</b><br>
The defense gets one final response:<br>
• <b>Skip BLITZ</b> → BLOCK protects the RUN → RUN succeeds → advance one space.<br>
• <b>Play BLITZ</b> → the offense is stopped → RUN fails.<br><br>
<b>Every RUN chain:</b><br>
RUN → No Defense = success<br>
RUN → BLITZ = fail<br>
RUN → TACKLE → No BLOCK = fail<br>
RUN → TACKLE → BLOCK → No BLITZ = success<br>
RUN → TACKLE → BLOCK → BLITZ = fail<br><br>

<b style="font-size:17px">5. Complete PASS offense → defense → counter flow</b><br>
<b>Step 1:</b> The ball carrier plays <b>PASS 🎯</b>.<br>
<b>Step 2:</b> Choose a teammate as the <b>receiver</b>. If the PASS succeeds, that teammate becomes the new ball carrier.<br>
<b>Step 3:</b> If the passer is a QB with an unused skill, the QB skill decision appears before defense.<br>
<b>Step 4:</b> The defense has three choices:<br>
• <b>No Defense</b> → PASS succeeds.<br>
• <b>INTERCEPTION 🦅</b> → tries to intercept the PASS.<br>
• <b>BLITZ ⚡</b> → PASS fails immediately.<br><br>
<b>If the defense chooses No Defense:</b><br>
PASS succeeds → the receiver gains possession → advance one space → the new ball carrier may continue the drive.<br><br>
<b>If the defense plays BLITZ:</b><br>
PASS fails → no advance → possession stays with the original offensive team.<br><br>
<b>If the defense plays INTERCEPTION:</b><br>
The game switches back to the offense for a <b>BLOCK response</b>.<br>
The offense may:<br>
• <b>Use no BLOCK</b> → INTERCEPTION succeeds → the defender who played it takes possession → offense and defense immediately switch.<br>
• <b>Play BLOCK 🛡️</b> → cancel the INTERCEPTION.<br><br>
<b>After BLOCK cancels the interception:</b><br>
The defense gets a final response:<br>
• <b>Skip BLITZ</b> → PASS succeeds → receiver takes the ball → advance one space.<br>
• <b>Play BLITZ</b> → PASS finally fails → no advance.<br><br>
<b>Every PASS chain:</b><br>
PASS → choose receiver → No Defense = success<br>
PASS → choose receiver → BLITZ = fail<br>
PASS → choose receiver → INTERCEPTION → No BLOCK = interception; defense takes possession<br>
PASS → choose receiver → INTERCEPTION → BLOCK → No BLITZ = PASS succeeds<br>
PASS → choose receiver → INTERCEPTION → BLOCK → BLITZ = PASS fails<br><br>

<b style="font-size:17px">6. Complete QB skill flow</b><br>
The QB skill decision appears only when the <b>QB plays PASS</b> and the skill is still unused.<br>
PASS → choose receiver → “Use QB Skill?”<br>
• <b>Skip Skill</b> → keep the skill for later.<br>
• <b>Use Skill</b> → the skill is consumed immediately.<br>
If the PASS finally succeeds, that play advances <b>2 spaces</b> instead of 1.<br>
If you already used the skill and the PASS is later stopped by INTERCEPTION or BLITZ, <b>the skill is still spent and is not refunded.</b><br><br>

<b style="font-size:17px">7. When Blue/the opponent gains possession</b><br>
A successful INTERCEPTION immediately makes the defending team the new offense.<br>
<b>Solo Mode:</b> the computer automatically chooses a Blue ball carrier and automatically plays RUN/PASS. You now defend as Red Team.<br>
When the computer plays <b>RUN</b>, you may choose <b>TACKLE / BLITZ / No Defense</b>.<br>
When the computer plays <b>PASS</b>, you may choose <b>INTERCEPTION / BLITZ / No Defense</b>.<br>
If you play TACKLE or INTERCEPTION, the computer may use BLOCK. If the computer uses BLOCK, you may still use BLITZ as the final response.<br>
The same attack-and-defense chain is used no matter which team has possession; the two teams simply switch roles.<br><br>

<b style="font-size:17px">8. What happens after each offensive play?</b><br>
<b>Successful play:</b> the system advances the team automatically, updates the ball carrier, and checks whether that offense can continue with another RUN/PASS.<br>
<b>Failed play:</b> no advance; the system checks whether the current team can continue attacking.<br>
<b>Successful interception:</b> possession changes immediately and the former defense becomes the offense.<br><br>

<b style="font-size:17px">9. When do you choose a new ball carrier?</b><br>
If the current ball carrier has no RUN/PASS but another teammate still has RUN/PASS, that team chooses a <b>new ball carrier</b>.<br>
If the entire team has no RUN/PASS but the other team still has offensive cards, possession goes to the other team and it chooses a ball carrier.<br><br>

<b style="font-size:17px">10. When does a round end?</b><br>
When neither team has any RUN/PASS cards left, the round ends.<br>
The game gathers the cards and redeals based on team size: 7 each in 2v2, 6 each in 3v3, or 5 each in 4v4.<br>
The other team attacks first in the next round.<br>
<b>Important: a normal round ending does not erase field progress. A team's field position resets to the 50 only after that team scores a touchdown.</b><br><br>

<b style="font-size:17px">11. Complete TOUCHDOWN flow</b><br>
1st successful play: 50→40.<br>
2nd: 40→30.<br>
3rd: 30→20.<br>
4th: 20→10.<br>
After the 4th success, the current ball carrier <b>automatically runs from the 10 into the END ZONE</b> → TOUCHDOWN appears → the team earns 1 🏈.<br>
You do not play a 5th offensive card.<br>
After the touchdown, that team's next touchdown drive begins again from the 50.<br><br>

<b style="font-size:17px">12. The full game loop</b><br>
<b>Choose ball carrier → RUN/PASS → opponent defends → BLOCK response if needed → final BLITZ response if needed → system decides success/failure → advance or change possession → continue attacking → redeal when the round ends → 4th success scores TOUCHDOWN → earn 🏈 → continue the game.</b><br><br>
When one team collects its 3rd 🏈, the game ends immediately and that team wins.<br><br>

<b>⭐ Six-card quick reference</b><br>
🏃 RUN = running offense<br>
🎯 PASS = passing offense<br>
💥 TACKLE = defend against RUN<br>
🦅 INTERCEPTION = defend against PASS; a successful interception changes possession<br>
🛡️ BLOCK = cancel TACKLE or INTERCEPTION<br>
⚡ BLITZ = strongly stop RUN/PASS and can also be the final response after BLOCK
</div>`;

function apply(){
 if(!window.I18N)return;
 I18N.zh.rulesBody=zh;
 I18N.en.rulesBody=en;
 if(typeof updateStaticText==='function')updateStaticText();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();