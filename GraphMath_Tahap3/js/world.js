/* Rendering dunia 2D GraphMath. Semua aset latar digambar dengan Canvas agar offline dan ringan. */
window.GraphWorld = (() => {
  const XMIN=-6, XMAX=10, YMIN=-4, YMAX=12;
  function geometry(canvas){
    const ctx=canvas.getContext('2d'), W=canvas.width,H=canvas.height;
    const size=Math.min(510,H-135,W-300); const left=(W-size)/2, top=(H-size)/2+6, unit=size/16;
    const sx=x=>left+(x-XMIN)*unit;
    const sy=y=>top+(YMAX-y)*unit;
    return {ctx,W,H,size,left,top,unit,sx,sy,XMIN,XMAX,YMIN,YMAX};
  }
  function cloud(ctx,x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#f8ffffb5';ctx.beginPath();ctx.ellipse(0,8,46,15,0,0,Math.PI*2);ctx.ellipse(-20,2,23,21,0,0,Math.PI*2);ctx.ellipse(4,-7,28,29,0,0,Math.PI*2);ctx.ellipse(30,4,24,18,0,0,Math.PI*2);ctx.fill();ctx.restore();}
  function tree(ctx,x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#815334';ctx.fillRect(-5,-35,10,37);ctx.fillStyle='#176b4a';ctx.beginPath();ctx.arc(-6,-41,20,0,Math.PI*2);ctx.arc(10,-47,22,0,Math.PI*2);ctx.arc(1,-60,18,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2b9a60';ctx.beginPath();ctx.arc(-9,-45,12,0,Math.PI*2);ctx.arc(8,-53,13,0,Math.PI*2);ctx.fill();ctx.restore();}
  function island(ctx,x,y,w=140,h=65){ctx.save();ctx.translate(x,y);ctx.fillStyle='#6ac66e';ctx.beginPath();ctx.ellipse(0,0,w/2,13,0,Math.PI,Math.PI*2);ctx.lineTo(w/2,5);ctx.lineTo(w*.3,h*.62);ctx.lineTo(w*.12,h*.85);ctx.lineTo(0,h);ctx.lineTo(-w*.18,h*.75);ctx.lineTo(-w*.36,h*.48);ctx.lineTo(-w/2,5);ctx.closePath();ctx.fill();ctx.fillStyle='#805a3a';ctx.beginPath();ctx.moveTo(-w/2,0);ctx.quadraticCurveTo(0,21,w/2,0);ctx.lineTo(w*.32,h*.55);ctx.lineTo(w*.1,h*.84);ctx.lineTo(0,h);ctx.lineTo(-w*.17,h*.7);ctx.lineTo(-w*.35,h*.48);ctx.closePath();ctx.fill();ctx.fillStyle='#4fae5b';ctx.beginPath();ctx.ellipse(0,-1,w/2,12,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#8fe27d';ctx.beginPath();ctx.ellipse(-w*.18,-4,w*.15,4,-.15,0,Math.PI*2);ctx.fill();ctx.restore();}
  function background(g){
    const {ctx,W,H}=g;const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#55b9ec');sky.addColorStop(.54,'#b7eafa');sky.addColorStop(1,'#e3f7ed');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    const sun=ctx.createRadialGradient(W*.84,H*.12,4,W*.84,H*.12,105);sun.addColorStop(0,'#fff5c2b5');sun.addColorStop(1,'#fff6d000');ctx.fillStyle=sun;ctx.fillRect(W*.68,0,W*.32,H*.35);
    cloud(ctx,110,80,.82);cloud(ctx,870,100,.68);cloud(ctx,830,290,.45);cloud(ctx,120,360,.42);
    ctx.fillStyle='#8cccb9';ctx.beginPath();ctx.moveTo(0,H*.55);ctx.lineTo(95,H*.34);ctx.lineTo(178,H*.51);ctx.lineTo(265,H*.29);ctx.lineTo(345,H*.54);ctx.lineTo(440,H*.40);ctx.lineTo(525,H*.56);ctx.lineTo(650,H*.33);ctx.lineTo(760,H*.55);ctx.lineTo(865,H*.35);ctx.lineTo(W,H*.5);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
    ctx.fillStyle='#5ca789';ctx.beginPath();ctx.moveTo(0,H*.72);ctx.lineTo(95,H*.49);ctx.lineTo(190,H*.7);ctx.lineTo(285,H*.52);ctx.lineTo(380,H*.73);ctx.lineTo(520,H*.57);ctx.lineTo(650,H*.7);ctx.lineTo(780,H*.5);ctx.lineTo(895,H*.7);ctx.lineTo(W,H*.53);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
    island(ctx,86,270,145,80);tree(ctx,85,260,.7);island(ctx,912,335,145,74);tree(ctx,920,324,.72);island(ctx,884,82,86,45);tree(ctx,886,75,.4);
    // low shrubs at far edges, framing the coordinate map without hiding it
    ctx.fillStyle='#2d845b';ctx.beginPath();ctx.ellipse(0,H+10,160,105,0,0,Math.PI*2);ctx.ellipse(W,H+12,180,112,0,0,Math.PI*2);ctx.fill();
    for(let i=0;i<9;i++){const x=i<5?22+i*33:W-22-(i-5)*35;const y=H-(i%3)*13;tree(ctx,x,y,.38+(i%2)*.13);}
  }
  function drawGrid(g){
    const {ctx,left,top,size,unit,sx,sy}=g;
    ctx.save();ctx.fillStyle='#ffffffd9';ctx.fillRect(left,top,size,size);ctx.strokeStyle='#d5e0e4';ctx.lineWidth=1;
    for(let x=-6;x<=10;x++){ctx.beginPath();ctx.moveTo(sx(x),top);ctx.lineTo(sx(x),top+size);ctx.strokeStyle=x===0?'#344a50':x%2===0?'#bdcbd0':'#e0e7e9';ctx.lineWidth=x===0?2.5:x%2===0?1.35:.8;ctx.stroke();}
    for(let y=-4;y<=12;y++){ctx.beginPath();ctx.moveTo(left,sy(y));ctx.lineTo(left+size,sy(y));ctx.strokeStyle=y===0?'#344a50':y%2===0?'#bdcbd0':'#e0e7e9';ctx.lineWidth=y===0?2.5:y%2===0?1.35:.8;ctx.stroke();}
    ctx.fillStyle='#314a51';ctx.font='bold 13px system-ui';ctx.fillText('Y',left-16,top+1);ctx.fillText('X',left+size-2,sy(0)-9);
    ctx.font='11px system-ui';ctx.textAlign='center';for(let x=-6;x<=10;x+=2){if(x!==0)ctx.fillText(String(x),sx(x),sy(0)+15);}
    ctx.textAlign='right';for(let y=-4;y<=12;y+=2){if(y!==0)ctx.fillText(String(y),sx(0)-6,sy(y)+4);}
    ctx.textAlign='left';ctx.restore();
  }
  function platform(ctx,cx,topY,w=90){
    ctx.save();ctx.translate(cx,topY);ctx.fillStyle='#755136';ctx.beginPath();ctx.moveTo(-w/2,0);ctx.quadraticCurveTo(0,13,w/2,0);ctx.lineTo(w*.36,24);ctx.lineTo(w*.15,36);ctx.lineTo(-w*.1,31);ctx.lineTo(-w*.36,22);ctx.closePath();ctx.fill();ctx.fillStyle='#4a8e4e';ctx.beginPath();ctx.ellipse(0,0,w/2,11,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#8bdd72';ctx.beginPath();ctx.ellipse(-w*.14,-3,w*.18,5,-.12,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#3c7542';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-w*.34,9);ctx.lineTo(-w*.24,17);ctx.moveTo(w*.2,10);ctx.lineTo(w*.24,22);ctx.stroke();ctx.restore();
  }
  function player(ctx,x,feetY,scale=1,walk=false){
    ctx.save();ctx.translate(x,feetY);ctx.scale(scale,scale);
    ctx.fillStyle='#16432c35';ctx.beginPath();ctx.ellipse(0,3,17,5,0,0,Math.PI*2);ctx.fill();
    // backpack
    ctx.fillStyle='#d88a2c';ctx.strokeStyle='#7e4c23';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-15,-29,13,20,4);ctx.fill();ctx.stroke();
    // legs
    ctx.strokeStyle='#344f60';ctx.lineWidth=6;ctx.lineCap='round';const step=walk?Math.sin(Date.now()/90)*4:0;ctx.beginPath();ctx.moveTo(-4,-11);ctx.lineTo(-7+step,-1);ctx.moveTo(5,-11);ctx.lineTo(8-step,-1);ctx.stroke();
    // torso
    ctx.fillStyle='#287cb8';ctx.strokeStyle='#174a70';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-9,-31,19,22,5);ctx.fill();ctx.stroke();
    // arms
    ctx.strokeStyle='#eab17e';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-8,-27);ctx.lineTo(-12,-17);ctx.moveTo(9,-27);ctx.lineTo(12,-18);ctx.stroke();
    // head
    ctx.fillStyle='#f3c291';ctx.strokeStyle='#4a3027';ctx.lineWidth=1.7;ctx.beginPath();ctx.ellipse(1,-40,10,12,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#392821';ctx.beginPath();ctx.arc(0,-45,10,Math.PI,Math.PI*2);ctx.lineTo(9,-39);ctx.quadraticCurveTo(2,-42,-5,-38);ctx.closePath();ctx.fill();
    ctx.fillStyle='#2d2927';ctx.beginPath();ctx.arc(4,-40,1.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f0d05c';ctx.fillRect(-8,-28,16,3);
    ctx.restore();
  }
  function portal(ctx,x,feetY,active=false){
    ctx.save();ctx.translate(x,feetY-34);ctx.shadowColor='#1ad8ff';ctx.shadowBlur=active?28:16;
    ctx.fillStyle='#1e9ec7';ctx.beginPath();ctx.ellipse(0,0,22,33,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle='#9ef4ff';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,16,27,0,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#41dfff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(-2,0,10,20,Math.sin(Date.now()/600)*.15,0,Math.PI*2);ctx.stroke();
    const grad=ctx.createRadialGradient(0,-2,1,0,0,20);grad.addColorStop(0,'#f2ffff');grad.addColorStop(.32,'#60edff');grad.addColorStop(1,'#0f6fb1');ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(0,0,11,22,0,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  function label(ctx,text,x,y,color='#17452f',align='center'){
    ctx.save();ctx.font='bold 12px system-ui';const width=ctx.measureText(text).width+18;const px=align==='left'?x:x-width/2;ctx.fillStyle='#fffffff0';ctx.strokeStyle='#bedac9';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(px,y-16,width,24,7);ctx.fill();ctx.stroke();ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(text,align==='left'?x+9:x,y-4);ctx.restore();
  }
  function drawFunction(g,level,state){
    const {ctx,sx,sy}=g;const progress=state.graphProgress===undefined?1:state.graphProgress;
    if(!state.correct || level.kind==='coordinate'){
      if(state.correct && level.kind==='coordinate'){
        ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle='#f5a623';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(sx(level.start.x),sy(level.start.y));ctx.lineTo(sx(level.goal.x),sy(level.goal.y));ctx.stroke();ctx.setLineDash([]);ctx.restore();
      }
      return;
    }
    const start=level.start.x, end=level.goal.x;const current=start+(end-start)*progress;
    ctx.save();ctx.beginPath();ctx.rect(g.left,g.top,g.size,g.size);ctx.clip();ctx.beginPath();
    const direction=end>=start?1:-1;const inc=.035*direction;let first=true;
    for(let x=start;direction>0?x<=current:x>=current;x+=inc){const y=level.solution.m*x+level.solution.b;if(first){ctx.moveTo(sx(x),sy(y));first=false;}else ctx.lineTo(sx(x),sy(y));}
    if(first)ctx.moveTo(sx(start),sy(level.solution.m*start+level.solution.b));
    ctx.strokeStyle='#064c9b40';ctx.lineWidth=10;ctx.lineCap='round';ctx.stroke();ctx.strokeStyle='#1763b7';ctx.lineWidth=4;ctx.stroke();
    // glowing dots on path
    const count=Math.max(1,Math.floor(Math.abs(current-start)*2));ctx.fillStyle='#66e4ff';for(let i=0;i<=count;i++){const x=start+(current-start)*i/count;const y=level.solution.m*x+level.solution.b;ctx.beginPath();ctx.arc(sx(x),sy(y),3.4,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }
  function render(canvas,level,state={}){
    if(!canvas||!level)return;const g=geometry(canvas);background(g);drawGrid(g);
    // line path lies under endpoint islands and sprites
    drawFunction(g,level,state);
    const p=state.playerPos|| (state.moved?level.goal:level.start);
    // Islands sit at coordinate anchors as scene platforms; the coordinate axes remain visible around them.
    platform(g.ctx,g.sx(level.start.x),g.sy(level.start.y)+3,Math.min(102,g.unit*2.75));
    platform(g.ctx,g.sx(level.goal.x),g.sy(level.goal.y)+3,Math.min(102,g.unit*2.75));
    portal(g.ctx,g.sx(level.goal.x),g.sy(level.goal.y)+1,state.correct);
    player(g.ctx,g.sx(p.x),g.sy(p.y)+2,1,state.moving);
    const reveal=state.correct||level.kind==='slope'||level.kind==='equation'||level.kind==='storyEquation';
    if(reveal){label(g.ctx,`A ${`(${level.start.x}, ${level.start.y})`}`,g.sx(level.start.x),g.sy(level.start.y)-56,'#165a3a');label(g.ctx,`B (${level.goal.x}, ${level.goal.y})`,g.sx(level.goal.x),g.sy(level.goal.y)-78,'#6234a2');}
    else if(level.kind==='coordinate')label(g.ctx,'TEMUKAN KOORDINAT',g.sx(level.goal.x),g.sy(level.goal.y)-78,'#6234a2');
    else label(g.ctx,'POSISI TUJUAN',g.sx(level.goal.x),g.sy(level.goal.y)-78,'#6234a2');
    // small decorative foreground leaves at map edges
    g.ctx.save();g.ctx.globalAlpha=.45;for(let i=0;i<10;i++){g.ctx.fillStyle=i%2?'#166b49':'#2a9c5c';const x=i<5?10+i*18:g.W-10-(i-5)*18;const y=g.H-8-(i%3)*8;g.ctx.beginPath();g.ctx.ellipse(x,y,12,5,-.6,0,Math.PI*2);g.ctx.fill();}g.ctx.restore();
  }
  return {render,geometry};
})();
