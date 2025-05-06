document.addEventListener("DOMContentLoaded", async () => {
  /* Color */
  // Variables
  let colorCorrecto;
  let colorIncorrecto;

  // Funcions

  function guardaColors() {
    colorCorrecto = document.querySelector("#colorCorrecto").value;
    colorIncorrecto = document.querySelector("#colorIncorrecto").value;

    localStorage.setItem("colorCorrecto", colorCorrecto);
    localStorage.setItem("colorIncorrecto", colorIncorrecto);

    return { colorCorrecto, colorIncorrecto };
  }

  function recuperaColors() {
    colorCorrecto = localStorage.getItem("colorCorrecto") || "#02fc18";
    colorIncorrecto = localStorage.getItem("colorIncorrecto") || "#fc2b02";
  }

  // Insertar en la tabla color
  async function insertarUsuarioColors() {
    recuperaColors();
    const id_usuari = localStorage.getItem("id_usuari");
    if (!id_usuari) {
      console.error("Usuario no autenticado");
      return;
    }
    const colores = [
      { id_color: 1, valor: colorCorrecto },
      { id_color: 2, valor: colorIncorrecto }
    ];
    for (const color of colores) {
      const query = `
        INSERT INTO Usuari_Color (id_usuari, id_color, valor)
        VALUES ('${id_usuari}', '${color.id_color}', '${color.valor}')
        ON DUPLICATE KEY UPDATE valor = VALUES(valor);
      `;
      await create(query);
    }
  }

  async function updateColores() {
    recuperaColors();
    const id_usuari = localStorage.getItem("id_usuari");
    if (!id_usuari) {
      console.error("Usuario no autenticado");
      return;
    }
    const colores = [
      { id_color: 1, valor: colorCorrecto },
      { id_color: 2, valor: colorIncorrecto }
    ];
    for (const { id_color, valor } of colores) {
      const query = `
        UPDATE Usuari_Color
        SET valor = '${valor}'
        WHERE id_usuari = '${id_usuari}' AND id_color = '${id_color}';
      `;
      await update(query);
    }
  }

  async function confirmarPreferencias(e) {
    e.preventDefault();
    guardaColors();
    recuperaColors();
    const id_usuari = localStorage.getItem("id_usuari");
    if (!id_usuari) {
      alert("Debes iniciar sesión para guardar la configuración.");
      return;
    }
    try {
      const result = await read(
        `SELECT COUNT(*) AS total FROM Usuari_Color WHERE id_usuari='${id_usuari}'`
      );
      if (result.data?.[0].total > 0) {
        await updateColores();
      } else {
        await insertarUsuarioColors();
      }
    } catch (error) {
      console.error("Error al confirmar preferencias:", error);
      alert("Error al confirmar las preferencias del usuario.");
    }
  }

  // Botón confirmar
  const botonConfirmar = document.querySelector("#confirmar");
  if (botonConfirmar) {
    botonConfirmar.addEventListener("click", confirmarPreferencias);
  }

  // Cargar colores guardados
  async function cargarColores() {
    const id_usuari = localStorage.getItem("id_usuari");
    if (!id_usuari) {
      console.error("Usuario no autenticado");
      return;
    }
    try {
      const result = await read(
        `SELECT id_color, valor FROM Usuari_Color WHERE id_usuari='${id_usuari}'`
      );
      if (!result.data || !result.data.length) return;
      result.data.forEach(({ id_color, valor }) => {
        const selector = id_color === 1
          ? "#colorCorrecto"
          : id_color === 2
          ? "#colorIncorrecto"
          : null;
        if (selector) document.querySelector(selector).value = valor;
      });
    } catch (error) {
      console.error("Error al cargar los colores:", error);
    }
  }

  await cargarColores();

  /* Sonido */
  const audioEl = document.getElementById("audio");
  const volSlider = document.getElementById("nivelSonidoGeneral");
  if (audioEl && volSlider) {
    volSlider.value = 5;
    audioEl.volume = 0.5;
    volSlider.addEventListener("input", () => {
      audioEl.volume = volSlider.value / 10;
    });
  }

  /* Tamaño letra */
  const textSlider = document.getElementById("nivelLetras");
  if (textSlider) {
    const base = 100, paso = 5;
    textSlider.value = 0;
    document.documentElement.style.fontSize = `${base}%`;
    textSlider.addEventListener("input", () => {
      document.documentElement.style.fontSize =
        `${base + paso * parseInt(textSlider.value, 10)}%`;
    });
  }

  /* Modo Daltonico */
  const daltonicCheckbox = document.querySelector(
    ".modo input[type='checkbox']"
  );
  if (daltonicCheckbox) {
    const modo = localStorage.getItem("modo_daltonico") === "true";
    document.body.classList.toggle("modo-daltonico", modo);
    daltonicCheckbox.checked = modo;
    daltonicCheckbox.addEventListener("change", () => {
      const activado = daltonicCheckbox.checked;
      localStorage.setItem("modo_daltonico", activado);
      document.body.classList.toggle("modo-daltonico", activado);
    });
  }

});