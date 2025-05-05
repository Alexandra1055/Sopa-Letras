/* Idioma */

/* Tamaño Letras */

/* Color */
// Variables
let colorCorrecto;
let colorIncorrecto;
let colorTabla;


// Funcions

function guardaColors() {
  colorCorrecto = document.querySelector("#colorCorrecto").value;
  colorIncorrecto = document.querySelector("#colorIncorrecto").value;
  colorTabla = document.querySelector("#colorTabla").value;

  localStorage.setItem("colorCorrecto", colorCorrecto);
  localStorage.setItem("colorIncorrecto", colorIncorrecto);
  localStorage.setItem("colorTabla", colorTabla);

  return {
    colorCorrecto,
    colorIncorrecto,
    colorTabla
  };
}

function recuperaColors() {
  if (localStorage.getItem("colorCorrecto") != null) {
    colorCorrecto = localStorage.getItem("colorCorrecto");
  } else {
    colorCorrecto = "#02fc18";
  }

  if (localStorage.getItem("colorIncorrecto") != null) {
    colorIncorrecto = localStorage.getItem("colorIncorrecto");
  } else {
    colorIncorrecto = "#fc2b02";
  }

  if (localStorage.getItem("colorTabla") != null) {
    colorTabla = localStorage.getItem("colorTabla");
  } else {
    colorTabla = "#02fc20";
  }
}

//Insertar en la tabla color
async function insertarUsuarioColors() {
  recuperaColors();
  const id_usuari = localStorage.getItem("id_usuari");

  if (!id_usuari) {
    console.error("Usuario no autenticado");
    return;
  }

  const colores = [
    { id_color: 1, valor: colorCorrecto },
    { id_color: 2, valor: colorIncorrecto },
    { id_color: 3, valor: colorTabla }
  ];

  for (const color of colores) {
    const query = `INSERT INTO Usuari_Color (id_usuari, id_color, valor) 
    VALUES ('${id_usuari}', '${color.id_color}', '${color.valor}')
    ON DUPLICATE KEY UPDATE valor = VALUES(valor);`;
    await create(query);
  }
}

async function confirmarPreferencias() {
  guardaColors();
  recuperaColors();

  const id_usuari = localStorage.getItem("id_usuari");

  if (!id_usuari) {
    alert("Debes iniciar sesión para guardar la configuración.");
    return;
  }

  try {
    const query = `SELECT COUNT(*) AS total FROM Usuari_Color WHERE id_usuari = '${id_usuari}'`;
    const result = await read(query);

    if (result.data && result.data[0].total > 0) {
      await updateColores();
    } else {
      await insertarUsuarioColors();
    }
  } catch (error) {
    console.error("Error al confirmar preferencias:", error);
    alert("Error al confirmar las preferencias del usuario.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const botoConfirmar = document.querySelector("#confirmar");
  if (botoConfirmar) {
    botoConfirmar.addEventListener("click", async e => {
      e.preventDefault();
      await confirmarPreferencias();
    });
  }
 
 //cargar colores guardados
 await cargarColores()

 async function cargarColores() {
  const id_usuari = localStorage.getItem("id_usuari");
  console.log("cargarColores — id_usuari desde localStorage =", id_usuari);

  if (!id_usuari) {
    console.error("Usuario no autenticado");
    return;
  }

  try {
    const query = `SELECT id_color, valor FROM Usuari_Color WHERE id_usuari='${id_usuari}'`;
    console.log("cargarColores — consulta SQL =", query);

    const result = await read(query);
    console.log("cargarColores — resultado read() =", result);

    if (!result.data || result.data.length === 0) {
      console.warn("No hay colores guardados para este usuario.");
      return;
    }

    result.data.forEach(({ id_color, valor }) => {
      console.log("aplicar color", id_color, valor);
      if (id_color === 1) {
        document.querySelector("#colorCorrecto").value = valor;
      } else if (id_color === 2) {
        document.querySelector("#colorIncorrecto").value = valor;
      } else if (id_color === 3) {
        document.querySelector("#colorTabla").value = valor;
      }
    });
  } catch (error) {
    console.error("Error al cargar los colores:", error);
    alert("Error al cargar los colores del usuario.");
  }
}


/* Update colores */
async function updateColores() {
  const id_usuari = localStorage.getItem("id_usuari");
  if (!id_usuari) {
    console.error("Usuario no autenticado");
    return;
  }

  const colores = [
    { id_color: 1, valor: colorCorrecto },
    { id_color: 2, valor: colorIncorrecto },
    { id_color: 3, valor: colorTabla }
  ];

  for (const color of colores) {
    try {
      const query = `
      UPDATE Usuari_Color 
      SET valor = '${color.valor}'
      WHERE id_usuari = '${id_usuari}' AND id_color = '${color.id_color}';
    `;
    await update(query); 
  } catch (error) {
    console.error(`Error al actualizar los colores ${color.id_color}:`, error);
    alert("Error al actualizar los colores del usuario.");
  }
}
}


/* Sonido */

/* Daltonico */
document.addEventListener("DOMContentLoaded", () => {
  const daltonicCheckbox = document.querySelector(".modo input[type='checkbox']");
  const daltonic = localStorage.getItem("modo_daltonico");
  if (daltonic === "true") {
    document.body.classList.add("daltonic-mode");
    daltonicCheckbox.checked = true;
  }
  daltonicCheckbox.addEventListener("change", () => {
    console.log("Modo daltónico cambiado:", daltonicCheckbox.checked);
    const activado = daltonicCheckbox.checked;
    localStorage.setItem("modo_daltonico", activado);
    document.body.classList.toggle("daltonic-mode", activado);
  });
});

});