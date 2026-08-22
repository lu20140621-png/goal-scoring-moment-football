(()=>{
function addStyle(){
 if(document.getElementById('strategyDesktopUiStyle'))return;
 const s=document.createElement('style');s.id='strategyDesktopUiStyle';
 s.textContent=`
 @media (min-width:900px){
   #manualModal,#rulesModal{align-items:center!important;padding:24px!important;overflow:hidden!important;}
   #manualModal .modalBox,#rulesModal .modalBox{
     width:min(1120px,88vw)!important;
     max-width:none!important;
     height:min(860px,88vh)!important;
     max-height:none!important;
     overflow:auto!important;
     padding:0 22px 24px!important;
     border-radius:18px!important;
     box-shadow:0 28px 80px rgba(0,0,0,.48)!important;
     scroll-behavior:smooth;
     overscroll-behavior:contain;
   }
   #manualModal .modalBox>div:first-child,#rulesModal .modalBox>div:first-child{
     position:sticky!important;top:0;z-index:30;
     margin:0 -22px 0!important;padding:16px 22px 12px!important;
     background:linear-gradient(180deg,#111b14 0%,#111b14 86%,rgba(17,27,20,.95) 100%)!important;
     border-bottom:1px solid rgba(255,255,255,.10);
   }
   #manualHeading,#rulesHeading{font-size:22px!important;}
   #manualBody,#rulesBody{margin-top:0!important;padding-top:12px!important;}
   .manualLead,.guideLead{font-size:15px!important;padding:14px 16px!important;margin:0 0 10px!important;}
   .manualToc,.guideToc{
     position:sticky!important;top:61px!important;z-index:24!important;
     grid-template-columns:repeat(4,minmax(0,1fr))!important;
     gap:8px!important;margin:0 0 16px!important;padding:10px!important;
     background:#101a12f5!important;border:1px solid rgba(255,255,255,.08)!important;
     box-shadow:0 8px 18px rgba(0,0,0,.18)!important;
   }
   .manualToc a,.guideToc a{font-size:12px!important;padding:9px 8px!important;line-height:1.2!important;}
   .manualDoc section,.guideDoc section{scroll-margin-top:150px!important;padding:16px 18px!important;margin:12px 0!important;}
   .manualDoc h3,.guideDoc h3{font-size:19px!important;}
   .manualDoc p,.manualDoc li,.guideDoc p,.guideDoc li{font-size:14px!important;line-height:1.7!important;}
   .comboChain,.chain{font-size:14px!important;padding:10px 12px!important;}
 }
 `;
 document.head.appendChild(s);
}
function wireModal(modalId,tocSelector){
 const modal=document.getElementById(modalId);if(!modal||modal.dataset.desktopWired)return;
 modal.dataset.desktopWired='1';
 modal.addEventListener('click',e=>{
   const a=e.target.closest(tocSelector+' a'); if(!a)return;
   const href=a.getAttribute('href'); if(!href||!href.startsWith('#'))return;
   const target=modal.querySelector(href); if(!target)return;
   e.preventDefault();
   const box=modal.querySelector('.modalBox');
   const top=target.offsetTop-145;
   box.scrollTo({top:Math.max(0,top),behavior:'smooth'});
   history.replaceState(null,'',location.pathname+location.search);
 });
}
function apply(){addStyle();wireModal('manualModal','.manualToc');wireModal('rulesModal','.guideToc');}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,50));else setTimeout(apply,50);
const mo=new MutationObserver(()=>apply());mo.observe(document.documentElement,{childList:true,subtree:true});
})();