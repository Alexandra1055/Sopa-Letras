/* CRUD USUARIO */
/* registrar usuario */
document.addEventListener("DOMContentLoaded", () => {
  const formUsuarios = document.getElementById("formUsuarios");

  const botoRegistre = document.querySelector("form input[type='submit'][value='Registrarse']");
  if (botoRegistre) {
    botoRegistre.addEventListener("click", (event) => {
      event.preventDefault();
      insertarUsuario();
    });
  }

  function agafarInfo() {
    const nickusuari = document.querySelector("#nick").value;
    const contrasenya = document.querySelector("#contrasena").value;
    const nom = document.querySelector("#nombre").value;
    const llin1 = document.querySelector("#lli1").value;
    const llin2 = document.querySelector("#lli2").value;
    const email = document.querySelector("#correo").value;
    const data_naixament = document.querySelector("#fechanacimiento").value;

    return {
      nickusuari,
      nom,
      contrasenya,
      llin1,
      llin2,
      email,
      data_naixament,
    };
  }

  async function insertarUsuario() {
    const info = agafarInfo();
    const query = `INSERT INTO Usuari (nickusuari, nom, llin1, llin2, contrasenya, email, data_naixament)
                 VALUES ('${info.nickusuari}','${info.nom}', '${info.llin1}', '${info.llin2}',
                         '${info.contrasenya}', '${info.email}', '${info.data_naixament}')`;
    await create(query);
  }

  /* Iniciar sesion Usuario*/

  const botoLogin = document.querySelector("#loginBoton");
  if (botoLogin) {
    botoLogin.addEventListener("click", (event) => {
      event.preventDefault();
      iniciarSesion();
    });
  }

  function login() {
    const nickusuari = document.querySelector("#nick").value;
    const contrasenya = document.querySelector("#contrasena").value;

    return { nickusuari, contrasenya };
  }

  async function iniciarSesion() {
    const info = login();
    const query = `SELECT id_usuari, nickusuari, contrasenya
                 FROM Usuari
                 WHERE nickusuari = '${info.nickusuari}'
                   AND contrasenya = '${info.contrasenya}'`;

    const result = await read(query);

    if (result.data.length > 0) {
      const usuario = result.data[0];
      localStorage.setItem("id_usuari", usuario.id_usuari);
      localStorage.setItem("nickusuari", usuario.nickusuari);
      window.location.href = "http://localhost/ProyectoLLMQ/SopaLetras/HTML/Usuario/wordSearch.html";
    } else {
      alert("No existe el usuario o las credenciales son incorrectas");
    }
  }

  /* Iniciar sesion admin */
  const btnAdmin = document.querySelector("#loginBotonAdmin");
  if (btnAdmin) {
    btnAdmin.addEventListener("click", async () => {
      event.preventDefault();
      iniciarSesionAdmin();
    });
  }

  function loginAdmin() {
    const nickusuari = document.querySelector("#nick").value.trim();
    const contrasenya = document.querySelector("#contrasena").value.trim();

    return { nickusuari, contrasenya };
  }

  async function iniciarSesionAdmin() {
    const info = loginAdmin();
    const query = `
        SELECT a.id_admin, u.id_usuari, u.nickusuari
        FROM Usuari u
        JOIN Administrador a ON u.id_usuari = a.id_usuari
        WHERE u.nickusuari = '${info.nickusuari}'
          AND u.contrasenya = '${info.contrasenya}'
      `;

    try {
      const res = await read(query);
      console.log("Respuesta del servidor:", res)
      if (res?.data?.length > 0) {
        const adm = res.data[0];
        localStorage.setItem("id_usuari", adm.id_usuari);
        localStorage.setItem("nickusuari", adm.nickusuari);
        localStorage.setItem("id_admin", adm.id_admin);
        if (res.data.length > 0) {
          console.log("Login ADMIN ok, redirigiendo a consulta_sopas.html");
          window.location.href = "http://localhost/ProyectoLLMQ/SopaLetras/HTML/Administrador/consulta_sopas.html";
        }
      } else {
        alert("No existe el administrador o las credenciales son incorrectas");
      }
    } catch (err) {
      console.error("Error al consultar admin:", err);
      alert("Error al conectar con el servidor");
    }
  }

  /* Mostrar admin logueado en todas las páginas sin tocar HTML */
  const nickGuardado = localStorage.getItem("nickusuari");
  const esAdmin      = localStorage.getItem("id_admin");
  if (nickGuardado && esAdmin) {
    const logoutDiv = document.querySelector("#logout");
    if (logoutDiv) {
      const span = document.createElement("span");
      span.textContent = `👑 ${nickGuardado}`;
      span.style.marginRight = "1em";
      span.style.fontWeight  = "bold";
      logoutDiv.insertBefore(span, logoutDiv.firstChild);
    }
  }
  /* Consultar usuario */
  const contenedorLista = document.getElementById("Cont_LlistaU");
  if (contenedorLista) {
    cargarListaUsuarios();
  }

  async function cargarListaUsuarios() {
    try {
      const query = "SELECT nickusuari, contrasenya FROM Usuari";
      const res = await read(query);
      const lista = document.getElementById("llista-usuaris");
      lista.innerHTML = "";

      if (res.data?.length) {
        res.data.forEach(u => {
          const li = document.createElement("li");
          li.textContent = `Nickname: ${u.nickusuari} — Contraseña: ${u.contrasenya}`;
          lista.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.textContent = "No hay usuarios registrados.";
        lista.appendChild(li);
      }
    } catch (err) {
      console.error("Error al cargar lista de usuarios:", err);
      alert("No se pudo cargar la lista de usuarios.");
    }
  }

    /* Actualizar Usuario */
    const usuariosSelect = document.getElementById("usuarios");
  if (usuariosSelect) {
    cargarUsuarios(usuariosSelect);
  }

  async function cargarUsuarios(selectElem) {
    try {
      const query = "SELECT id_usuari, nickusuari FROM Usuari";
      const res = await read(query);
      selectElem.innerHTML = "";

      if (res.data?.length) {
        res.data.forEach(u => {
          const opt = document.createElement("option");
          opt.value = u.id_usuari;
          opt.text  = u.nickusuari;
          selectElem.appendChild(opt);
        });
      }
    } catch (err) {
      console.error("Error al cargar usuarios en select:", err);
      alert("No se pudieron cargar los usuarios.");
    }
  }

    /* Eliminar Usuario */
    const btnEliminar = document.getElementById("eliminarBoton");
  if (btnEliminar && usuariosSelect) {
    btnEliminar.addEventListener("click", async () => {
      const sels = Array.from(usuariosSelect.selectedOptions);
      if (!sels.length) {
        alert("Selecciona al menos un usuario.");
        return;
      }

      const nombres = sels.map(o => o.text).join(", ");
      if (!confirm(`¿Eliminar usuarios: ${nombres}?`)) return;

      try {
        for (let opt of sels) {
          await remove(`DELETE FROM Usuari WHERE id_usuari='${opt.value}'`);
          usuariosSelect.removeChild(opt);
        }
        alert("Usuarios eliminados.");
      } catch (err) {
        console.error("Error al eliminar usuarios:", err);
        alert("No se pudieron eliminar todos los usuarios.");
      }
    });
  }
});