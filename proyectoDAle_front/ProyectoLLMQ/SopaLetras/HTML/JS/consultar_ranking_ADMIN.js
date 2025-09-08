document.addEventListener("DOMContentLoaded", async () => {
  await cargarRankingDesdeBD();
});

async function cargarRankingDesdeBD() {
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

    resultado.data.forEach((usuario, i) => {
      const nick = document.getElementById(`usuario-${i + 1}`);
      const puntos = document.getElementById(`puntuacion-${i + 1}`);
      if (nick && puntos) {
        nick.textContent = usuario.nickusuari;
        puntos.textContent = usuario.puntuacionTotal;
      }
    });

  } catch (error) {
    console.error("Error al obtener el ranking:", error);
  }
}