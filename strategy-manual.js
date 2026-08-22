(()=>{
const manual={zh:`<div style="font-size:15px;line-height:1.8">
<b style="font-size:19px">🏈 策略模式 · 单人模式说明书</b><br>
这部分是<b>正式说明书</b>：告诉你开局怎么准备、怎么分队、谁先拿球、每回合按什么顺序进行。具体每张牌的全部攻防分支，请看旁边的“玩法说明”。<br><br>
<b>一、游戏人数与分队</b><br>
先选择 <b>2v2、3v3 或 4v4</b>。<br>
• 2v2：红队2人、蓝队2人，每人7张牌。<br>
• 3v3：红队3人、蓝队3人，每人6张牌。<br>
• 4v4：红队4人、蓝队4人，每人5张牌。<br>
在<b>单人模式</b>中，你固定控制红队全部球员；蓝队全部球员由电脑控制。你不需要替蓝队出牌。<br><br>
<b>二、身份卡怎么分</b><br>
每队会有球员身份，其中一名球员会成为 <b>QUARTERBACK（QB）</b>。身份由系统分配。<br>
QB有一次身份技能：QB打出PASS并选择接球队友后，系统会询问是否使用技能。使用后，如果PASS最终成功，本次推进2格。技能每局只能使用一次。<br><br>
<b>三、开局怎么决定谁先拿球</b><br>
正式规则使用<b>石头剪刀布</b>决定第一轮球权。获胜的一方成为第一轮进攻方，并先获得球权。<br>
单人模式中，你代表红队与电脑蓝队进行开局判定；系统完成判定后会告诉你哪一队先攻。<br>
<b>之后每一轮结束，先攻权轮换：</b>红 → 蓝 → 红 → 蓝……不需要再次石头剪刀布。<br><br>
<b>四、发牌</b><br>
确定人数后，系统洗牌并按人数发牌：2v2每人7张、3v3每人6张、4v4每人5张。<br>
手牌中可能出现：RUN、PASS、TACKLE、INTERCEPTION、BLOCK、BLITZ。<br>
牌不是“出一张马上补一张”。<b>本轮使用手牌进行攻防，本轮结束后系统统一收牌、洗牌并重新发牌。</b><br><br>
<b>五、一轮开始时先做什么</b><br>
先攻方先选择一名<b>有RUN或PASS的球员</b>作为持球者。球会显示在该球员身上。<br>
然后进入进攻阶段。只有当前持球者可以发动RUN或PASS。<br><br>
<b>六、每一次进攻的固定顺序</b><br>
每次进攻都按下面顺序：<br>
<b>1. 进攻方行动</b> → 持球者选择RUN或PASS。<br>
<b>2. PASS时选接球队友</b> → RUN不需要选队友。<br>
<b>3. QB技能判断</b> → 如果QB打PASS且技能可用，决定是否使用。<br>
<b>4. 防守方行动</b> → 根据进攻类型选择合适的防守牌或不防守。<br>
<b>5. 进攻方反制</b> → 如果遇到TACKLE或INTERCEPTION，可以决定是否用BLOCK。<br>
<b>6. 防守方最后反制</b> → BLOCK后，防守方如果有BLITZ，可以决定是否使用。<br>
<b>7. 系统结算</b> → 自动判断成功、失败、推进或换球权。<br><br>
<b>七、进攻方每回合应该做什么</b><br>
轮到你进攻时，只需要按这个顺序想：<br>
<b>谁拿球？ → RUN还是PASS？ → PASS给谁？ → QB技能用不用？ → 等对方防守 → 有BLOCK时要不要反制。</b><br>
成功后系统自动推进，不需要手动点“+1”。<br><br>
<b>八、防守方每回合应该做什么</b><br>
对方进攻时先看他出了什么：<br>
• 对方出 <b>RUN</b> → 你可以用 <b>TACKLE、BLITZ</b> 或不防守。<br>
• 对方出 <b>PASS</b> → 你可以用 <b>INTERCEPTION、BLITZ</b> 或不防守。<br>
如果你的TACKLE/INTERCEPTION被BLOCK取消，你还有机会用BLITZ做最后反制。<br>
单人模式中，蓝队进攻时由电脑自动出RUN/PASS，你只负责红队的防守选择。<br><br>
<b>九、一次进攻结束以后</b><br>
• 进攻成功 → 系统自动推进1格；QB技能成功时按技能效果推进。<br>
• 进攻失败 → 不推进。<br>
• INTERCEPTION成功 → 防守方立即获得球权，攻守交换。<br>
如果当前持球者不能继续进攻，但同队其他人还有RUN/PASS，系统会让该队重新选择持球者。<br><br>
<b>十、一轮什么时候结束</b><br>
当双方都没有可以继续使用的RUN/PASS时，本轮结束。<br>
系统统一收回牌并重新发牌。<br>
下一轮的先攻方换成上一轮先攻方的对手。<br>
<b>普通轮次结束不会清除已经推进的场地进度。</b><br><br>
<b>十一、怎么TOUCHDOWN</b><br>
每队从50码开始自己的推进：<br>
<b>50 → 40 → 30 → 20 → 10 → END ZONE</b><br>
第1次成功到40，第2次到30，第3次到20，第4次成功到10后，持球者自动冲入END ZONE完成TOUCHDOWN。<br>
<b>不需要第5次成功。</b><br>
TOUCHDOWN后获得1个🏈，该队下一次达阵推进重新从50码开始。<br><br>
<b>十二、怎么赢</b><br>
<b>先获得3个🏈的队伍立即获胜。</b><br><br>
<b>⭐ 一轮最简单记法</b><br>
<b>决定先攻 → 发牌 → 选持球者 → 进攻 → 防守 → 反制 → 系统结算 → 继续攻防 → 双方无进攻牌 → 重新发牌 → 下一轮换另一队先攻。</b>
</div>`,en:`<div style="font-size:15px;line-height:1.8">
<b style="font-size:19px">🏈 STRATEGY MODE · SOLO MODE RULEBOOK</b><br>
This is the <b>rulebook</b>: setup, teams, first possession, dealing, and what happens each round. For every detailed card-response branch, open “How to Play.”<br><br>
<b>1. Choose team size and teams</b><br>
Choose <b>2v2, 3v3, or 4v4</b>.<br>
• 2v2: 2 Red vs 2 Blue; 7 cards each.<br>
• 3v3: 3 Red vs 3 Blue; 6 cards each.<br>
• 4v4: 4 Red vs 4 Blue; 5 cards each.<br>
In <b>Solo Mode</b>, you control every Red player. The computer controls every Blue player. You never play Blue's cards for it.<br><br>
<b>2. Assign roles</b><br>
Each team has player roles, including one <b>QUARTERBACK (QB)</b>. Roles are assigned by the game.<br>
The QB has a once-per-game skill. After the QB plays PASS and a receiver is chosen, the game asks whether to use it. If that PASS finally succeeds, the play advances 2 spaces. The skill can be used only once per game.<br><br>
<b>3. Decide first possession</b><br>
The official setup uses <b>Rock-Paper-Scissors</b> to decide the first possession. The winner attacks first and starts with the ball.<br>
In Solo Mode, you represent Red Team and the computer represents Blue Team; the game handles the opening decision and tells you who attacks first.<br>
<b>After that, first offense alternates each round:</b> Red → Blue → Red → Blue. Do not repeat Rock-Paper-Scissors every round.<br><br>
<b>4. Deal cards</b><br>
Shuffle and deal by team size: 7 each in 2v2, 6 each in 3v3, and 5 each in 4v4.<br>
Cards may include RUN, PASS, TACKLE, INTERCEPTION, BLOCK, and BLITZ.<br>
You do <b>not</b> draw a replacement every time a card is played. Use your hand during the round; when the round ends, the game gathers, shuffles, and redeals the cards.<br><br>
<b>5. Start of a round</b><br>
The offensive team chooses a player who has <b>RUN or PASS</b> to become the ball carrier. The football appears on that player.<br>
Only the current ball carrier can start the next RUN or PASS.<br><br>
<b>6. Fixed order for every offensive play</b><br>
<b>1. Offense acts</b> → ball carrier chooses RUN or PASS.<br>
<b>2. Choose a receiver for PASS</b> → RUN needs no receiver.<br>
<b>3. QB skill decision</b> → if the QB passes and the skill is available.<br>
<b>4. Defense acts</b> → play a legal defense card or choose No Defense.<br>
<b>5. Offense may counter</b> → BLOCK may answer TACKLE or INTERCEPTION.<br>
<b>6. Defense gets the final response</b> → after BLOCK, BLITZ may be used if available.<br>
<b>7. System resolves the play</b> → success, failure, advance, or possession change is calculated automatically.<br><br>
<b>7. What to do on offense</b><br>
Think in this order:<br>
<b>Who has the ball? → RUN or PASS? → Who receives the PASS? → Use QB skill? → Wait for defense → Use BLOCK if needed?</b><br>
Successful plays advance automatically. Never press a manual “+1.”<br><br>
<b>8. What to do on defense</b><br>
Watch the offensive card:<br>
• Against <b>RUN</b> → use <b>TACKLE, BLITZ</b>, or No Defense.<br>
• Against <b>PASS</b> → use <b>INTERCEPTION, BLITZ</b>, or No Defense.<br>
If your TACKLE/INTERCEPTION is canceled by BLOCK, you may still use BLITZ as the final response.<br>
In Solo Mode, when Blue attacks, the computer automatically chooses RUN/PASS and you only make Red Team's defensive choices.<br><br>
<b>9. After an offensive play</b><br>
• Success → advance automatically.<br>
• Failure → no advance.<br>
• Successful INTERCEPTION → defense immediately takes possession and the teams switch offense/defense.<br>
If the current ball carrier cannot attack but a teammate still has RUN/PASS, choose a new ball carrier.<br><br>
<b>10. When a round ends</b><br>
A round ends when neither team has a RUN/PASS available to continue.<br>
The game gathers the cards and redeals them.<br>
The team that did not start the previous round attacks first in the next round.<br>
<b>A normal round ending does not erase field progress.</b><br><br>
<b>11. Score a TOUCHDOWN</b><br>
Each team's drive begins at the 50:<br>
<b>50 → 40 → 30 → 20 → 10 → END ZONE</b><br>
1st success reaches 40, 2nd reaches 30, 3rd reaches 20, and on the 4th success the ball carrier reaches the 10 and automatically runs into the END ZONE.<br>
<b>There is no 5th successful play.</b><br>
A TOUCHDOWN earns 1 🏈. That team's next touchdown drive starts again at the 50.<br><br>
<b>12. Win the game</b><br>
<b>The first team to collect 3 🏈 wins immediately.</b><br><br>
<b>⭐ Round summary</b><br>
<b>Decide first offense → deal → choose ball carrier → offense → defense → counters → automatic result → continue → no offense cards left → redeal → other team starts the next round.</b>
</div>`};
function build(){
 const top=document.querySelector('.topbar > div:last-child'); if(!top||document.getElementById('manualBtn'))return;
 const btn=document.createElement('button'); btn.className='btn'; btn.id='manualBtn'; top.insertBefore(btn,document.getElementById('rulesBtn'));
 const modal=document.createElement('div'); modal.className='modal'; modal.id='manualModal'; modal.innerHTML='<div class="modalBox"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><h2 style="margin:0" id="manualHeading"></h2><button class="btn" id="closeManualBtn"></button></div><div style="margin-top:12px;line-height:1.75;color:#dbe5de" id="manualBody"></div></div>'; document.body.appendChild(modal);
 btn.onclick=()=>{render();modal.classList.add('show')}; document.getElementById('closeManualBtn').onclick=()=>modal.classList.remove('show'); modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
 render();
}
function render(){const lang=(window.G&&G.lang)||document.documentElement.lang.startsWith('en')?'en':'zh';const en=lang==='en';document.getElementById('manualBtn').textContent=en?'Rulebook':'说明书';document.getElementById('manualHeading').textContent=en?'Strategy Mode Rulebook':'策略模式说明书';document.getElementById('closeManualBtn').textContent=en?'Close':'关闭';document.getElementById('manualBody').innerHTML=manual[lang];}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
const old=window.updateStaticText; if(typeof old==='function')window.updateStaticText=function(){old();setTimeout(render,0)};
})();