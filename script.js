(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Año del footer ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Cabecera con sombra al hacer scroll ---------- */
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const toggle = $(".nav-toggle");
  const menu = $("#menu");
  const label = $(".sr-only", toggle);

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("open", open);
    label.textContent = open ? "Cerrar menú" : "Abrir menú";
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", () => setMenu(false));

  /* ---------- Enlace activo según la sección visible ---------- */
  const links = $$('.menu a[href^="#"]:not(.btn)');
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const active = a.getAttribute("href") === "#" + entry.target.id;
          a.classList.toggle("active", active);
          active ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Red de nodos interactiva (hero) ---------- */
  const canvas = $("#net");
  const ctx = canvas.getContext("2d");
  const COLORS = { node: "#d4ebdc", accent: "#3fae77", line: "212,235,220" };
  let w = 0, h = 0, dpr = 1, nodes = [], raf = null;
  const pointer = { x: null, y: null };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(46, Math.max(22, (w * h) / 9000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: 2 + Math.random() * 2.2, hub: Math.random() < .14,
    }));
    draw();
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const maxD = Math.min(w, h) * .26;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxD) {
          ctx.strokeStyle = `rgba(${COLORS.line},${(1 - d / maxD) * .45})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      if (pointer.x !== null) {
        const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (d < maxD * 1.5) {
          ctx.strokeStyle = `rgba(63,174,119,${(1 - d / (maxD * 1.5)) * .9})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
        }
      }
    }
    nodes.forEach((n) => {
      ctx.fillStyle = n.hub ? COLORS.accent : COLORS.node;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.hub ? n.r + 2 : n.r, 0, Math.PI * 2); ctx.fill();
    });
    if (pointer.x !== null) {
      ctx.strokeStyle = COLORS.accent; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 7, 0, Math.PI * 2); ctx.stroke();
    }
  };

  const step = () => {
    nodes.forEach((n) => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      if (pointer.x !== null) {
        const dx = pointer.x - n.x, dy = pointer.y - n.y, d = Math.hypot(dx, dy);
        if (d < 140 && d > 1) { n.x += (dx / d) * .35; n.y += (dy / d) * .35; }
      }
    });
    draw();
    raf = requestAnimationFrame(step);
  };

  const setPointer = (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    if (reduceMotion) draw();
  };
  canvas.addEventListener("pointermove", setPointer);
  canvas.addEventListener("pointerdown", setPointer);
  canvas.addEventListener("pointerleave", () => { pointer.x = pointer.y = null; if (reduceMotion) draw(); });

  new ResizeObserver(resize).observe(canvas);
  if (!reduceMotion && "IntersectionObserver" in window) {
    // Solo anima cuando el hero es visible: ahorra batería en móviles
    new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) step();
    }).observe(canvas);
  }

  /* ---------- Formulario de contacto ---------- */
  const form = $("#form");
  const status = $("#status");
  const EMAIL_TO = "aaronsamuel2004@gmail.com";
  const rules = {
    nombre: (v) => (v.trim().length >= 2 ? "" : "Escribe tu nombre (mínimo 2 letras)."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Escribe un correo válido, por ejemplo nombre@dominio.com."),
    mensaje: (v) => (v.trim().length >= 10 ? "" : "Cuéntame algo más: el mensaje necesita al menos 10 caracteres."),
  };

  const validate = (input) => {
    const msg = rules[input.name](input.value);
    $("#e-" + input.name).textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  };

  $$("input, textarea", form).forEach((el) => {
    el.addEventListener("blur", () => validate(el));
    el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") validate(el); });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";
    const fields = $$("input, textarea", form);
    const results = fields.map(validate);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus();
      status.textContent = "Revisa los campos marcados e inténtalo de nuevo.";
      return;
    }
    const data = new FormData(form);
    const subject = encodeURIComponent(`Contacto desde tu portafolio: ${data.get("nombre")}`);
    const body = encodeURIComponent(`${data.get("mensaje")}\n\n— ${data.get("nombre")} (${data.get("email")})`);
    window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`;
    status.textContent = "Abriendo tu aplicación de correo con el mensaje preparado.";
    form.reset();
  });
})();
