/* Read sopa: Consulta sopas */
const TAM_TABLERO = 10;

document.addEventListener("DOMContentLoaded", () => {
  cargarOpcionesSopas();
  document.querySelector("form").addEventListener("submit", onConsultarSopa);
});

// 1) Pobla el <select> con todas las sopas disponibles
async function cargarOpcionesSopas() {
  try {
    const result = await read("SELECT id_sopa, nom FROM Sopa_Lletres");
    const select = document.getElementById("tipoSopa");
    select.innerHTML = "";  // limpia
    result.data.forEach(row => {
      const opt = document.createElement("option");
      opt.value = row.id_sopa;
      opt.textContent = row.nom;
      select.appendChild(opt);
    });
  } catch (e) {
    console.error("Error cargando sopas:", e);
    alert("No se pudieron cargar las sopas.");
  }
}

// 2) Handler al pulsar "Consultar"
async function onConsultarSopa(evt) {
  evt.preventDefault();
  const idSopa = document.getElementById("tipoSopa").value;
  if (!idSopa) return alert("Selecciona una sopa.");
  await Promise.all([
    cargarPalabras(idSopa),
    cargarLetras(idSopa)
  ]);
}

// 3) Carga las palabras de la sopa y las mete en las <ul class="listado-palabras">
async function cargarPalabras(idSopa) {
  try {
    const q = `
      SELECT p.nom,
             slp.coordenadaX_start AS xs,
             slp.coordenadaY_start AS ys,
             slp.coordenadaX_end   AS xe,
             slp.coordenadaY_end   AS ye
      FROM Sopa_Lletres_Paraula slp
      JOIN Paraula p ON slp.id_paraula = p.id_paraula
      WHERE slp.id_sopa = ${idSopa};
    `;
    const res = await read(q);
    const palabras = res.data.map(r => r.nom);
    // vaciar ambas columnas
    document.querySelectorAll(".listado-palabras .columna").forEach(ul => ul.innerHTML = "");
    // repartir: primera mitad en col 0, segunda en col 1
    const mitad = Math.ceil(palabras.length / 2);
    palabras.forEach((w, i) => {
      const li = document.createElement("li");
      li.textContent = w;
      const col = i < mitad ? 0 : 1;
      document.querySelectorAll(".listado-palabras .columna")[col].appendChild(li);
    });
  } catch (e) {
    console.error("Error cargando palabras:", e);
    alert("No se pudieron cargar las palabras.");
  }
}

// 4) Carga las letras según posición y las pinta en el tablero
async function cargarLetras(idSopa) {
  try {
    const q = `
      SELECT l.caracter AS letra,
             sll.posicioX AS x,
             sll.posicioY AS y
      FROM Sopa_Lletres_Lletra sll
      JOIN Lletra l ON sll.id_lletra = l.id_lletra
      WHERE sll.id_sopa = ${idSopa};
    `;
    const res = await read(q);
    const botones = Array.from(document.querySelectorAll(".juego-sopa .b-sopa"));
    // limpiar tablero
    botones.forEach(b => b.textContent = "");
    // colocar cada letra
    res.data.forEach(({ letra, x, y }) => {
      const idx = (y - 1) * TAM_TABLERO + (x - 1);
      if (botones[idx]) botones[idx].textContent = letra;
    });
  } catch (e) {
    console.error("Error cargando letras:", e);
    alert("No se pudieron cargar las letras.");
  }
}

/**
 * 5) Carga y pinta el estado de la sopa y añade el botón de toggle
 */
async function cargarEstado(idSopa) {
    try {
      // 5.1) Leer estado y nivel
      const res = await read(`
        SELECT nom, estat, id_nivell 
        FROM Sopa_Lletres 
        WHERE id_sopa = ${idSopa};
      `);
      const { nom, estat, id_nivell: nivel } = res.data[0];
  
      // 5.2) Construir UI
      // buscamos (o creamos) un contenedor en .contadores-juego
      let cont = document.querySelector('.contadores-juego .estado-sopa');
      if (!cont) {
        cont = document.createElement('div');
        cont.className = 'estado-sopa';
        document.querySelector('.contadores-juego').appendChild(cont);
      }
      cont.innerHTML = `
        <p><strong>Estado:</strong> ${estat === 'si' ? 'ACTIVA' : 'INACTIVA'}</p>
        <button id="btn-toggle-estado">
          ${estat === 'si' ? 'Desactivar' : 'Activar'}
        </button>
      `;
  
      // 5.3) Listener para el botón
      document
        .getElementById('btn-toggle-estado')
        .addEventListener('click', () => onToggleEstado(idSopa, nivel, nom, estat));
    } catch (e) {
      console.error('Error cargando estado de la sopa:', e);
      alert('No se pudo leer el estado de la sopa.');
    }
  }
  
  /**
   * 6) Al pulsar activar/desactivar
   */
  async function onToggleEstado(idSopa, nivel, nombreSopa, estadoActual) {
    try {
      if (estadoActual === 'si') {
        // Desactivar sin más
        await createSilent(`
          UPDATE Sopa_Lletres
          SET estat = 'no'
          WHERE id_sopa = ${idSopa};
        `);
        alert(`Sopa "${nombreSopa}" desactivada.`);
      } else {
        // Antes de activar, verificar que no exista otra activa en el mismo nivel
        const otras = await read(`
          SELECT id_sopa, nom 
          FROM Sopa_Lletres 
          WHERE id_nivell = ${nivel} AND estat = 'si';
        `);
        if (otras.data.length) {
          const { nom: otraNom } = otras.data[0];
          return alert(
            `Actualmente tienes la sopa "${otraNom}" activa en este nivel.\n` +
            `Desactívala antes de activar otra.`
          );
        }
        // Activar
        await createSilent(`
          UPDATE Sopa_Lletres
          SET estat = 'si'
          WHERE id_sopa = ${idSopa};
        `);
        alert(`Sopa "${nombreSopa}" activada.`);
      }
  
      // 6.3) Recargar estado UI
      await cargarEstado(idSopa);
  
    } catch (e) {
      console.error('Error cambiando estado de la sopa:', e);
      alert('No se pudo cambiar el estado de la sopa.');
    }
  }
  
  // 7) Inyectamos la carga de estado en el flujo de consulta
  // Modifica tu onConsultarSopa para que, además de cargar palabras y letras,
  // llame a cargarEstado:
  
  async function onConsultarSopa(evt) {
    evt.preventDefault();
    const idSopa = document.getElementById("tipoSopa").value;
    if (!idSopa) return alert("Selecciona una sopa.");
  
    await Promise.all([
      cargarPalabras(idSopa),
      cargarLetras(idSopa)
    ]);
  
    // <-- AÑADE ESTA LÍNEA
    await cargarEstado(idSopa);
  }