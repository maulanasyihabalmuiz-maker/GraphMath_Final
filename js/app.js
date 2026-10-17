/* GraphMath app: navigasi, pemeriksaan jawaban, skor, checkpoint, dan penyimpanan lokal. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const LEVELS = window.GRAPHMATH_LEVELS;
  const PAGE_IDS = ['introPage','homePage','materialPage','tutorialPage','infoPage','levelsPage','gamePage','checkpointPage','testPage'];
  const KEY = {score:'graphmath-v3-score',completed:'graphmath-v3-completed',unlocked:'graphmath-v3-unlocked',current:'graphmath-v3-current',motion:'graphmath-v3-motion',bgm:'graphmath-v5-bgm',bgmVolume:'graphmath-v5-bgm-volume',testScore:'graphmath-v4-test-score'};
  // localStorage tersedia di browser biasa; gunakan penyimpanan sementara jika akses dibatasi.
  const storage = (() => {
    try { const s = window.localStorage; const probe = '__graphmath_probe__'; s.setItem(probe, '1'); s.removeItem(probe); return s; }
    catch (_) { const memory = new Map(); return { getItem:k=>memory.has(k)?memory.get(k):null, setItem:(k,v)=>memory.set(k,String(v)), removeItem:k=>memory.delete(k) }; }
  })();
  let score = Number(storage.getItem(KEY.score) || 0);
  let completed = new Set(readJSON(KEY.completed, []));
  let highestUnlocked = Math.max(1, Math.min(6, Number(storage.getItem(KEY.unlocked) || 1)));
  let currentLevel = Math.max(1, Math.min(6, Number(storage.getItem(KEY.current) || 1)));
  let level = null, tries = 0, correct = false, moved = false, moving = false, graphProgress = 0, playerPos = null, animationFrame = null, startFlow = false, hintIndex = 0;
  let motionEnabled = storage.getItem(KEY.motion) !== 'false';
  const canvas = $('gameCanvas');

  function readJSON(key, fallback){ try { const v = JSON.parse(storage.getItem(key) || 'null'); return Array.isArray(v) ? v : fallback; } catch { return fallback; } }
  function persist(){
    storage.setItem(KEY.score, String(score));
    storage.setItem(KEY.completed, JSON.stringify([...completed]));
    storage.setItem(KEY.unlocked, String(highestUnlocked));
    storage.setItem(KEY.current, String(currentLevel));
    storage.setItem(KEY.motion, String(motionEnabled));
    updateHeader();
  }
  function updateHeader(){
    $('headerLevel').textContent = `LEVEL ${currentLevel}`;
    const hasSave = storage.getItem(KEY.current) !== null;
    $('homeContinue').classList.toggle('hidden', !hasSave);
    if ($('progressText')) $('progressText').textContent = `${completed.size} / ${LEVELS.length}`;
    if ($('homeTest')) $('homeTest').classList.toggle('hidden', !completed.has(6));
  }
  function go(pageId){
    if (!PAGE_IDS.includes(pageId)) return;
    PAGE_IDS.forEach(id => $(id).classList.toggle('active', id === pageId));
    window.scrollTo({top:0, behavior: motionEnabled ? 'smooth' : 'auto'});
    if (pageId !== 'materialPage') $('materialVideo').pause();
    if (pageId !== 'tutorialPage') $('tutorialVideo').pause();
    if (pageId === 'levelsPage') renderLevels();
    if (pageId === 'gamePage' && level) renderWorld();
    if (pageId === 'testPage' && typeof window.GraphMathRenderTest === 'function') window.GraphMathRenderTest();
    updateHeader();
    if (typeof window.GraphMathAudioSync === 'function') window.GraphMathAudioSync(pageId);
  }
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => go(button.dataset.go)));

  // Home navigation and the storyboard's optional material/tutorial sequence.
  $('homeStart').addEventListener('click', () => { startFlow = true; $('materialToLevels').textContent = 'Lanjut ke Tutorial →'; $('skipMaterial').textContent = 'Lewati Video'; go('materialPage'); });
  $('homeMaterial').addEventListener('click', () => { startFlow = false; $('materialToLevels').textContent = 'Pilih Level →'; $('skipMaterial').textContent = 'Lewati Video'; go('materialPage'); });
  $('homeTutorial').addEventListener('click', () => { startFlow = false; go('tutorialPage'); });
  $('homeLevel').addEventListener('click', () => { startFlow = false; go('levelsPage'); });
  $('homeContinue').addEventListener('click', () => { const target = completed.has(currentLevel) && currentLevel < 6 ? currentLevel + 1 : currentLevel; startLevel(Math.min(highestUnlocked, target)); });
  $('materialToLevels').addEventListener('click', () => { if (startFlow) { startFlow = false; go('tutorialPage'); } else go('levelsPage'); });
  $('skipMaterial').addEventListener('click', () => { if (startFlow) { startFlow = false; go('tutorialPage'); } else go('levelsPage'); });
  $('tutorialPlay').addEventListener('click', () => go('levelsPage'));
  $('materialVideo').addEventListener('error', () => videoFallback('materialVideo', 'Video materi belum dapat dibuka. Pastikan folder media dan file MP4 ikut diekstrak dari ZIP.'));
  $('tutorialVideo').addEventListener('error', () => videoFallback('tutorialVideo', 'Video tutorial belum dapat dibuka. Pastikan folder media dan file MP4 ikut diekstrak dari ZIP.'));
  function videoFallback(videoId, message){
    const video = $(videoId);
    if (video.dataset.warned) return;
    video.dataset.warned='1';
    const node=document.createElement('div'); node.className='video-fallback'; node.textContent=message; video.parentElement.appendChild(node);
  }
  document.querySelectorAll('.chapter').forEach(button => button.addEventListener('click', () => {
    const video = $(button.dataset.video); const seek = Number(button.dataset.seek || 0);
    document.querySelectorAll(`.chapter[data-video="${button.dataset.video}"]`).forEach(b=>b.classList.remove('active'));
    button.classList.add('active');
    if (video.readyState >= 1) { video.currentTime = Math.min(seek, Math.max(0, video.duration - .1)); video.play().catch(()=>{}); }
    else video.addEventListener('loadedmetadata', () => { video.currentTime = Math.min(seek, Math.max(0, video.duration - .1)); video.play().catch(()=>{}); }, {once:true});
  }));

  // Level selection
  function renderLevels(){
    const grid=$('levelGrid'); grid.innerHTML='';
    LEVELS.forEach(item=>{
      const done=completed.has(item.id), locked=item.id>highestUnlocked&&!done;
      const button=document.createElement('button');button.type='button';button.className=`level-card${done?' done':''}${locked?' locked':''}`;button.disabled=locked;
      button.innerHTML=`<div class="level-art"><span class="num-bubble">${item.id}</span><span class="mini-tree"></span><span class="mini-portal"></span><span class="mini-player"></span></div><div class="level-card-body"><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p><div class="level-meta"><span>${done?'★ SELESAI':locked?'🔒 TERKUNCI':'▶ TERSEDIA'}</span><span class="level-state">${done?'✓':locked?'🔒':'MASUK →'}</span></div></div>`;
      button.addEventListener('click',()=>startLevel(item.id));grid.appendChild(button);
    });
    $('progressText').textContent=`${completed.size} / ${LEVELS.length}`;
    $('progressFill').style.width=`${completed.size/LEVELS.length*100}%`;
  }

  function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
  function formatFunction(m,b){let s=m===1?'x':m===-1?'-x':`${m}x`;if(b>0)s+=` + ${b}`;else if(b<0)s+=` - ${Math.abs(b)}`;return s;}
  function buildChallenge(template){
    const item=JSON.parse(JSON.stringify(template));
    if(item.kind==='coordinate'){
      item.start={x:randomInt(-5,-3),y:randomInt(-2,0)};
      item.goal={x:randomInt(3,6),y:randomInt(2,6)};
      item.facts[0].value=`(${item.start.x}, ${item.start.y})`;item.facts[1].value='Cari pada grid';
    }
    if(item.kind==='equation'){
      const m=randomInt(1,2),b=randomInt(-2,1),x1=randomInt(1,2),x2=randomInt(4,5);
      item.start={x:x1,y:m*x1+b};item.goal={x:x2,y:m*x2+b};item.solution={m,b};item.expectedFunction={m,b};
      item.facts[0].value=`(${item.start.x}, ${item.start.y})`;item.facts[1].value=`(${item.goal.x}, ${item.goal.y})`;
      item.successText=`Tepat! Fungsi y = ${formatFunction(m,b)} melalui kedua titik. Grafik menjadi jalur menuju portal.`;
      item.hint=`Hitung m = (${item.goal.y} − ${item.start.y}) / (${item.goal.x} − ${item.start.x}), lalu substitusikan titik A(${item.start.x},${item.start.y}) untuk mencari b.`;
    }
    return item;
  }
  function startLevel(id){
    const chosen=LEVELS.find(x=>x.id===id); if(!chosen || (id>highestUnlocked&&!completed.has(id))) return;
    if(animationFrame) cancelAnimationFrame(animationFrame);
    level=buildChallenge(chosen);currentLevel=id;tries=0;correct=false;moved=false;moving=false;graphProgress=0;playerPos=null;hintIndex=0;
    $('gameHeading').textContent=`Level ${id} — ${level.title}`;
    $('worldLevelLabel').textContent=`LEVEL ${id} · ${level.subtitle.toUpperCase()}`;
    $('worldStatus').textContent='TEMUKAN SOLUSI';
    $('missionTitle').textContent=`Misi ${id}`;
    $('difficultyBadge').textContent=level.difficulty;
    $('missionStory').innerHTML=level.story;
    $('dynamicFacts').innerHTML=level.facts.map(f=>`<div class="fact"><small>${escapeHTML(f.label)}</small><strong>${escapeHTML(f.value)}</strong></div>`).join('');
    $('answerPrefix').textContent=level.answerPrefix;
    $('answerLabel').textContent=level.answerLabel;
    $('answerInput').placeholder=level.answerPlaceholder;
    $('answerInput').value='';$('answerInput').disabled=false;$('checkAnswer').disabled=false;
    $('answerHelp').textContent=level.answerHelp;
    $('miniInstructions').innerHTML=level.instructions.map(x=>`<li>${escapeHTML(x)}</li>`).join('');
    $('successActions').classList.add('hidden');$('moveToPortal').textContent='Ikuti Jalur →';$('moveToPortal').disabled=false;
    clearFeedback();updateGameStats();persist();go('gamePage');
  }
  function updateGameStats(){
    $('hudScore').textContent=score;$('scoreValue').textContent=score;$('triesValue').textContent=tries;$('levelValue').textContent=level?level.id:currentLevel;
    const stars=document.querySelector('.world-stars');if(stars)stars.textContent=correct?'★ ★ ☆':'☆ ☆ ☆';
  }
  function renderWorld(){
    if(!level)return;
    window.GraphWorld.render(canvas, level, {correct,moved,moving,playerPos,graphProgress,motionEnabled});
    $('worldStatus').textContent=moved?'PORTAL TERCAPAI':correct?'GRAFIK TERBENTUK':'TEMUKAN SOLUSI';
    const stars=document.querySelector('.world-stars');if(stars)stars.textContent=moved?'★ ★ ★':correct?'★ ★ ☆':'☆ ☆ ☆';
  }
  function clearFeedback(){const f=$('gameFeedback');f.className='feedback';f.textContent='';}
  function feedback(text,type){const f=$('gameFeedback');f.textContent=text;f.className=`feedback show ${type}`;}
  function parseNumber(raw){const value=String(raw).trim().replace(/,/g,'.');if(!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value))return null;const num=Number(value);return Number.isFinite(num)?num:null;}
  function parseCoordinate(raw){
    const s=String(raw).trim().replace(/[()\[\]]/g,'');const match=s.match(/^\s*(-?\d+)\s*[,;]\s*(-?\d+)\s*$/);
    return match?{x:Number(match[1]),y:Number(match[2])}:null;
  }
  function parseLinear(raw){
    let s=String(raw).toLowerCase().replace(/\s+/g,'').replace(/^y=/,'').replace(/,/g,'.').replace(/\*/g,'');
    if(!s||/[^0-9x+\-.]/.test(s))return null;
    const match=s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)?)?x(?:([+-](?:\d+(?:\.\d*)?|\.\d+)))?$/);
    if(!match)return null;
    let m;if(match[1]===undefined||match[1]===''||match[1]==='+')m=1;else if(match[1]==='-')m=-1;else m=Number(match[1]);
    const b=match[2]===undefined?0:Number(match[2]);
    if(!Number.isFinite(m)||!Number.isFinite(b))return null;
    return {m,b};
  }
  function near(a,b){return Math.abs(a-b)<1e-5;}
  function checkAnswer(){
    if(!level||correct)return;
    tries++;updateGameStats();
    const raw=$('answerInput').value;let passed=false;
    if(level.kind==='coordinate'){
      const v=parseCoordinate(raw);passed=!!v&&v.x===level.goal.x&&v.y===level.goal.y;
      if(!passed && !v) {feedback('Format belum terbaca. Masukkan dua bilangan, misalnya 4,4 atau (4,4).','bad');return;}
    } else if(level.kind==='functionValue'){
      const v=parseNumber(raw);passed=v!==null&&near(v,level.expected);
      if(v===null){feedback('Masukkan jawaban berupa bilangan, misalnya 4 atau -2.','bad');return;}
    } else if(level.kind==='slope'){
      const v=parseNumber(raw);passed=v!==null&&near(v,level.expected);
      if(v===null){feedback('Masukkan nilai gradien berupa bilangan.','bad');return;}
    } else {
      const v=parseLinear(raw);passed=!!v&&near(v.m,level.expectedFunction.m)&&near(v.b,level.expectedFunction.b);
      if(!v){feedback('Persamaan belum dikenali. Gunakan bentuk linear sederhana, misalnya 2x-1, x+3, -x+5, atau 2x.','bad');return;}
    }
    if(passed){
      if (typeof window.GraphMathPlayEffect === 'function') window.GraphMathPlayEffect('answerCorrect');
      correct=true;score+=100;persist();$('answerInput').disabled=true;$('checkAnswer').disabled=true;$('successActions').classList.remove('hidden');
      feedback(level.successText,'ok');updateGameStats();
      if(motionEnabled){graphProgress=0;const started=performance.now();const duration=1050;function reveal(now){graphProgress=Math.min(1,(now-started)/duration);renderWorld();if(graphProgress<1)animationFrame=requestAnimationFrame(reveal);}animationFrame=requestAnimationFrame(reveal);}else{graphProgress=1;renderWorld();}
      if(level.kind==='coordinate') level.facts[1].value=`(${level.goal.x}, ${level.goal.y})`;
      $('dynamicFacts').innerHTML=level.facts.map(f=>`<div class="fact"><small>${escapeHTML(f.label)}</small><strong>${escapeHTML(f.value)}</strong></div>`).join('');
      updateGameStats();
    }else{
      if (typeof window.GraphMathPlayEffect === 'function') window.GraphMathPlayEffect('answerIncorrect');
      let nudge='Belum tepat. Baca kembali misi dan periksa langkah perhitunganmu.';
      if(level.kind==='coordinate')nudge='Belum tepat. Mulai dari titik pusat; periksa nilai x (mendatar) dan y (tegak).';
      else if(level.kind==='slope')nudge='Belum tepat. Periksa selisih nilai y dan selisih nilai x pada rumus gradien.';
      else if(level.kind==='equation'||level.kind==='storyEquation')nudge='Belum tepat. Periksa gradien m dan konstanta b, lalu uji persamaanmu pada titik yang diketahui.';
      else nudge='Belum tepat. Substitusikan nilai x yang diketahui ke dalam fungsi dan hitung kembali.';
      feedback(nudge,'bad');renderWorld();
    }
  }
  function showHint(){if(!level)return;hintIndex++;feedback(level.hint,'info');}
  function moveToPortal(){
    if(!level||!correct||moving)return;
    if(animationFrame)cancelAnimationFrame(animationFrame);
    graphProgress=1;
    moving=true;playerPos={...level.start};$('moveToPortal').disabled=true;
    if(!motionEnabled){playerPos={...level.goal};finishMovement();return;}
    const start=performance.now(),duration=1650;
    function frame(now){const t=Math.min(1,(now-start)/duration);const eased=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;playerPos={x:level.start.x+(level.goal.x-level.start.x)*eased,y:level.start.y+(level.goal.y-level.start.y)*eased};renderWorld();if(t<1)animationFrame=requestAnimationFrame(frame);else finishMovement();}
    animationFrame=requestAnimationFrame(frame);
  }
  function finishMovement(){
    moving=false;moved=true;playerPos={...level.goal};renderWorld();
    completed.add(level.id);highestUnlocked=Math.max(highestUnlocked,Math.min(6,level.id+1));persist();
    $('checkpointTitle').textContent=`Level ${level.id} Selesai!`;
    $('checkpointMessage').textContent=level.kind==='coordinate'?'Kamu berhasil membaca koordinat dan menemukan portal.':`Kamu berhasil menyelesaikan misi “${level.title}” dan mencapai portal.`;
    $('checkpointScore').textContent=score;$('checkpointTries').textContent=tries;$('checkpointCompleted').textContent=`${completed.size} / ${LEVELS.length}`;
    const next=$('checkpointNext');if(level.id===6){next.textContent='Mulai Tes Akhir →';next.disabled=false;}else{next.textContent='Level Berikutnya →';next.disabled=false;}
    go('checkpointPage');
  }
  function saveAndHome(){persist();go('homePage');}
  function nextLevel(){if(!level)return;if(level.id>=6){go('testPage');return;}startLevel(level.id+1);}
  $('checkAnswer').addEventListener('click',checkAnswer);
  $('answerInput').addEventListener('keydown',e=>{if(e.key==='Enter')checkAnswer();});
  $('hintAnswer').addEventListener('click',showHint);
  $('moveToPortal').addEventListener('click',moveToPortal);
  $('checkpointNext').addEventListener('click',nextLevel);
  $('checkpointMap').addEventListener('click',()=>go('levelsPage'));
  $('checkpointHome').addEventListener('click',()=>go('homePage'));
  $('gameHome').addEventListener('click',saveAndHome);
  $('gameHelp').addEventListener('click',()=>go('tutorialPage'));

  // Settings and local save reset
  function openSettings(){$('motionToggle').checked=motionEnabled;$('settingsModal').classList.add('show');}
  $('headerSettings').addEventListener('click',openSettings);$('homeSettings').addEventListener('click',openSettings);
  $('settingsClose').addEventListener('click',()=>$('settingsModal').classList.remove('show'));
  $('settingsDone').addEventListener('click',()=>$('settingsModal').classList.remove('show'));
  $('motionToggle').addEventListener('change',e=>{motionEnabled=e.target.checked;persist();});
  $('resetProgress').addEventListener('click',()=>{
    if(!confirm('Hapus semua progres GraphMath yang tersimpan di browser ini?'))return;
    Object.values(KEY).forEach(key=>storage.removeItem(key));score=0;completed=new Set();highestUnlocked=1;currentLevel=1;level=null;correct=false;moved=false;persist();$('settingsModal').classList.remove('show');renderLevels();updateHeader();alert('Progres GraphMath sudah dihapus.');
  });
  function escapeHTML(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  window.addEventListener('resize',()=>{if($('gamePage').classList.contains('active'))renderWorld();});
  window.addEventListener('beforeunload',()=>{if(level)persist();});
  // API navigasi kecil agar halaman tambahan tetap memakai mekanisme navigasi yang sama.
  window.GraphMathGo = go;
  window.GraphMathStartLevel = startLevel;
  updateHeader();renderLevels();
})();
