(() => {
'use strict';

const $ = id => document.getElementById(id);

function isRpsLesson(){
  return ($('lessonTitle')?.textContent || '').trim() === 'Who Starts?';
}

function rpsPromptReady(){
  const text = ($('guideText')?.textContent || '').trim();
  return /Choose Rock\.?$/i.test(text) || /Choose Rock/i.test(text);
}

function syncRpsChoices(){
  const wrap = $('contextActions');
  if(!wrap) return;
  const buttons = [...wrap.querySelectorAll('.choiceBtn')];
  if(!isRpsLesson() || buttons.length < 3) return;

  const ready = rpsPromptReady();
  buttons.forEach(btn => {
    btn.disabled = !ready;
    btn.style.pointerEvents = ready ? 'auto' : 'none';
    btn.style.visibility = ready ? 'visible' : 'hidden';
  });
}

// Prevent the Rock/Paper/Scissors buttons from firing before the coach
// has actually entered the action step. Early clicks used to corrupt the
// tutorial state and leave the coach dialogue blank.
document.addEventListener('click', e => {
  const btn = e.target.closest?.('.choiceBtn');
  if(!btn || !isRpsLesson()) return;
  if(!rpsPromptReady()){
    e.preventDefault();
    e.stopImmediatePropagation();
    syncRpsChoices();
  }
}, true);

const observer = new MutationObserver(syncRpsChoices);
['lessonTitle','guideText','contextActions'].forEach(id => {
  const el = $(id);
  if(el) observer.observe(el,{childList:true,subtree:true,characterData:true});
});

syncRpsChoices();
})();