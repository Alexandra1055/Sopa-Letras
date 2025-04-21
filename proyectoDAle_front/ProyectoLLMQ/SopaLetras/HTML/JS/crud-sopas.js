/* CRUD SOPAS DE LETRAS */
// crud-sopas.js
const posicionesPalabras = [];
let palabraSeleccionada = null;
let inicioSeleccionado = null;

const TAM_TABLERO = 10;
const ABECEDARIO = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

document.addEventListener("DOMContentLoaded", () => {
  inicializarInputs();
  inicializarTablero();
  inicializarTeclado();
  document.getElementById("btn-posicionar").addEventListener("click", toggleModoPosicion);
  document.getElementById("btn-autocompletar").addEventListener("click", autocompletar);
  document.getElementById("btn-reset").addEventListener("click", reiniciarTablero);
  document.getElementById("btn-guardar").addEventListener("click", guardarSopa);
});

function inicializarInputs() {
  document.querySelectorAll(".palabras-alta-sopa input").forEach(input => {
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
  document.querySelectorAll(".palabras-alta-sopa input.selected-input")
          .forEach(i => i.classList.remove("selected-input"));
  alert(
    modo
      ? "Modo POSICIONAR: haz clic en el input de la palabra, luego en la casilla de inicio y luego en la de fin."
      : "Has salido del modo posicionar"
  );
}

function onClickCelda(e) {
  if (!document.body.classList.contains("modo-posicion")) return;
  const cel = e.currentTarget;

  if (!palabraSeleccionada) {
    alert("Primero haz clic en el input de la palabra que quieres colocar.");
    return;
  }
  if (!inicioSeleccionado) {
    inicioSeleccionado = getCoords(cel);
    cel.classList.add("endpoint-selected");
    return;
  }

  // fin seleccionado
  const fin = getCoords(cel);
  colocarPalabra(palabraSeleccionada, inicioSeleccionado, fin);
  document.querySelectorAll(".tablero-sopa .b-tsopa.endpoint-selected")
          .forEach(c => c.classList.remove("endpoint-selected"));
  palabraSeleccionada.classList.remove("selected-input");
  palabraSeleccionada = null;
  inicioSeleccionado = null;
}

function onClickLetra() {
  if (document.body.classList.contains("modo-posicion")) return;
  if (!inicioSeleccionado) {
    alert("Selecciona primero una casilla");
  }
}

function colocarPalabra(inputElem, start, end) {
  const palabra = inputElem.value.trim().toUpperCase().split("");
  const L       = palabra.length;
  const dx      = Math.sign(end[0] - start[0]);
  const dy      = Math.sign(end[1] - start[1]);

  if (
    Math.max(
      Math.abs(end[0] - start[0]),
      Math.abs(end[1] - start[1])
    ) !==
    L - 1
  ) {
    alert("El tramo elegido no coincide con la longitud de la palabra.");
    return;
  }

  for (let k = 0; k < L; k++) {
    const x   = start[0] + dx * k;
    const y   = start[1] + dy * k;
    if (x < 1 || x > TAM_TABLERO || y < 1 || y > TAM_TABLERO) {
      alert("Fuera de tablero");
      return;
    }
    const idx  = (y - 1) * TAM_TABLERO + (x - 1);
    const cell = document.querySelectorAll(".tablero-sopa .b-tsopa")[idx];
    cell.textContent = palabra[k];
  }
}

function getCoords(celda) {
  const arr = Array.from(document.querySelectorAll(".tablero-sopa .b-tsopa"));
  const i   = arr.indexOf(celda);
  return [(i % TAM_TABLERO) + 1, Math.floor(i / TAM_TABLERO) + 1];
}

function autocompletar() {
  document.querySelectorAll(".tablero-sopa .b-tsopa").forEach(c => {
    if (!c.textContent.trim()) {
      c.textContent = ABECEDARIO[
        Math.floor(Math.random() * ABECEDARIO.length)
      ];
    }
  });
}

function reiniciarTablero() {
  document.querySelectorAll(".tablero-sopa .b-tsopa").forEach(c => {
    c.textContent = "";
    c.classList.remove("endpoint-selected");
  });
}

async function guardarSopa(e) {
  e.preventDefault();

  // comprueba admin logueado
  const admin = Number(localStorage.getItem("id_admin"));
  if (!admin) {
    alert("Error: no se ha detectado tu sesión de administrador.");
    return;
  }

  // datos iniciales
  const dificultad = document.querySelector(
    "input[name='dificultat']:checked"
  ).value;
  const nivel = { facil:1, intermedio:2, dificil:3 }[dificultad];
  const estado = 'no';

  // crear sopa
  await create(`
    INSERT INTO Sopa_Lletres (nom, estat, id_nivell, id_admin)
    VALUES ('', '${estado}', ${nivel}, ${admin});
  `);
  const { data:[{ id_sopa }] } = await read(
    `SELECT LAST_INSERT_ID() AS id_sopa;`
  );

  // actualizar nombre
  const primera = document.getElementById("palabra1").value
                    .trim().toUpperCase();
  const nombre = `${id_sopa}_${primera}_${admin}`;
  await update(`
    UPDATE Sopa_Lletres
    SET nom='${nombre}'
    WHERE id_sopa=${id_sopa};
  `);

  // insertar palabras + coordenadas
  for (const p of posicionesPalabras) {
    await create(`INSERT IGNORE INTO Paraula (nom) VALUES ('${p.palabra}');`);
    const { data:[{ id_paraula }] } = await read(`
      SELECT id_paraula FROM Paraula WHERE nom='${p.palabra}';
    `);
    await create(`
      INSERT INTO Sopa_Lletres_Paraula
        (id_sopa, id_paraula,
         coordenadaX_start, coordenadaY_start,
         coordenadaX_end,   coordenadaY_end)
      VALUES
        (${id_sopa}, ${id_paraula},
         ${p.inicio.x}, ${p.inicio.y},
         ${p.fin.x},    ${p.fin.y});
    `);
  }

  // insertar letras del tablero
  const mapaLetras = {};
  document.querySelectorAll(".tablero-sopa .b-tsopa").forEach(c => {
    const l = c.textContent.trim() || ABECEDARIO[
      Math.floor(Math.random() * ABECEDARIO.length)
    ];
    mapaLetras[l] = null;
  });
  for (const l of Object.keys(mapaLetras)) {
    await create(`INSERT IGNORE INTO Lletra (caracter) VALUES ('${l}');`);
    const { data:[{ id_lletra }] } = await read(`
      SELECT id_lletra FROM Lletra WHERE caracter='${l}';
    `);
    mapaLetras[l] = id_lletra;
  }
  document.querySelectorAll(".tablero-sopa .b-tsopa").forEach(
    async (c, idx) => {
      const l = c.textContent.trim() || ABECEDARIO[
        Math.floor(Math.random() * ABECEDARIO.length)
      ];
      const x = (idx % TAM_TABLERO) + 1;
      const y = Math.floor(idx / TAM_TABLERO) + 1;
      const id_l = mapaLetras[l];
      await create(`
        INSERT INTO Sopa_Lletres_Lletra
          (id_sopa, id_lletra, posicioX, posicioY)
        VALUES (${id_sopa}, ${id_l}, ${x}, ${y});
      `);
    }
  );

  alert(`¡Sopa guardada con id ${id_sopa}!`);
}


/* Consultar sopa: Consulta_sopas */


/* Eliminar sopa: Baja_sopas */


