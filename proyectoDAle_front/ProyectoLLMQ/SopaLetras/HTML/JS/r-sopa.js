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