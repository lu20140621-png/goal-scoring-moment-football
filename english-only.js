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
  forceEnglish();
  requestAnimationFrame(forceEnglish);
})();
