const cur=document.getElementById('cur'),ring=document.getElementById('ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function animR(){rx+=(mx-rx)*.14;ry+=(my-ry)*.14;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animR);})();
document.querySelectorAll('a,button,.role-card,.proj-row,.sk,.metric-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.width='14px';cur.style.height='14px';ring.style.width='48px';ring.style.height='48px';});
  el.addEventListener('mouseleave',()=>{cur.style.width='8px';cur.style.height='8px';ring.style.width='32px';ring.style.height='32px';});
});

/* WEBGL PARTICLES */
const cv=document.getElementById('webgl'),gl=cv.getContext('webgl');
let W,H,pts=[];const N=110;
function rsz(){W=cv.width=innerWidth;H=cv.height=innerHeight;if(gl)gl.viewport(0,0,W,H);}
rsz();window.addEventListener('resize',rsz);
if(gl){
  const vs=`attribute vec2 p;attribute float s;attribute vec3 c;attribute float a;varying vec3 vc;varying float va;uniform vec2 r;void main(){vec2 cl=(p/r)*2.-1.;gl_Position=vec4(cl*vec2(1,-1),0,1);gl_PointSize=s;vc=c;va=a;}`;
  const fs=`precision mediump float;varying vec3 vc;varying float va;void main(){float d=distance(gl_PointCoord,vec2(.5));if(d>.5)discard;float a=smoothstep(.5,.3,d);gl_FragColor=vec4(vc,a*va);}`;
  function sh(t,src){const s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  const pg=gl.createProgram();
  gl.attachShader(pg,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(pg);gl.useProgram(pg);
  const lp=gl.getAttribLocation(pg,'p'),ls=gl.getAttribLocation(pg,'s'),lc=gl.getAttribLocation(pg,'c'),la=gl.getAttribLocation(pg,'a'),lr=gl.getUniformLocation(pg,'r');
  const pal=[[196/255,181/255,253/255],[249/255,168/255,212/255],[110/255,231/255,183/255],[147/255,197/255,253/255]];
  for(let i=0;i<N;i++){const c=pal[Math.floor(Math.random()*pal.length)];pts.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.16,sz:1+Math.random()*3,col:c,al:.12+Math.random()*.3,ph:Math.random()*Math.PI*2});}
  function buf(d,l,n){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(d),gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,n,gl.FLOAT,false,0,0);}
  (function draw(){
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
    const pos=[],sz=[],col=[],al=[];
    for(const p of pts){
      p.ph+=.007;p.x+=p.vx+Math.sin(p.ph)*.16;p.y+=p.vy+Math.cos(p.ph*.7)*.12;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      pos.push(p.x,p.y);sz.push(p.sz);col.push(...p.col);al.push(p.al);
    }
    buf(pos,lp,2);buf(sz,ls,1);buf(col,lc,3);buf(al,la,1);
    gl.uniform2f(lr,W,H);gl.drawArrays(gl.POINTS,0,N);
    requestAnimationFrame(draw);
  })();
}

/* COMMAND PALETTE */
const overlay=document.getElementById('cmd-overlay');
const cmdInput=document.getElementById('cmd-input');
const cmdItems=document.querySelectorAll('#cmd-items li');
let cmdOpen=false,cmdActive=0;
function openCmd(){overlay.classList.add('open');cmdInput.focus();cmdOpen=true;setActive(0);}
function closeCmd(){overlay.classList.remove('open');cmdOpen=false;cmdInput.value='';}
function setActive(i){cmdActive=i;cmdItems.forEach((li,j)=>li.classList.toggle('active',j===i));}
document.getElementById('cmd-trigger').addEventListener('click',openCmd);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeCmd();});
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();cmdOpen?closeCmd():openCmd();}
  if(!cmdOpen)return;
  if(e.key==='Escape')closeCmd();
  if(e.key==='ArrowDown'){e.preventDefault();setActive((cmdActive+1)%cmdItems.length);}
  if(e.key==='ArrowUp'){e.preventDefault();setActive((cmdActive-1+cmdItems.length)%cmdItems.length);}
  if(e.key==='Enter'){const li=cmdItems[cmdActive];const href=li.dataset.href;if(href){closeCmd();if(href.startsWith('#')){document.querySelector(href)?.scrollIntoView({behavior:'smooth'});}else{window.open(href,'_blank');}}}
});
cmdItems.forEach((li,i)=>{
  li.addEventListener('click',()=>{const href=li.dataset.href;if(href){closeCmd();if(href.startsWith('#')){document.querySelector(href)?.scrollIntoView({behavior:'smooth'});}else{window.open(href,'_blank');}}});
  li.addEventListener('mouseenter',()=>setActive(i));
});
cmdInput.addEventListener('input',()=>{
  const q=cmdInput.value.toLowerCase();
  cmdItems.forEach(li=>{li.style.display=li.textContent.toLowerCase().includes(q)?'flex':'none';});
});

/* DRAWER */
const drawer=document.getElementById('drawer');
document.getElementById('menu-btn').addEventListener('click',()=>drawer.classList.add('open'));
document.addEventListener('keydown',e=>{if(e.key==='Escape')drawer.classList.remove('open');});
drawer.querySelectorAll('a').forEach(a=>{a.addEventListener('click',()=>drawer.classList.remove('open'));});

/* SCROLL REVEAL + BARS */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('revealed');
      e.target.querySelectorAll('.bar-fill').forEach(f=>f.style.width=f.dataset.w+'%');
    }
  });
},{threshold:.08});
document.querySelectorAll('.reveal').forEach(r=>io.observe(r));

/* COUNTER ANIMATION */
const cio=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.count').forEach(el=>{
        const target=+el.dataset.target;let cur=0;
        const step=()=>{cur+=Math.ceil(target/40);if(cur>=target){el.textContent=target;}else{el.textContent=cur;requestAnimationFrame(step);}};
        requestAnimationFrame(step);
      });
      cio.unobserve(e.target);
    }
  });
},{threshold:.3});
document.querySelectorAll('.metrics-grid').forEach(g=>cio.observe(g));

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});});
});
/* CASE STUDY MODAL */
function openCaseStudy(id) {
  var csOverlay = document.getElementById('cs-overlay');
  if (!csOverlay) return;
  document.querySelectorAll('.cs-content').forEach(function(el) {
    el.classList.remove('active');
  });
  var target = document.getElementById(id);
  if (target) target.classList.add('active');
  csOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCaseStudy(e) {
  var csOverlay = document.getElementById('cs-overlay');
  var closeBtn = document.getElementById('cs-modal-close');
  if (e && e.target !== csOverlay && e.target !== closeBtn) return;
  if (csOverlay) csOverlay.classList.remove('active');
  document.body.style.overflow = '';
}
