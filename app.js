(() => {
  const $ = id => document.getElementById(id);
  const audio = $('audio');
  let tracks = [], current = -1, lastSpoken = 0, voices = [];
  const defaults = {enabled:true, personality:'warm', rate:1, pitch:1, interval:30, voice:''};
  let settings = {...defaults};
  try { settings = {...defaults, ...JSON.parse(localStorage.getItem('mixdj.settings') || '{}')}; } catch {}
  const phrases = {
    warm: {intro:(t,a)=>`Y ahora, para acompañar este momento, llega ${t}, de ${a}. Disfrútela.`, transition:(t,a)=>`Seguimos compartiendo buena música. Ahora suena ${t}, interpretada por ${a}.`, custom:'Qué alegría tenerle por aquí. Sigamos disfrutando de la música.'},
    energetic:{intro:(t,a)=>`¡Suba el volumen! Esto es ${t}, de ${a}. ¡Que se sienta la energía!`,transition:(t,a)=>`¡La música no se detiene! Vamos con ${t}, de ${a}. ¡A disfrutar!`,custom:'¡La energía está arriba! Gracias por seguir en MixDj.'},
    elegant:{intro:(t,a)=>`Continuamos con una selección especial: ${t}, de ${a}. Que la disfrute.`,transition:(t,a)=>`Es momento de una nueva interpretación: ${t}, de ${a}.`,custom:'Es un placer compartir este espacio musical con usted.'},
    relaxed:{intro:(t,a)=>`Vamos con calma y buena música: ${t}, de ${a}.`,transition:(t,a)=>`Y seguimos en este ambiente. Ahora, ${t}, de ${a}.`,custom:'Tómese un respiro y disfrute de este momento musical.'}
  };
  function save(){localStorage.setItem('mixdj.settings',JSON.stringify(settings));}
  function setActivity(msg){$('activityText').textContent=msg;}
  function refreshVoices(){voices=speechSynthesis.getVoices().filter(v=>/^es([-_]|$)/i.test(v.lang));const sel=$('voice');const chosen=settings.voice;sel.innerHTML='<option value="">Automática (español)</option>';voices.forEach((v,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`${v.name} · ${v.lang}`;sel.appendChild(o)});if(chosen!==''&&voices[Number(chosen)])sel.value=chosen;$('voiceStatus').textContent=voices.length?`${voices.length} voces en español disponibles`:'Usará la voz predeterminada del navegador';}
  function syncUI(){ $('djEnabled').checked=!!settings.enabled;$('enabledText').textContent=settings.enabled?'Activada':'Desactivada';$('personality').value=settings.personality;$('rate').value=settings.rate;$('rateValue').textContent=Number(settings.rate).toFixed(2)+'×';$('pitch').value=settings.pitch;$('pitchValue').textContent=Number(settings.pitch).toFixed(2);$('interval').value=settings.interval;$('intervalValue').textContent=settings.interval+' s';$('statusChip').textContent=settings.enabled?'LISTA':'PAUSADA';}
  function speak(text,force=false){if(!settings.enabled&&!force){setActivity('Active la locutora para realizar esta prueba.');return;}if(!('speechSynthesis'in window)){setActivity('Este navegador no admite síntesis de voz.');return;}if(!force&&Date.now()-lastSpoken<Number(settings.interval)*1000){setActivity('Intervención omitida por el intervalo mínimo configurado.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-MX';u.rate=Number(settings.rate);u.pitch=Number(settings.pitch);const v=$('voice').value;if(v!==''&&voices[Number(v)])u.voice=voices[Number(v)];u.onstart=()=>{lastSpoken=Date.now();setActivity('La locutora está hablando…');};u.onend=()=>setActivity('Locución finalizada.');u.onerror=e=>setActivity('No se pudo reproducir la locución: '+e.error);speechSynthesis.speak(u);}
  function renderTracks(){const box=$('trackList');box.innerHTML='';if(!tracks.length){box.className='empty';box.textContent='Aún no has añadido canciones. Selecciona archivos de audio para comenzar.';return;}box.className='';tracks.forEach((t,i)=>{const row=document.createElement('div');row.className='track-row';const num=document.createElement('span');num.textContent=String(i+1);const name=document.createElement('span');name.textContent=t.name;const type=document.createElement('span');type.textContent=(t.file.type.split('/')[1]||'audio').toUpperCase();const action=document.createElement('button');action.textContent='▶ Reproducir';action.onclick=()=>playTrack(i);row.append(num,name,type,action);box.appendChild(row);});}
  function playTrack(i){if(!tracks.length)return;current=(i+tracks.length)%tracks.length;const t=tracks[current];audio.src=t.url;audio.play().then(()=>{ $('nowTitle').textContent=t.name;$('nowArtist').textContent='Archivo local';$('demoTitle').textContent=t.name;$('demoArtist').textContent='Archivo local';$('play').textContent='Ⅱ';if(settings.enabled){const msg=phrases[settings.personality].intro(t.name,'su archivo local');speak(msg);}}).catch(()=>setActivity('No se pudo reproducir el archivo seleccionado.'));}
  $('files').addEventListener('change',e=>{[...e.target.files].forEach(file=>{if(file.type.startsWith('audio/'))tracks.push({name:file.name.replace(/\.[^.]+$/,''),file,url:URL.createObjectURL(file)});});renderTracks();e.target.value='';});
  $('play').onclick=()=>{if(!tracks.length){$('files').click();return;}if(audio.paused){if(!audio.src)playTrack(current<0?0:current);else audio.play();$('play').textContent='Ⅱ';}else{audio.pause();$('play').textContent='▶';}};
  $('next').onclick=()=>playTrack(current+1);$('prev').onclick=()=>playTrack(current<=0?tracks.length-1:current-1);
  audio.addEventListener('ended',()=>{if(current<tracks.length-1)playTrack(current+1);else{$('play').textContent='▶';setActivity('Fin de la lista de reproducción.');}});
  audio.addEventListener('timeupdate',()=>{if(!audio.duration)return;$('seek').value=String(audio.currentTime/audio.duration*1000);$('elapsed').textContent=fmt(audio.currentTime);$('duration').textContent=fmt(audio.duration);});
  $('seek').oninput=()=>{if(audio.duration)audio.currentTime=Number($('seek').value)/1000*audio.duration;};$('volume').oninput=()=>audio.volume=Number($('volume').value);audio.volume=.8;
  function fmt(s){if(!Number.isFinite(s))return'0:00';return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;}
  $('djEnabled').onchange=e=>{settings.enabled=e.target.checked;save();syncUI();if(!settings.enabled)speechSynthesis.cancel();setActivity(settings.enabled?'Locutora activada.':'Locutora desactivada.');};
  $('personality').onchange=e=>{settings.personality=e.target.value;save();};
  $('rate').oninput=e=>{settings.rate=Number(e.target.value);$('rateValue').textContent=settings.rate.toFixed(2)+'×';save();};
  $('pitch').oninput=e=>{settings.pitch=Number(e.target.value);$('pitchValue').textContent=settings.pitch.toFixed(2);save();};
  $('interval').oninput=e=>{settings.interval=Number(e.target.value);$('intervalValue').textContent=settings.interval+' s';save();};
  $('voice').onchange=e=>{settings.voice=e.target.value;save();};
  $('testVoice').onclick=()=>speak('Hola, soy la locutora virtual de MixDj. Estoy lista para acompañar tu música.',true);$('stopVoice').onclick=()=>{speechSynthesis.cancel();setActivity('Locución detenida.');};
  $('sayCustom').onclick=()=>{const m=$('customMessage').value.trim();if(!m){setActivity('Escribe un mensaje antes de enviarlo.');return;}speak(m,true);};
  $('demoIntro').onclick=()=>speak(phrases[settings.personality].intro($('demoTitle').textContent,$('demoArtist').textContent),true);
  $('demoTransition').onclick=()=>speak(phrases[settings.personality].transition($('demoTitle').textContent,$('demoArtist').textContent),true);
  $('goDj').onclick=()=>$('locutora').scrollIntoView({behavior:'smooth'});
  window.addEventListener('beforeunload',()=>tracks.forEach(t=>URL.revokeObjectURL(t.url)));
  syncUI();refreshVoices();if('speechSynthesis'in window)speechSynthesis.onvoiceschanged=refreshVoices;
  if('serviceWorker'in navigator && location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
