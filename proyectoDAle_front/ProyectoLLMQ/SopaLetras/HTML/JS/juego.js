const TAM_TABLERO = 10;

document.addEventListener("DOMContentLoaded", () => {
  cargarOpcionesSopas();
  const form = document.querySelector("#formJuego");
  if (form) form.addEventListener("submit", onJugar);

  const botones = Array.from(document.querySelectorAll(".juego-sopa .b-sopa"));
  botones.forEach((b, idx) => {
    b.dataset.idx = idx;
    b.addEventListener("click", alPulsarCasilla);
  });

  document.querySelector("#fin button")
          ?.addEventListener("click", finalizarPartida);
});


async function cargarOpcionesSopas() {
  const q = `
    SELECT s.id_sopa, n.tipus AS nom
    FROM Sopa_Lletres s
    JOIN Nivell n USING(id_nivell)
    WHERE s.estat='si';
  `;
  try {
    const res = await read(q);
    const select = document.getElementById("tipoSopa");
    select.innerHTML = `<option value="">-- Elige un nivel --</option>`;
    res.data.forEach(({id_sopa, nom}) => {
      const opt = document.createElement("option");
      opt.value = id_sopa;
      opt.textContent = nom;
      select.appendChild(opt);
    });
  } catch (e) {
    console.error("Error cargando niveles:", e);
    alert("No se pudieron cargar las sopas.");
  }
}

let posicionesCorrectas    = new Set();
let posicionesSeleccionadas = new Set();
let timer                   = null;
let tInicio                 = 0;
let pesNivel                = 1;

function getColor(key, def){ return localStorage.getItem(key) || def; }
const COLOR_CORRECTO  = getColor("colorCorrecto" , "#02fc18");
const COLOR_INCORRECT = getColor("colorIncorrecto", "#fc2b02");

async function onJugar(evt) {
  evt.preventDefault();
  const idSopa = document.getElementById("tipoSopa").value;
  if (!idSopa) return alert("Selecciona primero un nivel.");

  posicionesCorrectas.clear();
  posicionesSeleccionadas.clear();
  clearInterval(timer);

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

  // reiniciar contadores
  tInicio = Date.now();
  document.getElementById("input-tiempo").value    = "00:00";
  document.getElementById("input-resultado").value = "";
  timer = setInterval(actualizarCrono, 1000);
}


async function cargarPalabras(idSopa) {
  try {
    const res = await read(`
      SELECT p.nom
      FROM Sopa_Lletres_Paraula slp
      JOIN Paraula p USING(id_paraula)
      WHERE slp.id_sopa=${idSopa};
    `);
    const cols = document.querySelectorAll(".listado-palabras .columna");
    cols.forEach(ul => ul.innerHTML = "");
    const palabras = res.data.map(r => r.nom);
    const mitad = Math.ceil(palabras.length/2);
    palabras.forEach((w,i) => {
      const li = document.createElement("li");
      li.textContent = w;
      cols[i<mitad?0:1].appendChild(li);
    });
  } catch(e) {
    console.error("Error cargando palabras:", e);
    alert("No se pudieron cargar las palabras.");
  }
}

async function cargarLetras(idSopa) {
  try {
    const res = await read(`
      SELECT l.caracter AS letra,
             sll.posicioX AS x,
             sll.posicioY AS y
      FROM Sopa_Lletres_Lletra sll
      JOIN Lletra l USING(id_lletra)
      WHERE sll.id_sopa=${idSopa};
    `);
    const botones = Array.from(document.querySelectorAll(".juego-sopa .b-sopa"));
    botones.forEach(b => b.textContent="");
    res.data.forEach(({letra,x,y}) => {
      const idx = (y-1)*TAM_TABLERO + (x-1);
      if (botones[idx]) {
        botones[idx].textContent = letra;
      }
    });
  } catch(e) {
    console.error("Error cargando letras:", e);
    alert("No se pudieron cargar las letras.");
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
    res.data.forEach(({ xs, ys, xe, ye }) => {
      if (ys === ye) {
        const y = ys;
        const [x0, x1] = xs < xe ? [xs, xe] : [xe, xs];
        for (let x = x0; x <= x1; x++) {
          posicionesCorrectas.add((y - 1) * TAM_TABLERO + (x - 1));
        }
      }
    
      else if (xs === xe) {
        const x = xs;
        const [y0, y1] = ys < ye ? [ys, ye] : [ye, ys];
        for (let y = y0; y <= y1; y++) {
          posicionesCorrectas.add((y - 1) * TAM_TABLERO + (x - 1));
        }
      }
    });
  } catch (e) {
    console.error("Error cargando posicionesCorrectas:", e);
    alert("No se pudieron cargar las posiciones de las palabras.");
  }
}

function actualizarCrono() {
  const segs = Math.floor((Date.now()-tInicio)/1000);
  const mm = String(Math.floor(segs/60)).padStart(2,"0");
  const ss = String(segs%60).padStart(2,"0");
  document.getElementById("input-tiempo").value = `${mm}:${ss}`;
  if (segs >= 60) finalizarPartida();
}

function alPulsarCasilla(e) {
  const btn = e.currentTarget;
  const idx = Number(btn.dataset.idx);
  if (posicionesSeleccionadas.has(idx)) return;
  posicionesSeleccionadas.add(idx);

  const esOK = posicionesCorrectas.has(idx);
  btn.style.backgroundColor = esOK
    ? COLOR_CORRECTO
    : COLOR_INCORRECT;

  if ([...posicionesCorrectas].every(p => posicionesSeleccionadas.has(p))) {
    finalizarPartida();
  }
}

async function finalizarPartida() {
  clearInterval(timer);
  document.querySelectorAll(".juego-sopa .b-sopa")
          .forEach(b => b.disabled = true);

  const segs = Math.floor((Date.now()-tInicio)/1000);
  const mm   = String(Math.floor(segs/60)).padStart(2,"0");
  const ss   = String(segs%60).padStart(2,"0");
  document.getElementById("input-tiempo").value = `${mm}:${ss}`;

  const ac = [...posicionesCorrectas]
               .filter(p => posicionesSeleccionadas.has(p))
               .length;
  const ok = ac === posicionesCorrectas.size && segs < 60;
  let puntos = 0;
  if (ok) {
    puntos = (60 - segs) * pesNivel;
    document.getElementById("input-resultado").value = `✔ +${puntos} pts`;
  } else {
    document.getElementById("input-resultado").value = "✖ 0 pts";
  }

  const idU = localStorage.getItem("id_usuari");
  const idS = document.getElementById("tipoSopa").value;
  if (ok && idU && idS) {
    try {
      await createSilent(`
        INSERT INTO Sopa_Lletres_Usuari (id_usuari,id_sopa,punts)
        VALUES(${idU},${idS},${puntos})
        ON DUPLICATE KEY UPDATE punts = GREATEST(punts,VALUES(punts));
      `);
    } catch(err){
      console.error("Error guardando puntos:",err);
    }
  }
}
