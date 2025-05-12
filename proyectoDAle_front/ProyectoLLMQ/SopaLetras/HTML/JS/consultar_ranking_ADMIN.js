document.addEventListener("DOMContentLoaded", async () => {
  await cargarRankingCompleto();
});

async function cargarRankingCompleto() {
  const query = `
    SELECT Usuari.nickusuari, SUM(Sopa_Lletres_Usuari.punts) AS puntuacionTotal
    FROM Sopa_Lletres_Usuari
    JOIN Usuari ON Usuari.id_usuari = Sopa_Lletres_Usuari.id_usuari
    GROUP BY Usuari.id_usuari
    ORDER BY puntuacionTotal DESC
    LIMIT 3
  `;

  try {
    const resultado = await read(query);
    
    if (!resultado || !resultado.data || resultado.data.length === 0) {
      console.warn("No se encontraron usuarios para el ranking.");
      return;
    }

    insertarRanking(resultado.data);
  } catch (error) {
    console.error("Error al cargar el ranking:", error);
  }
}

function insertarRanking(usuarios) {
  const lista = document.querySelector(".ranking ol");
  if (!lista) {
    console.error("No se encontró la lista del ranking.");
    return;
  }

  lista.innerHTML = ""; // Limpiar contenido previo

  const posiciones = ["Primero", "Segundo", "Tercero"];

  usuarios.forEach((usuario, index) => {
    const itemNombre = document.createElement("li");
    itemNombre.innerHTML = `<b>${posiciones[index]}: </b>${usuario.nickusuari}`;

    const itemPuntos = document.createElement("li");
    itemPuntos.style.listStyleType = "none";
    itemPuntos.innerHTML = `<b>Puntuación: </b>${usuario.puntuacionTotal}`;

    lista.appendChild(itemNombre);
    lista.appendChild(itemPuntos);
  });
}
