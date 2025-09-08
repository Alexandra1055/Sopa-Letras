// juego.js
const TAMANO_TABLERO = 10;

// Variables globales
let palabrasYPosiciones = {}; 
let casillasCorrectas = new Set();
let casillasSeleccionadas = new Set();
let temporizador = null;
let tiempoInicio = 0;
let juegoFinalizado = false;
let pesNivel = 1;
let colorCorrecto = "#02fc18";
let colorIncorrecto = "#fc2b02"; 

document.addEventListener("DOMContentLoaded", () => {
  cargarOpcionesDeSopa();
  document.getElementById("formJuego").addEventListener("submit", iniciarJuego); // Evento para iniciar el juego

  document.querySelectorAll(".juego-sopa .b-sopa").forEach(boton => {
    boton.addEventListener("click", alPulsarCasilla);
  });

  document.querySelector("#fin button").addEventListener("click", finalizarJuego);
});

// Carga los colores que tiene el usuario en su BD
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
      if (id_color === 1)      colorCorrecto  = valor;
      else if (id_color === 2) colorIncorrecto = valor;
    });
  } catch (e) {
    console.error("No pude cargar preferencias de color:", e);
  }
}

// Función para iniciar el juego
async function iniciarJuego(evento) {
  evento.preventDefault();
  const idSopa = +document.getElementById("tipoSopa").value;
  if (!idSopa) {
    alert("Por favor, selecciona un nivel.");
    return;
  }

  clearInterval(temporizador);
  casillasCorrectas.clear();
  casillasSeleccionadas.clear();

  await cargarPalabras(idSopa);
  await cargarPreferenciasColores();
  await cargarLetras(idSopa);
  await cargarPosicionesCorrectas(idSopa);

  tiempoInicio = Date.now();
  document.getElementById("input-tiempo").value = "05:00";
  document.getElementById("input-resultado").value = "";
  temporizador = setInterval(actualizarCronometro, 500);
}

// Función para cargar las opciones de sopas disponibles
async function cargarOpcionesDeSopa() {
  try {
    const respuesta = await read(`
      SELECT s.id_sopa, n.tipus AS nombre
      FROM Sopa_Lletres s
      JOIN Nivell n USING(id_nivell)
      WHERE s.estat='si';
    `);

    const selector = document.getElementById("tipoSopa");
    selector.innerHTML = `<option value="">-- Elige un nivel --</option>`;
    respuesta.data.forEach(({ id_sopa, nombre }) => {
      const opcion = document.createElement("option");
      opcion.value = id_sopa;
      opcion.textContent = nombre;
      selector.appendChild(opcion);
    });
  } catch (error) {
    console.error("Error al cargar las sopas:", error);
    alert("No se pudieron cargar las sopas.");
  }
}

// Función para cargar las palabras y sus posiciones
async function cargarPalabras(idSopa) {
  try {
    const respuesta = await read(`
      SELECT p.nom,
             slp.coordenadaX_start AS xInicio,
             slp.coordenadaY_start AS yInicio,
             slp.coordenadaX_end   AS xFin,
             slp.coordenadaY_end   AS yFin
      FROM Sopa_Lletres_Paraula slp
      JOIN Paraula p USING(id_paraula)
      WHERE slp.id_sopa=${idSopa};
    `);
    palabrasYPosiciones = {};

    respuesta.data.forEach(({ nom, xInicio, yInicio, xFin, yFin }) => {
      const deltaX = xFin - xInicio;
      const deltaY = yFin - yInicio;
      const pasos = Math.max(Math.abs(deltaX), Math.abs(deltaY));
      const pasoX = deltaX === 0 ? 0 : deltaX / Math.abs(deltaX);
      const pasoY = deltaY === 0 ? 0 : deltaY / Math.abs(deltaY);

      const posiciones = [];
      for (let k = 0; k <= pasos; k++) {
        const x = xInicio + pasoX * k;
        const y = yInicio + pasoY * k;
        posiciones.push((y - 1) * TAMANO_TABLERO + (x - 1));
      }
      palabrasYPosiciones[nom] = posiciones;
    });

    // Mostrar la lista de palabras
    const columnas = Array.from(document.querySelectorAll(".listado-palabras .columna"));
    columnas.forEach(columna => columna.innerHTML = "");
    const palabras = respuesta.data.map(r => r.nom);
    const mitad = Math.ceil(palabras.length / 2);

    palabras.forEach((palabra, i) => {
      const elemento = document.createElement("li");
      elemento.textContent = palabra;
      elemento.dataset.palabra = palabra;
      columnas[i < mitad ? 0 : 1].appendChild(elemento);
    });

  } catch (error) {
    console.error("Error al cargar las palabras:", error);
  }
}

// Función para cargar las letras en el tablero
async function cargarLetras(idSopa) {
  try {
    const respuesta = await read(`
      SELECT l.caracter AS letra, sll.posicioX AS x, sll.posicioY AS y
      FROM Sopa_Lletres_Lletra sll
      JOIN Lletra l USING(id_lletra)
      WHERE sll.id_sopa=${idSopa};
    `);
    const botones = Array.from(document.querySelectorAll(".juego-sopa .b-sopa"));
    botones.forEach(boton => {
      boton.textContent = "";
      boton.style.backgroundColor = "";
      boton.disabled = false;
    });
    respuesta.data.forEach(({ letra, x, y }) => {
      const indice = (y - 1) * TAMANO_TABLERO + (x - 1);
      botones[indice].textContent = letra;
      botones[indice].dataset.indice = indice;
    });
  } catch (error) {
    console.error("Error al cargar las letras:", error);
  }
}
// Función para cargar las posiciones correctas de las palabras
async function cargarPosicionesCorrectas(idSopa) {
  casillasCorrectas.clear();
  try {
    const respuesta = await read(`
      SELECT coordenadaX_start AS xInicio,
             coordenadaY_start AS yInicio,
             coordenadaX_end   AS xFin,
             coordenadaY_end   AS yFin
      FROM Sopa_Lletres_Paraula
      WHERE id_sopa = ${idSopa};
    `);

    respuesta.data.forEach(({ xInicio, yInicio, xFin, yFin }) => {
      const deltaX = xFin - xInicio;
      const deltaY = yFin - yInicio;
      const pasos = Math.max(Math.abs(deltaX), Math.abs(deltaY));
      const pasoX = deltaX === 0 ? 0 : deltaX / Math.abs(deltaX);
      const pasoY = deltaY === 0 ? 0 : deltaY / Math.abs(deltaY);

      for (let k = 0; k <= pasos; k++) {
        const x = xInicio + pasoX * k;
        const y = yInicio + pasoY * k;
        casillasCorrectas.add((y - 1) * TAMANO_TABLERO + (x - 1));
      }
    });
  } catch (error) {
    console.error("Error al cargar las posiciones correctas:", error);
  }
}

// Función para actualizar el cronómetro
function actualizarCronometro() {
  const tiempoUsado = Math.floor((Date.now() - tiempoInicio) / 1000);
  const tiempoRestante = Math.max(0, 300 - tiempoUsado); // 5 minutos = 300 segundos
  const minutos = String(Math.floor(tiempoRestante / 60)).padStart(2, "0");
  const segundos = String(tiempoRestante % 60).padStart(2, "0");
  document.getElementById("input-tiempo").value = `${minutos}:${segundos}`;
}

// Función que se ejecuta al pulsar una casilla
function alPulsarCasilla(evento) {
  const boton = evento.currentTarget;
  const indice = +boton.dataset.indice;
  if (casillasSeleccionadas.has(indice)) return;

  casillasSeleccionadas.add(indice);
  boton.style.backgroundColor = casillasCorrectas.has(indice) ? colorCorrecto : colorIncorrecto;

  verificarPalabras();
}

// Función para verificar y tachar palabras encontradas
const style = document.createElement("style");
style.textContent = `
  .tachada {
    text-decoration: line-through;
    opacity: 0.6;
    color: #f1c40f;
  }
`;
document.head.appendChild(style);

function verificarPalabras() {
  document.querySelectorAll(".listado-palabras li").forEach(elemento => {
    const palabra = elemento.dataset.palabra;
    const posiciones = palabrasYPosiciones[palabra] || [];
    const encontrada = posiciones.every(pos => casillasSeleccionadas.has(pos));
    elemento.classList.toggle("tachada", encontrada);
  });
}

// Función para finalizar el juego
async function finalizarJuego() {
  if (juegoFinalizado) return;
  juegoFinalizado = true;
  const btnFin = document.querySelector("#fin button");
  btnFin.disabled = true;

  clearInterval(temporizador);
  document.querySelectorAll(".juego-sopa .b-sopa").forEach(boton => boton.disabled = true);

  const tiempoUsado = Math.floor((Date.now() - tiempoInicio) / 1000);
  const tiempoRestante = Math.max(0, 300 - tiempoUsado);
  const minutos = String(Math.floor(tiempoRestante / 60)).padStart(2, "0");
  const segundos = String(tiempoRestante % 60).padStart(2, "0");
  document.getElementById("input-tiempo").value = `${minutos}:${segundos}`;

  const aciertos = [...casillasCorrectas].filter(pos => casillasSeleccionadas.has(pos)).length;
  const juegoCompleto = aciertos === casillasCorrectas.size;

  let puntos = 0;
  if (juegoCompleto) {
    const pesoReal = pesNivel / 10;
    puntos = Math.round(tiempoRestante * pesoReal);
    puntos = Math.max(0, puntos);
    document.getElementById("input-resultado")
            .value = `+ ${puntos} pts`;
  } else {
    document.getElementById("input-resultado")
            .value = "0 pts";
  }

// Guardar en BD
const idUsuario = localStorage.getItem("id_usuari");
const idSopa = document.getElementById("tipoSopa").value;
if (!idUsuario || !idSopa) return;

let existe = false;
let puntosViejos = 0;
try {
  const res = await read(`
    SELECT punts
      FROM Sopa_Lletres_Usuari
     WHERE id_usuari = ${idUsuario}
       AND id_sopa   = ${idSopa};
  `);
  if (res.data.length) {
    existe = true;
    puntosViejos = Number(res.data[0].punts);
  }
} catch (e) {
  console.error("Error leyendo puntos viejos:", e);
}

if (!existe) {
  const sql = `
    INSERT INTO Sopa_Lletres_Usuari (id_usuari, id_sopa, punts)
    VALUES (${idUsuario}, ${idSopa}, ${puntos});
  `.trim();
  console.log("INSERT puntos:", sql);
  try {
    await createSilent(sql);
  } catch (e) {
    console.error("Error INSERT puntos:", e);
  }

} else if (puntos > puntosViejos) {
  const sql = `
    UPDATE Sopa_Lletres_Usuari
       SET punts = ${puntos}
     WHERE id_usuari = ${idUsuario}
       AND id_sopa   = ${idSopa};
  `.trim();
  console.log("UPDATE puntos:", sql);
  try {
    await createSilent(sql);
  } catch (e) {
    console.error("Error UPDATE puntos:", e);
  }

} else {
  console.log(
    `No actualizo: puntos viejos=${puntosViejos} ≥ nuevos=${puntos}`
  );
}
}

