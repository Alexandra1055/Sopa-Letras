// juego.js
const TAM_TABLERO = 10;

let mapaPalabras = {};

document.addEventListener("DOMContentLoaded", () => {
  cargarOpcionesSopas();
  document.querySelector("#formJuego")
          ?.addEventListener("submit", onJugar);

  document.querySelectorAll(".juego-sopa .b-sopa").forEach(b => {
    b.addEventListener("click", alPulsarCasilla);
  });

  document.querySelector("#fin button")
          ?.addEventListener("click", finalizarPartida);

  const style = document.createElement("style");
  style.textContent = `
    .tachada {
      text-decoration: line-through;
      color: red !important;
    }
  `;
  document.head.appendChild(style);
});

let posicionesCorrectas     = new Set();
let posicionesSeleccionadas = new Set();
let timer                   = null;
let tInicio                 = 0;
let pesNivel                = 1;
let COLOR_CORRECTO          = "#02fc18";
let COLOR_INCORRECT         = "#fc2b02";

// Carga preferencias de color
async function cargarPreferenciasColores() {
  const idU = localStorage.getItem("id_usuari");
  if (!idU) return;
  try {
    const res = await read(`
      SELECT id_color, valor
      FROM Usuari_Color
      WHERE id_usuari = ${idU};
    `);
    res.data.forEach(({id_color, valor}) => {
      if (id_color === 1)      COLOR_CORRECTO  = valor;
      else if (id_color === 2) COLOR_INCORRECT = valor;
    });
  } catch (e) {
    console.error("No pude cargar preferencias de color:", e);
  }
}

async function onJugar(evt) {
  evt.preventDefault();
  const idSopa = +document.getElementById("tipoSopa").value;
  if (!idSopa) return alert("Selecciona primero un nivel.");

  clearInterval(timer);
  posicionesCorrectas.clear();
  posicionesSeleccionadas.clear();

  await cargarPalabras(idSopa);
  await cargarPreferenciasColores();
  await cargarLetras(idSopa);
  await cargarPosicionesCorrectas(idSopa);

  try {
    const {data} = await read(`
      SELECT n.pes
      FROM Sopa_Lletres s
      JOIN Nivell n USING(id_nivell)
      WHERE s.id_sopa=${idSopa};
    `);
    pesNivel = data[0]?.pes || 1;
  } catch {
    pesNivel = 1;
  }

  tInicio = Date.now();
  document.getElementById("input-tiempo").value    = "05:00"; // 5 minutos
  document.getElementById("input-resultado").value = "";
  timer = setInterval(actualizarCrono, 500);
}

async function cargarOpcionesSopas() {
  try {
    const res = await read(`
      SELECT s.id_sopa, n.tipus AS nom
      FROM Sopa_Lletres s
      JOIN Nivell n USING(id_nivell)
      WHERE s.estat='si';
    `);
    const select = document.getElementById("tipoSopa");
    select.innerHTML = `<option value="">-- Elige un nivel --</option>`;
    res.data.forEach(({id_sopa, nom}) => {
      const o = document.createElement("option");
      o.value = id_sopa; o.textContent = nom;
      select.appendChild(o);
    });
  } catch (e) {
    console.error("Error cargando niveles:", e);
    alert("No se pudieron cargar las sopas.");
  }
}

async function cargarPalabras(idSopa) {
  try {
    const res = await read(`
      SELECT p.nom,
             slp.coordenadaX_start AS xs,
             slp.coordenadaY_start AS ys,
             slp.coordenadaX_end   AS xe,
             slp.coordenadaY_end   AS ye
      FROM Sopa_Lletres_Paraula slp
      JOIN Paraula p USING(id_paraula)
      WHERE slp.id_sopa=${idSopa};
    `);
    mapaPalabras = {};

    res.data.forEach(({nom, xs, ys, xe, ye}) => {
      const dx = xe - xs;
      const dy = ye - ys;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      const stepX = dx === 0 ? 0 : dx/Math.abs(dx);
      const stepY = dy === 0 ? 0 : dy/Math.abs(dy);

      const arr = [];
      for (let k = 0; k <= steps; k++) {
        const x = xs + stepX*k;
        const y = ys + stepY*k;
        arr.push((y-1)*TAM_TABLERO + (x-1));
      }
      mapaPalabras[nom] = arr;
    });

    // lista de palabras
    const cols = Array.from(document.querySelectorAll(".listado-palabras .columna"));
    cols.forEach(ul => ul.innerHTML = "");
    const palabras = res.data.map(r => r.nom);
    const mitad = Math.ceil(palabras.length / 2);

    palabras.forEach((w, i) => {
      const li = document.createElement("li");
      li.textContent = w;
      li.dataset.palabra = w;
      cols[i < mitad ? 0 : 1].appendChild(li);
    });

  } catch (e) {
    console.error("Error cargando palabras:", e);
  }
}

async function cargarLetras(idSopa) {
  try {
    const res = await read(`
      SELECT l.caracter AS letra, sll.posicioX AS x, sll.posicioY AS y
      FROM Sopa_Lletres_Lletra sll
      JOIN Lletra l USING(id_lletra)
      WHERE sll.id_sopa=${idSopa};
    `);
    const botones = Array.from(document.querySelectorAll(".juego-sopa .b-sopa"));
    botones.forEach(b => {
      b.textContent = "";
      b.style.backgroundColor = "";
      b.disabled = false;
    });
    res.data.forEach(({letra, x, y}) => {
      const idx = (y-1)*TAM_TABLERO + (x-1);
      botones[idx].textContent = letra;
      botones[idx].dataset.idx = idx;
    });
  } catch (e) {
    console.error("Error cargando letras:", e);
  }
}

async function cargarPosicionesCorrectas(idSopa) {
  posicionesCorrectas.clear();
  try {
    const res = await read(`
      SELECT coordenadaX_start AS xs,
             coordenadaY_start AS ys,
             coordenadaX_end   AS xe,
             coordenadaY_end   AS ye
      FROM Sopa_Lletres_Paraula
      WHERE id_sopa = ${idSopa};
    `);

    res.data.forEach(({xs, ys, xe, ye}) => {
      const dx = xe - xs;
      const dy = ye - ys;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      const stepX = dx === 0 ? 0 : dx/Math.abs(dx);
      const stepY = dy === 0 ? 0 : dy/Math.abs(dy);

      for (let k = 0; k <= steps; k++) {
        const x = xs + stepX*k;
        const y = ys + stepY*k;
        posicionesCorrectas.add((y-1)*TAM_TABLERO + (x-1));
      }
    });
  } catch (e) {
    console.error("Error cargando posicionesCorrectas:", e);
  }
}

function actualizarCrono() {
  const usados = Math.floor((Date.now() - tInicio)/1000);
  const restan = Math.max(0, 300 - usados);
  const mm = String(Math.floor(restan/60)).padStart(2,"0");
  const ss = String(restan%60).padStart(2,"0");
  document.getElementById("input-tiempo").value = `${mm}:${ss}`;
}

function alPulsarCasilla(e) {
  const btn = e.currentTarget;
  const idx = +btn.dataset.idx;
  if (posicionesSeleccionadas.has(idx)) return;

  posicionesSeleccionadas.add(idx);
  btn.style.backgroundColor =
    posicionesCorrectas.has(idx)
      ? COLOR_CORRECTO
      : COLOR_INCORRECT;

  tacharPalabras();
}

function tacharPalabras() {
  document.querySelectorAll(".listado-palabras li").forEach(li => {
    const w = li.dataset.palabra;
    const arr = mapaPalabras[w] || [];
    // si todas las casillas de esa palabra han sido seleccionadas
    const completa = arr.every(i => posicionesSeleccionadas.has(i));
    li.classList.toggle("tachada", completa);
  });
}

async function finalizarPartida() {
  clearInterval(timer);
  document.querySelectorAll(".juego-sopa .b-sopa")
          .forEach(b => b.disabled = true);

  const usados = Math.floor((Date.now() - tInicio)/1000);
  const restan = Math.max(0, 300 - usados);
  const mm = String(Math.floor(restan/60)).padStart(2,"0");
  const ss = String(restan%60).padStart(2,"0");
  document.getElementById("input-tiempo").value = `${mm}:${ss}`;

  const acertadas = [...posicionesCorrectas]
    .filter(p => posicionesSeleccionadas.has(p)).length;
  const ok = acertadas === posicionesCorrectas.size;

  let puntos = 0;
  if (ok) {
    const pesoReal = pesNivel / 10;
    puntos = Math.round((300 - restan)*pesoReal);
    puntos = Math.max(0, puntos);
    document.getElementById("input-resultado")
            .value = `✔ +${puntos} pts`;
  } else {
    document.getElementById("input-resultado")
            .value = "✖ 0 pts";
  }

  // Guardar en BD si ha sido ok
  const idU = localStorage.getItem("id_usuari");
  const idS = document.getElementById("tipoSopa").value;
  if (ok && idU && idS) {
    try {
      await createSilent(`
        INSERT INTO Sopa_Lletres_Usuari (id_usuari,id_sopa,punts)
        VALUES(${idU},${idS},${puntos})
        ON DUPLICATE KEY UPDATE punts = GREATEST(punts, VALUES(punts));
      `);
    } catch (e) {
      console.error("Error guardando puntos:", e);
    }
  }
}
