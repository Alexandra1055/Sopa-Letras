document.addEventListener("DOMContentLoaded", () => {
    const nombreUsuario = "PEscanellas";
    const puntuacionUsuario = 1000;
  
    const tabla = document.querySelector(".tabla-puntos table tbody");
  
    if (tabla) {
      const fila = document.createElement("tr");
  
      const celdaNombre = document.createElement("td");
      celdaNombre.textContent = nombreUsuario;
  
      const celdaPuntos = document.createElement("td");
      celdaPuntos.textContent = puntuacionUsuario;
  
      fila.appendChild(celdaNombre);
      fila.appendChild(celdaPuntos);
  
      tabla.appendChild(fila);
    } else {
      console.warn("No se encontró el tbody de la tabla");
    }
  });