(function(){
  var toastT;
  function toast(msg){var t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show')},2200);}
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
  function fallbackCopy(text){
    var ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.top='-1000px';
    document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,text.length);var ok=false;
    try{ok=document.execCommand('copy');}catch(e){ok=false;}
    document.body.removeChild(ta);return ok;
  }
  function copy(text){
    if(navigator.clipboard&&window.isSecureContext){
      navigator.clipboard.writeText(text).then(function(){toast('Gekopieer!');},function(){toast(fallbackCopy(text)?'Gekopieer!':'Hou jou vinger op die teks en kies Copy');});
    }else{toast(fallbackCopy(text)?'Gekopieer!':'Hou jou vinger op die teks en kies Copy');}
  }
  function carousel(post){
    var wrap=el('div'),box=el('div','carousel'),track=el('div','track');
    var n=post.slides.length,i=0;
    post.slides.forEach(function(s,k){var d=el('div','slide');var im=document.createElement('img');im.src=s.src;im.alt=s.alt;im.loading=k===0?'eager':'lazy';im.draggable=false;d.appendChild(im);track.appendChild(d);});
    box.appendChild(track);wrap.appendChild(box);
    var prev,next,dots=[],counter=el('p','counter'),dl;
    function go(k){i=Math.max(0,Math.min(n-1,k));track.style.transform='translateX('+(-100*i)+'%)';
      if(prev){prev.disabled=i===0;next.disabled=i===n-1;}
      dots.forEach(function(d,j){d.classList.toggle('on',j===i);d.setAttribute('aria-current',j===i?'true':'false');});
      counter.textContent=n>1?('Skyfie '+(i+1)+' van '+n):'Enkelbeeld';
      dl.href=post.slides[i].download;dl.setAttribute('download',post.slides[i].download.split('/').pop());
      dl.textContent=n>1?('Laai skyfie '+(i+1)+' af'):'Laai beeld af';}
    if(n>1){
      prev=el('button','arrow prev','‹');prev.setAttribute('aria-label','Vorige skyfie');
      next=el('button','arrow next','›');next.setAttribute('aria-label','Volgende skyfie');
      prev.onclick=function(){go(i-1)};next.onclick=function(){go(i+1)};box.appendChild(prev);box.appendChild(next);
      var dw=el('div','dots');
      for(var k=0;k<n;k++){(function(k){var d=el('button','dot');d.setAttribute('aria-label','Skyfie '+(k+1));d.onclick=function(){go(k)};dw.appendChild(d);dots.push(d);})(k);}
      wrap.appendChild(dw);
      var x0=null,y0=null,dx=0;
      box.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY;dx=0;track.style.transition='none';},{passive:true});
      box.addEventListener('touchmove',function(e){if(x0===null)return;dx=e.touches[0].clientX-x0;var dy=e.touches[0].clientY-y0;
        if(Math.abs(dx)>Math.abs(dy)){track.style.transform='translateX(calc('+(-100*i)+'% + '+dx+'px))';}},{passive:true});
      box.addEventListener('touchend',function(){track.style.transition='';if(x0!==null){if(dx<-40)go(i+1);else if(dx>40)go(i-1);else go(i);}x0=null;});
      box.tabIndex=0;box.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')go(i-1);if(e.key==='ArrowRight')go(i+1);});
    }
    wrap.appendChild(counter);
    var btns=el('div','btns');dl=el('a','btn');btns.appendChild(dl);
    if(post.zip){var z=el('a','btn cyan',n>1?'Laai alles af (zip)':'Laai af as zip');z.href=post.zip;z.setAttribute('download',post.zip.split('/').pop());btns.appendChild(z);}
    wrap.appendChild(btns);go(0);return wrap;
  }
  function captionBlock(label,text){
    var f=document.createDocumentFragment();f.appendChild(el('p','label',label));
    f.appendChild(el('pre','caption',text));
    var b=el('div','btns'),c=el('button','btn red','Kopieer caption');c.onclick=function(){copy(text)};b.appendChild(c);f.appendChild(b);return f;
  }
  function render(data){
    var root=document.getElementById('weeks');root.innerHTML='';
    data.weeks.forEach(function(w){
      var sec=el('section');sec.id=w.id;sec.appendChild(el('h2','week-title',w.title));if(w.note)sec.appendChild(el('p','week-note',w.note));
      w.posts.forEach(function(p){
        var a=el('article','panel');a.id=p.id;var h=el('div','post-head');h.appendChild(el('span','issue',p.issue||''));h.appendChild(el('h3',null,p.title));a.appendChild(h);
        a.appendChild(el('span','type',p.type));if(p.check_note)a.appendChild(el('p','check-note',p.check_note));a.appendChild(carousel(p));
        a.appendChild(captionBlock('Caption',p.caption));
        if(p.alt_caption)a.appendChild(captionBlock(p.alt_caption.label,p.alt_caption.text));
        if(p.trailer){var t=el('p','trailer','Kursusblad met trailer: ');var l=el('a',null,p.trailer.label);l.href=p.trailer.url;l.target='_blank';l.rel='noopener';t.appendChild(l);a.appendChild(t);}
        sec.appendChild(a);
      });
      root.appendChild(sec);
    });
  }
  fetch('posts.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(render).catch(function(){document.getElementById('weeks').innerHTML='<p class="loading">Kon nie die posts laai nie. Herlaai die bladsy.</p>';});
})();
