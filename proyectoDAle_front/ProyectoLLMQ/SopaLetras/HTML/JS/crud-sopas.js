

const posicionesPalabras = [];
let palabraSeleccionada = null;
let inicioSeleccionado = null;

const TAM_TABLERO = 10;
const ABECEDARIO = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

document.addEventListener("DOMContentLoaded", () => {
  inicializarInputs();
  inicializarTablero();
  inicializarTeclado();

  document.getElementById("btn-guardar-palabras")
          .addEventListener("click", guardarPalabras);
  document.getElementById("btn-posicionar")
          .addEventListener("click", toggleModoPosicion);
  document.getElementById("btn-autocompletar")
          .addEventListener("click", autocompletar);
  document.getElementById("btn-reset")
          .addEventListener("click", reiniciarTablero);
  document.getElementById("btn-guardar")
          .addEventListener("click", guardarSopa);
});

async function guardarPalabras() {
  posicionesPalabras.length = 0;
  const inputs = Array.from(document.querySelectorAll(".palabras-alta-sopa input"));
  for (const input of inputs) {
    const palabra = input.value.trim().toUpperCase();
    if (!palabra) continue;

    // uso createSilent para no disparar alert por cada palabra
    await createSilent(`INSERT IGNORE INTO Paraula (nom) VALUES ('${palabra}');`);
    const resp = await read(`SELECT id_paraula FROM Paraula WHERE nom='${palabra}';`);
    const rows = Array.isArray(resp.data) ? resp.data : [resp.data];
    if (!rows[0] || rows[0].id_paraula == null) {
      console.error("No se encontró id_paraula para", palabra);
      continue;
    }
    const id_paraula = rows[0].id_paraula;

    input.dataset.idParaula = id_paraula;
    posicionesPalabras.push({
      id_paraula,
      palabra,
      inicio: null,
      fin:    null
    });
  }

  // solo oculto el botón, SIN alert intermedio
  if (posicionesPalabras.length > 0) {
    document.getElementById("btn-guardar-palabras").style.display = "none";
  }
}

function inicializarInputs() {
  document.querySelectorAll(".palabras-alta-sopa input")
          .forEach(input => {
    input.addEventListener("click", () => {
      if (!document.body.classList.contains("modo-posicion")) return;
      palabraSeleccionada = input;
      document.querySelectorAll(".palabras-alta-sopa input.selected-input")
              .forEach(i => i.classList.remove("selected-input"));
      input.classList.add("selected-input");
    });
  });
}

function inicializarTablero() {
  document.querySelectorAll(".tablero-sopa .b-tsopa")
          .forEach(c => c.addEventListener("click", onClickCelda));
}

function inicializarTeclado() {
  document.querySelectorAll(".letras .b-letra")
          .forEach(b => b.addEventListener("click", onClickLetra));
}

function toggleModoPosicion() {
  const modo = document.body.classList.toggle("modo-posicion");
  document.getElementById("btn-posicionar").textContent =
    modo ? "Salir de posicionar" : "Posicionar palabras";
  reiniciarTablero();
  palabraSeleccionada = null;
  inicioSeleccionado = null;
  posicionesPalabras.forEach(p => { p.inicio = null; p.fin = null; });
  document.querySelectorAll(".palabras-alta-sopa input.selected-input")
          .forEach(i => i.classList.remove("selected-input"));
}

function onClickCelda(e) {
  if (!document.body.classList.contains("modo-posicion")) return;
  const cel = e.currentTarget;
  if (!palabraSeleccionada) return alert("Primero haz clic en la palabra.");
  if (!inicioSeleccionado) {
    inicioSeleccionado = getCoords(cel);
    cel.classList.add("endpoint-selected");
    return;
  }
  const fin = getCoords(cel);
  colocarPalabra(palabraSeleccionada, inicioSeleccionado, fin);
  document.querySelectorAll(".endpoint-selected").forEach(c => c.classList.remove("endpoint-selected"));
  palabraSeleccionada.classList.remove("selected-input");
  palabraSeleccionada = null;
  inicioSeleccionado = null;
}

function onClickLetra() {
  if (!document.body.classList.contains("modo-posicion")) return;
  if (!inicioSeleccionado) alert("Selecciona primero una casilla");
}

function colocarPalabra(inputElem, start, end) {
  const palabra = inputElem.value.trim().toUpperCase().split("");
  const L       = palabra.length;
  const dx = Math.sign(end[0] - start[0]);
  const dy = Math.sign(end[1] - start[1]);
  if (Math.max(Math.abs(end[0]-start[0]), Math.abs(end[1]-start[1])) !== L-1) {
    return alert("Longitud incorrecta");
  }
  for (let k=0; k<L; k++) {
    const x = start[0] + dx*k;
    const y = start[1] + dy*k;
    if (x<1||x>TAM_TABLERO||y<1||y>TAM_TABLERO) return alert("Fuera del tablero");
    const idx = (y-1)*TAM_TABLERO + (x-1);
    document.querySelectorAll(".tablero-sopa .b-tsopa")[idx].textContent = palabra[k];
  }
  const id_paraula = Number(inputElem.dataset.idParaula);
  const p = posicionesPalabras.find(pp => pp.id_paraula === id_paraula);
  if (p) p.inicio = { x:start[0], y:start[1] }, p.fin = { x:end[0], y:end[1] };
}

function getCoords(celda) {
  const arr = Array.from(document.querySelectorAll(".tablero-sopa .b-tsopa"));
  const i   = arr.indexOf(celda);
  return [(i % TAM_TABLERO) + 1, Math.floor(i / TAM_TABLERO) + 1];
}

function autocompletar() {
  document.querySelectorAll(".tablero-sopa .b-tsopa").forEach(c => {
    if (!c.textContent.trim()) {
      c.textContent = ABECEDARIO[Math.floor(Math.random()*ABECEDARIO.length)];
    }
  });
}

function reiniciarTablero() {
  document.querySelectorAll(".tablero-sopa .b-tsopa").forEach(c => {
    c.textContent = "";
    c.classList.remove("endpoint-selected");
  });
  posicionesPalabras.forEach(p => { p.inicio = null; p.fin = null; });
}

async function guardarSopa(e) {
  e.preventDefault();
  const admin = Number(localStorage.getItem("id_admin"));
  if (!admin) return alert("Sin sesión de administrador");

  // datos iniciales
  const dificultad = document.querySelector("input[name=dificultat]:checked").value;
  const nivel = { facil:1, intermedio:2, dificil:3 }[dificultad];
  const estado = 'no';

  // 1) Creo la sopa y leo insertId (sin alert aquí)
  const res = await createSilent(`
    INSERT INTO Sopa_Lletres (nom, estat, id_nivell, id_admin)
    VALUES ('', '${estado}', ${nivel}, ${admin});
  `);
  const id_sopa = res.data.insertId;
  if (!id_sopa) {
    console.error("No vino insertId:", res);
    return alert("Error interno creando la sopa");
  }

  // 2) Actualizo nombre (sin alert)
  const primera = document.getElementById("palabra1").value.trim().toUpperCase();
  await updateSilent(`
    UPDATE Sopa_Lletres
    SET nom='${id_sopa}_${primera}_${admin}'
    WHERE id_sopa=${id_sopa};
  `);

  // 3) Inserto posiciones de palabras SIN alert
  for (const p of posicionesPalabras) {
    if (!p.id_paraula||!p.inicio||!p.fin) continue;
    await createSilent(`
      INSERT INTO Sopa_Lletres_Paraula
        (id_sopa,id_paraula,coordenadaX_start,coordenadaY_start,coordenadaX_end,coordenadaY_end)
      VALUES (${id_sopa},${p.id_paraula},${p.inicio.x},${p.inicio.y},${p.fin.x},${p.fin.y});
    `);
  }

  // 4) Inserto letras SIN alert
  const mapaLetras = {};
  document.querySelectorAll(".tablero-sopa .b-tsopa").forEach(c => {
    const l = c.textContent.trim()||ABECEDARIO[Math.floor(Math.random()*ABECEDARIO.length)];
    mapaLetras[l] = null;
  });
  for (const l of Object.keys(mapaLetras)) {
    await createSilent(`INSERT IGNORE INTO Lletra (caracter) VALUES ('${l}');`);
    const { data:[{ id_lletra }] } = await read(`SELECT id_lletra FROM Lletra WHERE caracter='${l}';`);
    mapaLetras[l] = id_lletra;
  }
  const celdas = Array.from(document.querySelectorAll(".tablero-sopa .b-tsopa"));
  for (let i=0;i<celdas.length;i++){
    const c = celdas[i];
    const l = c.textContent.trim()||ABECEDARIO[Math.floor(Math.random()*ABECEDARIO.length)];
    const x = (i%TAM_TABLERO)+1;
    const y = Math.floor(i/TAM_TABLERO)+1;
    await createSilent(`
      INSERT INTO Sopa_Lletres_Lletra
        (id_sopa,id_lletra,posicioX,posicioY)
      VALUES (${id_sopa},${mapaLetras[l]},${x},${y});
    `);
  }

  alert(`¡Sopa guardada con éxito con id ${id_sopa}!`);
}

/* Consultar sopa: Consulta_sopas */
/* Eliminar sopa: Baja_sopas */