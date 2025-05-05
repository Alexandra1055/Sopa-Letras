const usuariosPorDificultad = {
    facil: [
      { nickusuari: "JuanFacil", punts: 1200 },
      { nickusuari: "AnaFacil", punts: 1100 },
      { nickusuari: "LuisFacil", punts: 900 },
    ],
    medio: [
      { nickusuari: "CarlosMedio", punts: 1800 },
      { nickusuari: "ElenaMedio", punts: 1700 },
      { nickusuari: "SaraMedio", punts: 1600 },
    ],
    dificil: [
      { nickusuari: "PedroDificil", punts: 2500 },
      { nickusuari: "LuciaDificil", punts: 2400 },
      { nickusuari: "MiguelDificil", punts: 2200 },
    ],
  };
  
  // Función para insertar en la tabla según dificultad
  function insertarRanking(dificultad) {
    const usuarios = usuariosPorDificultad[dificultad];
  
    if (!usuarios || usuarios.length === 0) {
      console.warn(`No hay usuarios para la dificultad: ${dificultad}`);
      return;
    }
  
    const tabla = document.querySelector(`.tabla-puntos.${dificultad} table`);
  
    if (!tabla) {
      console.error(`No se encontró la tabla para dificultad ${dificultad}`);
      return;
    }
  
    const tbody = tabla.querySelector("tbody");
    tbody.innerHTML = "";
  
    usuarios.forEach((usuario) => {
      const fila = document.createElement("tr");
  
      const celdaNombre = document.createElement("td");
      celdaNombre.textContent = usuario.nickusuari;
  
      const celdaPuntos = document.createElement("td");
      celdaPuntos.textContent = usuario.punts;
  
      fila.appendChild(celdaNombre);
      fila.appendChild(celdaPuntos);
  
      tbody.appendChild(fila);
    });
  }
  
  // Cargar rankings al cargar la página
  document.addEventListener("DOMContentLoaded", () => {
    insertarRanking("facil");
    insertarRanking("medio");
    insertarRanking("dificil");
  });