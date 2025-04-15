//menu-sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
}

// Modo daltonico
document.addEventListener("DOMContentLoaded", () => {
    const daltonic = localStorage.getItem("modo_daltonico");
    if (daltonic === "true") {
        document.body.classList.add("daltonic-mode");
    }
});

//Logeado + Formulario inicio
document.addEventListener("DOMContentLoaded", () => {
    const idUsuari = localStorage.getItem("id_usuari");
    const formularioLogin = document.getElementById("form-login");
    const logout = document.getElementById("logout");
    const menuJuego = document.getElementById("menu-juego");

    if (idUsuari) {
        
      if (formularioLogin) formularioLogin.style.display = "none";
        logout.style.display = "block";
        menuJuego.style.display = "block";
    } else {
        
      if (formularioLogin) formularioLogin.style.display = "block";
        logout.style.display = "none";
        menuJuego.style.display = "none";
    }
  });
  
  //Logout
  const botoLogout = document.getElementById("logoutBoton");
if (botoLogout) {
  botoLogout.addEventListener("click", () => {
    localStorage.removeItem("id_usuari");
    localStorage.removeItem("nickusuari");
    window.location.href = "http://localhost/ProyectoLLMQ/SopaLetras/HTML/Usuario/wordSearch.html"; 
  });
}

//Bienvenida
document.addEventListener("DOMContentLoaded", () => {
    const nick = localStorage.getItem("nickusuari");

    if (nick) {
        const bienvenida = document.getElementById("bienvenida");
        if (bienvenida) {
            bienvenida.textContent = `Bienvenido, ${nick}!`;
            bienvenida.style.display = "block";
            bienvenida.style.fontWeight = "bold";
            bienvenida.style.marginBottom = "1em";
            bienvenida.style.textAlign = "center";
            bienvenida.style.color = "#10316b";
        }
        const menuUsuario = document.getElementById("menu-usuario");
        if (menuUsuario && menuUsuario.querySelector("a")) {
            menuUsuario.querySelector("a").textContent = nick;
        }
    }
});

  