/* ===== Configuración editable ===== */
const FORM_ENDPOINT = "";          // Pega aquí tu URL de Formspree (https://formspree.io/f/xxxx). Vacío = usa mailto.
const EMAIL = "aaronsamuel2004@gmail.com";

const ico = p => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const ICON = {
  code:ico('<path d="m8 8-4 4 4 4M16 8l4 4-4 4"/>'), globe:ico('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  server:ico('<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/>'),
  net:ico('<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-6 5M12 12l6 5"/>'),
  git:ico('<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 8v8M18 11c0 4-6 2-12 5"/>'),
  star:ico('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>')
};

/* ===== Datos: habilidades y proyectos (edita aquí) ===== */
const TECH = [["HTML5","code"],["CSS3","code"],["JavaScript","code"],["Desarrollo web","globe"],["Sistemas operativos","server"],["Redes informáticas","net"],["Administración de sistemas","server"],["Git y GitHub","git"]];
const SOFT = ["Trabajo en equipo","Resolución de problemas","Adaptabilidad","Aprendizaje continuo","Organización","Creatividad"];
const PROJECTS = [  // url / github: pon el enlace o deja "" si aún no existe
  {name:"Proyecto 1",desc:"Espacio reservado. Aquí irá la descripción de tu primer proyecto.",stack:["HTML5","CSS3","JavaScript"],url:"",github:"",pending:true},
  {name:"Proyecto 2",desc:"Espacio reservado. Describe qué problema resuelve y qué aprendiste.",stack:["Por definir"],url:"",github:"",pending:true},
  {name:"Proyecto 3",desc:"Espacio reservado para un proyecto de redes o administración de sistemas.",stack:["Por definir"],url:"",github:"",pending:true}
];

/* ===== Utilidades ===== */
const $ = (s,c=document) => c.querySelector(s), $$ = (s,c=document) => [...c.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const touch = matchMedia("(hover: none)").matches;
const esc = t => String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ===== Render de contenido ===== */
$("#tech").innerHTML = TECH.map(([n,i])=>`<li class="reveal">${ICON[i]}${esc(n)}</li>`).join("");
$("#soft").innerHTML = SOFT.map(n=>`<li class="reveal">${ICON.star}${esc(n)}</li>`).join("");
$("#projects").innerHTML = PROJECTS.map(p=>{
  const link=(u,l)=>u?`<a href="${esc(u)}" target="_blank" rel="noopener">${l}</a>`:`<span title="Pendiente">${l}</span>`;
  return `<article class="card tilt proj reveal"><div class="cover"><div></div></div><div class="proj-b">
  ${p.pending?'<span class="badge">Pendiente de completar</span>':""}<h3 style="margin-top:.6rem">${esc(p.name)}</h3><p>${esc(p.desc)}</p>
  <div class="stack">${p.stack.map(s=>`<span>${esc(s)}</span>`).join("")}</div>
  <div class="links">${link(p.url,"Ver proyecto")}${link(p.github,"GitHub")}</div></div></article>`;
}).join("");
$("#year").textContent = new Date().getFullYear();

/* ===== Navegación ===== */
const nav=$("#nav"), burger=$("#burger"), menu=$("#menu");
const setMenu=o=>{menu.classList.toggle("open",o);burger.setAttribute("aria-expanded",o);burger.setAttribute("aria-label",o?"Cerrar menú":"Abrir menú")};
burger.onclick=()=>setMenu(!menu.classList.contains("open"));
$$("#menu a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});
$("#totop").onclick=()=>scrollTo({top:0,behavior:reduced?"auto":"smooth"});

/* Sección activa */
const links=$$("#menu a");
const spy=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));
}),{rootMargin:"-45% 0px -50% 0px"});
$$("main section[id]").forEach(s=>spy.observe(s));

/* Revelado al entrar */
const rev=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");rev.unobserve(e.target)}}),{threshold:.15});
$$(".reveal").forEach(el=>rev.observe(el));

/* Scroll: progreso, nav, botón subir, parallax (un único rAF) */
const bar=$("#progress"), totop=$("#totop"), px=$$(".parallax");
let ticking=false;
function onScroll(){
  const y=scrollY, max=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform=`scaleX(${max>0?y/max:0})`;
  nav.classList.toggle("solid",y>40);
  totop.classList.toggle("show",y>600);
  if(!reduced&&y<innerHeight*1.2)px.forEach(el=>el.style.translate=`0 ${y*(+el.dataset.speed)}px`);
  ticking=false;
}
addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();

/* ===== Cursor, luz y efectos de puntero (solo ratón) ===== */
const mouse={x:innerWidth/2,y:innerHeight/2,active:false};
const glow=$("#glow"), cur=$("#cursor");
if(!touch){
  addEventListener("pointermove",e=>{
    mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true;
    glow.style.transform=`translate(${mouse.x}px,${mouse.y}px)`;
    cur.style.transform=`translate(${mouse.x}px,${mouse.y}px)`;cur.classList.add("on");
  },{passive:true});
  document.addEventListener("pointerleave",()=>{mouse.active=false;cur.classList.remove("on")});
  $$("a,button,input,textarea").forEach(el=>{
    el.addEventListener("pointerenter",()=>cur.classList.add("big"));
    el.addEventListener("pointerleave",()=>cur.classList.remove("big"));
  });
  if(!reduced){
    // Botones magnéticos
    $$(".magnetic").forEach(b=>{
      b.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect();
        b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`});
      b.addEventListener("pointerleave",()=>b.style.transform="");
    });
    // Tilt 3D + luz interna en tarjetas
    $$(".tilt").forEach(c=>{
      c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        c.style.setProperty("--mx",x*100+"%");c.style.setProperty("--my",y*100+"%");
        c.style.transform=`perspective(800px) rotateX(${(.5-y)*7}deg) rotateY(${(x-.5)*7}deg) translateY(-6px)`});
      c.addEventListener("pointerleave",()=>c.style.transform="");
    });
  }
}

/* ===== Partículas (Canvas) ===== */
(function(){
  const cv=$("#bg"), ctx=cv.getContext("2d");
  let W,H,dpr,P=[],run=true,t0=0;
  const small=innerWidth<768;
  function size(){
    dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
    cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const n=Math.min(small?32:90,Math.floor(W*H/(small?18000:14000)));
    P=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,z:.3+Math.random()*.7,a:Math.random()*6.28,vx:0,vy:0}));
  }
  const LINK=small?110:140;
  function frame(t){
    if(!run)return;
    ctx.clearRect(0,0,W,H);
    const auto=touch||!mouse.active; // en móvil: atractor automático suave
    const mx=auto?W/2+Math.cos(t/4000)*W*.3:mouse.x, my=auto?H/2+Math.sin(t/5000)*H*.3:mouse.y;
    for(const p of P){
      p.a+=.004*p.z;
      p.vx+=Math.cos(p.a)*.01*p.z;p.vy+=Math.sin(p.a)*.01*p.z;
      const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);
      if(d<160&&(!touch)){const f=(1-d/160)*.6*p.z;p.vx+=dx/d*f;p.vy+=dy/d*f} // repulsión
      p.vx*=.95;p.vy*=.95;p.x+=p.vx+.15*p.z*Math.cos(p.a);p.y+=p.vy+.15*p.z*Math.sin(p.a);
      if(p.x<-20)p.x=W+20;if(p.x>W+20)p.x=-20;if(p.y<-20)p.y=H+20;if(p.y>H+20)p.y=-20;
    }
    for(let i=0;i<P.length;i++){
      const a=P[i];
      for(let j=i+1;j<P.length;j++){
        const b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<LINK){ctx.strokeStyle=`rgba(53,208,127,${(1-d/LINK)*.22*Math.min(a.z,b.z)})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
      }
      ctx.fillStyle=`rgba(53,208,127,${.25+a.z*.55})`;ctx.beginPath();ctx.arc(a.x,a.y,a.z*2,0,6.28);ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  size();
  let rt;addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(size,200)});
  if(reduced){frame(0);run=false;return} // fondo estático
  document.addEventListener("visibilitychange",()=>{run=!document.hidden;if(run)requestAnimationFrame(frame)});
  requestAnimationFrame(frame);
})();

/* ===== Formulario ===== */
const form=$("#form"), status=$("#status");
const rules={
  name:v=>v.trim().length>=2||"Escribe tu nombre (mínimo 2 caracteres).",
  email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||"Introduce un email válido, como nombre@dominio.com.",
  subject:v=>v.trim().length>=3||"Escribe un asunto (mínimo 3 caracteres).",
  message:v=>v.trim().length>=10||"El mensaje debe tener al menos 10 caracteres."
};
function check(k){
  const el=form.elements[k],r=rules[k](el.value),ok=r===true;
  el.parentElement.classList.toggle("bad",!ok);
  el.setAttribute("aria-invalid",!ok);$("#e-"+k).textContent=ok?"":r;return ok;
}
Object.keys(rules).forEach(k=>form.elements[k].addEventListener("blur",()=>check(k)));
form.addEventListener("submit",async e=>{
  e.preventDefault();status.className="status";status.textContent="";
  const valid=Object.keys(rules).map(check).every(Boolean);
  if(!valid){status.classList.add("ko");status.textContent="Revisa los campos marcados.";form.querySelector("[aria-invalid=true]")?.focus();return}
  const d=Object.fromEntries(new FormData(form));
  if(!FORM_ENDPOINT){ // Alternativa sin backend: abre el cliente de correo
    location.href=`mailto:${EMAIL}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(`${d.message}\n\n— ${d.name} (${d.email})`)}`;
    status.classList.add("ok");status.textContent="Se ha abierto tu aplicación de correo para enviar el mensaje.";return;
  }
  try{
    const r=await fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(d)});
    if(!r.ok)throw 0;
    form.reset();status.classList.add("ok");status.textContent="Mensaje enviado. Te responderé pronto.";
  }catch{status.classList.add("ko");status.textContent=`No se pudo enviar. Inténtalo de nuevo o escribe a ${EMAIL}.`}
});
