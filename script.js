(function () {
  "use strict";

  var EMAIL = "aaronsamuel2004@gmail.com";

  // Año del pie de página
  document.getElementById("year").textContent = new Date().getFullYear();

  // Menú móvil
  var btn = document.querySelector(".menu-btn");
  var menu = document.getElementById("menu");
  function closeMenu() {
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }
  btn.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // Marcar en el menú la sección que se está viendo
  var links = {};
  menu.querySelectorAll("a").forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].classList.remove("active"); });
        var link = links[entry.target.id];
        if (link) link.classList.add("active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { observer.observe(s); });
  }

  // Copiar correo
  var copyBtn = document.getElementById("copy");
  var copyMsg = document.getElementById("copy-msg");
  copyBtn.addEventListener("click", function () {
    function done(text) {
      copyMsg.textContent = text;
      setTimeout(function () { copyMsg.textContent = ""; }, 2500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(
        function () { done("Correo copiado."); },
        function () { done("No se pudo copiar. Selecciónalo a mano."); }
      );
    } else {
      done("No se pudo copiar. Selecciónalo a mano.");
    }
  });

  // Formulario: abre el cliente de correo (GitHub Pages no tiene servidor)
  var form = document.getElementById("form");
  var formMsg = document.getElementById("form-msg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = form.nombre.value.trim();
    var mensaje = form.mensaje.value.trim();
    if (!nombre || !mensaje) {
      formMsg.textContent = "Escribe tu nombre y un mensaje antes de continuar.";
      return;
    }
    formMsg.textContent = "";
    var asunto = "Mensaje desde tu portafolio: " + nombre;
    var cuerpo = mensaje + "\n\n" + nombre;
    window.location.href = "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(asunto) +
      "&body=" + encodeURIComponent(cuerpo);
  });
})();
