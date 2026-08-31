(()=>{
  const forceEnglish=()=>{
    const root=document.documentElement;
    const btn=document.getElementById('langBtn');
    if(btn){
      const text=(btn.textContent||'').trim();
      const isChinese=(root.getAttribute('lang')||'').toLowerCase().startsWith('zh') || /Switch to English|中文\s*\/\s*EN|切换到英文/.test(text);
      if(isChinese) btn.click();
      btn.style.display='none';
      btn.setAttribute('aria-hidden','true');
      btn.tabIndex=-1;
    }
    root.setAttribute('lang','en');
    root.style.visibility='visible';
  };

  const renameVisibleCardText=(node=document.body)=>{
    if(!node)return;
    const replaceText=n=>{if(n.nodeType===Node.TEXT_NODE&&/BLITZ/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/BLITZ/g,'BREAK THROUGH')};
    if(node.nodeType===Node.TEXT_NODE)replaceText(node);
    else{
      const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
      let n;while(n=walker.nextNode())replaceText(n);
      if(node.querySelectorAll){
        node.querySelectorAll('[title],[aria-label],[alt]').forEach(el=>{
          ['title','aria-label','alt'].forEach(a=>{if(el.hasAttribute(a))el.setAttribute(a,el.getAttribute(a).replace(/BLITZ/g,'BREAK THROUGH'))})
        });
      }
    }
  };

  forceEnglish();
  renameVisibleCardText();
  const observer=new MutationObserver(mutations=>{
    mutations.forEach(m=>{
      if(m.type==='characterData')renameVisibleCardText(m.target);
      m.addedNodes&&m.addedNodes.forEach(renameVisibleCardText);
    });
  });
  if(document.body)observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  requestAnimationFrame(()=>{forceEnglish();renameVisibleCardText()});
})();
