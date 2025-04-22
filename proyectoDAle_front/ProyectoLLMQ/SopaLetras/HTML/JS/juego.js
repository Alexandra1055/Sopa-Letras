const TAM_TABLERO = 10;

document.addEventListener("DOMContentLoaded", () => {
  cargarOpcionesSopas();
  const form = document.querySelector("#formJuego");
  if (form) form.addEventListener("submit", onJugar);
});

async function cargarOpcionesSopas() {
  try {
    const res = await read(`
      SELECT id_sopa, nom
      FROM Sopa_Lletres
      WHERE estat = 'si';
    `);
    const select = document.querySelector("#tipoSopa");
    if (!select) return;
    select.innerHTML = "<option value=\"\">-- Elige una sopa --</option>";
    res.data.forEach(({ id_sopa, nom }) => {
      const opt = document.createElement("option");
      opt.value = id_sopa;
      opt.textContent = nom;
      select.appendChild(opt);
    });
  } catch (e) {
    console.error("Error cargando sopas:", e);
    alert("No se pudieron cargar las sopas disponibles.");
  }
}

async function onJugar(evt) {
  evt.preventDefault();
  const select = document.getElementById("tipoSopa");
  if (!select) return alert("No hay desplegable de sopas en la página.");
  const idSopa = select.value;
  if (!idSopa) return alert("Selecciona primero una sopa.");

  try {
    await Promise.all([
      cargarPalabras(idSopa),
      cargarLetras(idSopa),
    ]);
  } catch (e) {
    console.error("Error al cargar la sopa seleccionada:", e);
    alert("No se pudo iniciar el juego. Revisa la consola.");
  }
}

async function cargarPalabras(idSopa) {
  const q = `
    SELECT p.nom
    FROM Sopa_Lletres_Paraula slp
    JOIN Paraula p ON slp.id_paraula = p.id_paraula
    WHERE slp.id_sopa = ${idSopa};
  `;
  try {
    const res = await read(q);
    const palabras = res.data.map(r => r.nom);
    const columnas = document.querySelectorAll(".listado-palabras .columna");
    columnas.forEach(ul => ul.innerHTML = "");
    const mitad = Math.ceil(palabras.length / 2);
    palabras.forEach((w, i) => {
      const li = document.createElement("li");
      li.textContent = w;
      columnas[i < mitad ? 0 : 1].appendChild(li);
    });
  } catch (e) {
    console.error("Error cargando palabras:", e);
    alert("No se pudieron cargar las palabras.");
  }
}

async function cargarLetras(idSopa) {
  const q = `
    SELECT l.caracter AS letra,
           sll.posicioX AS x,
           sll.posicioY AS y
    FROM Sopa_Lletres_Lletra sll
    JOIN Lletra l ON sll.id_lletra = l.id_lletra
    WHERE sll.id_sopa = ${idSopa};
  `;
  try {
    const res = await read(q);
    const botones = Array.from(document.querySelectorAll(".juego-sopa .b-sopa"));
    botones.forEach(b => b.textContent = "");
    res.data.forEach(({ letra, x, y }) => {
      const idx = (y - 1) * TAM_TABLERO + (x - 1);
      if (botones[idx]) botones[idx].textContent = letra;
    });
  } catch (e) {
    console.error("Error cargando letras:", e);
    alert("No se pudieron cargar las letras.");
  }
}
