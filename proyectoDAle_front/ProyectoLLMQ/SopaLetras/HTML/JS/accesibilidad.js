//menu-sidebar
function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
}
function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  initDaltonic();
  initFontSize();
  initSound();
  initSession();

  // Modo daltonico
  function initDaltonic() {
    const root = document.documentElement;
    const css = getComputedStyle(root);
    const checkbox = document.querySelector(".modo input[type='checkbox']");

    const keys = ['primary', 'secondary', 'accent', 'bg-light', 'bg-dark', 'hover', 'hover-text'];

    function apply(enabled) {
      if (enabled) {
        keys.forEach(k => {
          const dal = css.getPropertyValue(`--daltonic-${k}`).trim();
          if (dal) root.style.setProperty(`--usuario-${k}`, dal);
        });
        document.body.classList.add("daltonic-mode");
      } else {
        keys.forEach(k => {
          root.style.removeProperty(`--usuario-${k}`);
        });
        document.body.classList.remove("daltonic-mode");
      }
    }

    const saved = localStorage.getItem("modo_daltonico") === "true";
    apply(saved);
    if (checkbox) checkbox.checked = saved;

    if (checkbox) {
      checkbox.addEventListener("change", () => {
        const on = checkbox.checked;
        localStorage.setItem("modo_daltonico", on);
        apply(on);
      });
    }
  }

  //Tamaño de letra
  function initFontSize() {
    const root = document.documentElement;
    const slider = document.getElementById("nivelLetras");
    const base = 100;
    const step = 5;
    if (!slider) return;

    const saved = parseInt(localStorage.getItem("nivelLetras") || "0", 10);
    slider.value = saved;
    root.style.fontSize = `${base + step * saved}%`;

    slider.addEventListener("input", () => {
      const v = parseInt(slider.value, 10);
      localStorage.setItem("nivelLetras", v);
      root.style.fontSize = `${base + step * v}%`;
    });
  }

  //Volumen de audio
  function initSound() {
    const audio = document.getElementById("audio");
    const slider = document.getElementById("nivelSonidoGeneral");
    if (!audio || !slider) return;

    const saved = parseFloat(localStorage.getItem("volumen") || "0.2");
    audio.volume = saved;
    slider.value = Math.round(saved * 10);

    slider.addEventListener("input", () => {
      const v = slider.value / 10;
      localStorage.setItem("volumen", v);
      audio.volume = v;
    });
  }

  //Logeado + Formulario inicio, Logout, Bienvenida
  function initSession() {
    const idUsuari = localStorage.getItem("id_usuari");
    const formLogin = document.getElementById("form-login");
    const logoutElem = document.getElementById("logout");
    const menuJuego = document.getElementById("menu-juego");
    const nick = localStorage.getItem("nickusuari");
    const bienvenida = document.getElementById("bienvenida");
    const menuUsuario = document.getElementById("menu-usuario");

    if (idUsuari) {
      if (formLogin) formLogin.style.display = "none";
      if (logoutElem) logoutElem.style.display = "block";
      if (menuJuego) menuJuego.style.display = "block";
    } else {
      if (formLogin) formLogin.style.display = "block";
      if (logoutElem) logoutElem.style.display = "none";
      if (menuJuego) menuJuego.style.display = "none";
    }

    if (nick) {
      if (bienvenida) {
        bienvenida.textContent = `Bienvenido, ${nick}!`;
        bienvenida.style.display = "block";
        bienvenida.style.fontWeight = "bold";
        bienvenida.style.marginBottom = "1em";
        bienvenida.style.textAlign = "center";
        bienvenida.style.color = "#10316b";
      }
      if (menuUsuario && menuUsuario.querySelector("a")) {
        menuUsuario.querySelector("a").textContent = nick;
      }
    }

    const btnOut = document.getElementById("logoutBoton");
    if (btnOut) {
      btnOut.addEventListener("click", () => {
        localStorage.removeItem("id_usuari");
        localStorage.removeItem("nickusuari");
        window.location.href = "http://localhost/ProyectoLLMQ/SopaLetras/HTML/Usuario/wordSearch.html";
      });
    }
  }

}); 