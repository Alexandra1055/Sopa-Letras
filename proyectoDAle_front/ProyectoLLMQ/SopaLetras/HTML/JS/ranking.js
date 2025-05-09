document.addEventListener("DOMContentLoaded", async () => {
  await cargarUsuarioSegunPosicion();
});

//Busca el nombre de una de las páginas html para asignarles al usuario en su respectiva posición
async function cargarUsuarioSegunPosicion() {
  const ruta = window.location.pathname.toLowerCase();

  let posicion;
  if (ruta.includes("primer")) {
    posicion = 0;
  } else if (ruta.includes("segundo")) {
    posicion = 1;
  } else if (ruta.includes("tercer")) {
    posicion = 2;
  } else {
    console.error("No se encontró el nombre del archivo.");
    return;
  }

  const query = `
    SELECT Usuari.nickusuari, SUM(Sopa_Lletres_Usuari.punts) AS mejoresUsuarios
    FROM Sopa_Lletres_Usuari
    JOIN Usuari ON Usuari.id_usuari = Sopa_Lletres_Usuari.id_usuari
    JOIN Sopa_Lletres ON Sopa_Lletres.id_sopa = Sopa_Lletres_Usuari.id_sopa
    GROUP BY Usuari.id_usuari
    ORDER BY mejoresUsuarios DESC
    LIMIT 3
  `;

  try {
    const resultado = await read(query);

    const usuario = resultado.data[posicion];
    insertarUsuarioEnPagina(usuario.nickusuari, usuario.mejoresUsuarios);
  } catch (error) {
    console.error("Error al obtener el ranking:", error);
  }
}

function insertarUsuarioEnPagina(nombre, puntuacion) {
  const tbody = document.querySelector(".tabla-puntos tbody");
  
  if (!tbody) {
    console.error("No se encontró la tabla");
    return;
  }

  const fila = document.createElement("tr");

  const celdaNombre = document.createElement("td");
  celdaNombre.textContent = nombre;

  const celdaPuntuacion = document.createElement("td");
  celdaPuntuacion.textContent = puntuacion;

  fila.appendChild(celdaNombre);
  fila.appendChild(celdaPuntuacion);
  tbody.appendChild(fila);
}