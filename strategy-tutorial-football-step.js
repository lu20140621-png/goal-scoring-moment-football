// Lesson 2 enhancement: show the real FOOTBALL CARD and make it interactive.
Z[1].t='2. 认识 FOOTBALL CARD';
Z[1].x='FOOTBALL 本身就是一张真实卡牌。整场比赛只有1张。谁拿着这张 FOOTBALL CARD，谁就是当前持球者；只有当前持球者才能用 RUN 或 PASS 发起进攻。请点击下面正在发光的 FOOTBALL CARD。';
Z[1].r='FOOTBALL CARD 不属于普通功能牌，它只代表球权，并会随着 RUN、PASS、INTERCEPTION 的结果在球员之间移动。';
Z[1].f=['展示 FOOTBALL CARD','只有1张','= 当前球权','持球者才能进攻'];
Z[1].cards=['FOOTBALL'];
Z[1].target='FOOTBALL';
delete Z[1].b;

E[1].t='2. Meet the FOOTBALL CARD';
E[1].x='The FOOTBALL is a real card. There is exactly one FOOTBALL CARD in the entire game. Whoever holds it is the current ball carrier, and only the ball carrier may start an offense with RUN or PASS. Tap the glowing FOOTBALL CARD below.';
E[1].r='The FOOTBALL CARD is not a normal Action Card. It represents possession and moves between players according to the results of RUN, PASS, and INTERCEPTION.';
E[1].f=['Show the FOOTBALL CARD','Exactly 1 card','= current possession','Ball carrier starts offense'];
E[1].cards=['FOOTBALL'];
E[1].target='FOOTBALL';
delete E[1].b;

if(step===1) render();
