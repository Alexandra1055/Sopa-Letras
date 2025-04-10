/* CRUD USUARIO */
/* registrar usuario */

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

  const query = `insert into Usuari (nickusuari, nom, llin1, llin2, contrasenya, email, data_naixament) values ('${info.nickusuari}','${info.nom}', '${info.llin1}', '${info.llin2}','${info.contrasenya}', '${info.email}', '${info.data_naixament}')`;

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

  return {
    nickusuari,
    contrasenya,
  };
}

async function iniciarSesion() {
  const info = login();

  const query = `select nickusuari,contrasenya from Usuari where nickusuari = '${info.nickusuari}' and contrasenya = '${info.contrasenya}'`;

  const result = await read(query);

  if (result && result.data && result.data.length > 0) {
    window.location.href = "http://localhost/ProyectoLLMQ/SopaLetras/HTML/Usuario/juego.html";
  } else {
    alert("No existe el usuario o las credenciales son incorrectas");
  }
};

/* Iniciar sesion admin */
const botoLoginAdmin = document.querySelector("#loginBotonAdmin");
if (botoLoginAdmin) {
  botoLoginAdmin.addEventListener("click", (event) => {
    event.preventDefault();
    iniciarSesionAdmin();
  });
}

async function iniciarSesionAdmin() {
  const info = login();
  const query = `select u.nickusuari, u.contrasenya, a.id_admin from Usuari u
    LEFT JOIN Administrador a ON u.id_usuari = a.id_usuari
    WHERE u.nickusuari = '${info.nickusuari}' AND u.contrasenya = '${info.contrasenya}'`;

  const result = await read(query);
  
  if (result && result.data && result.data.length > 0) {
    window.location.href = "http://localhost/ProyectoLLMQ/SopaLetras/HTML/Administrador/consulta_usuarios.html";
  } else {
    alert("No existe el administrador o las credenciales son incorrectas");
  }
};
/* Consultar usuario */

document.addEventListener("DOMContentLoaded", async () => {
  await cargarListaUsuarios();
});

async function cargarListaUsuarios() {
  try {
    const query = "SELECT nickusuari, contrasenya FROM Usuari";
    const result = await read(query);

    
    if (result && result.data && result.data.length > 0) {
      const lista = document.getElementById("llista-usuaris");
      lista.innerHTML = "";

      for (let i = 0; i < result.data.length; i++) {
        const usuario = result.data[i];
        const li = document.createElement("li");
        li.textContent = `Nickname: ${usuario.nickusuari} - Contraseña: ${usuario.contrasenya}`;
        lista.appendChild(li);
      }
    } else {
      console.log("No se han encontrado usuarios registrados.");
    }
  } catch (error) {
    console.error("Error al cargar la lista de usuarios:", error);
    alert("Error al cargar la lista de usuarios registrados.");
  }
}


/* Actualizar Usuario */
document.addEventListener("DOMContentLoaded", async () => {
  const usuariosSelect = document.querySelector("#usuarios");
  if (usuariosSelect) {
    await cargarUsuarios(usuariosSelect);
  }
});

async function cargarUsuarios(usuariosSelect) {
  try {
    const query = "SELECT id_usuari, nickusuari FROM Usuari";
    const result = await read(query);

    if (result && result.data && result.data.length > 0) {
      usuariosSelect.innerHTML = "";
      for (let i = 0; i < result.data.length; i++) {
        const usuario = result.data[i];
        const option = document.createElement("option");
        option.value = usuario.id_usuari;
        option.text = usuario.nickusuari;
        usuariosSelect.appendChild(option);
      }
    } else {
      console.log("No hay usuarios registrados en la base de datos.");
    }
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
    alert("Error al cargar los usuarios registrados.");
  }
}
/* Eliminar Usuario */
const eliminarBoton = document.querySelector("#eliminarBoton");
const usuariosSelect = document.querySelector("#usuarios");

if (eliminarBoton && usuariosSelect) {
  eliminarBoton.addEventListener("click", async () => {
    const selectedOptions = usuariosSelect.selectedOptions;

    if (selectedOptions.length === 0) {
      alert("Por favor, selecciona al menos un usuario para eliminar.");
      return;
    }

    let usuariosAEliminar = "";
    for (let i = 0; i < selectedOptions.length; i++) {
      usuariosAEliminar += selectedOptions[i].text + (i < selectedOptions.length - 1 ? ", " : "");
    }

    const confirmarEliminado = confirm(
      "¿Estás seguro de eliminar los siguientes usuarios: " + usuariosAEliminar + "?"
    );
    if (!confirmarEliminado) return;

    for (let i = 0; i < selectedOptions.length; i++) {
      const idUsuario = selectedOptions[i].value;
      const query = "DELETE FROM Usuari WHERE id_usuari = '" + idUsuario + "'";
      await remove(query);
    }

    for (let i = selectedOptions.length - 1; i >= 0; i--) {
      usuariosSelect.remove(selectedOptions[i].index);
    }

    alert("Usuarios eliminados exitosamente.");
  });
}