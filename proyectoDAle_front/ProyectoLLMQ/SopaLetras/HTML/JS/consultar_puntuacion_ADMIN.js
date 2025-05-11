  // Función para insertar en la tabla según dificultad
  function insertarInformacion(nombre, puntos, dificultad) {
    const tabla = document.querySelector(`.tabla-puntos.${dificultad}`);
  
    if (!tabla) {
      console.error(`No se encontró la tabla para dificultad ${dificultad}`);
      return;
    }
  
      const tbody = tabla.querySelector("tbody");

      const fila = document.createElement("tr");
  
      const celdaNombre = document.createElement("td");
      celdaNombre.textContent = nombre;
  
      const celdaPuntos = document.createElement("td");
      celdaPuntos.textContent = puntos;
  
      fila.appendChild(celdaNombre);
      fila.appendChild(celdaPuntos);
      tbody.appendChild(fila);
    };
  
  document.addEventListener("DOMContentLoaded", async () => {
  await cargarUsuarios();
});

async function cargarUsuarios() {
  const query = `
    SELECT Usuari.nickusuari, Sopa_Lletres.id_nivell, SUM(Sopa_Lletres_Usuari.punts) AS puntuacion
    FROM Sopa_Lletres_Usuari
    JOIN Usuari ON Usuari.id_usuari = Sopa_Lletres_Usuari.id_usuari
    JOIN Sopa_Lletres ON Sopa_Lletres.id_sopa = Sopa_Lletres_Usuari.id_sopa
    GROUP BY Usuari.id_usuari, Sopa_Lletres.id_nivell
    ORDER BY Sopa_Lletres.id_nivell, puntuacion DESC
  `;

  try {
    const resultado = await read(query);
    console.log("Resultado de la query:", resultado);

    if (!resultado || resultado.data.length === 0) {
      console.warn("No se encontraron datos.");
      return;
    }

    resultado.data.forEach((fila) => {
      const dificultad = obtenerDificultad(fila.id_nivell);
      if (dificultad) {
        insertarInformacion(fila.nickusuari, fila.puntuacion, dificultad);
      }
    });
  } catch (error) {
    console.error("Error al cargar los resultados:", error);
  }
}

  //Funcion para obtener la dificultad
  function obtenerDificultad(id_nivell){
    switch(id_nivell){
      case(1):
        return "facil";

      case(2):
        return "intermedio";

      case(3):
        return "dificil";

      default:
        return null;
    }
  }