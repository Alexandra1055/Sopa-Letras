/* Delete sopa: baja-sopas */
const contenedorForm = document.querySelector(".formulario-eliminar-sopas form");
const btnEliminar     = document.querySelector(".formulario button[type=submit]");

document.addEventListener("DOMContentLoaded", () => {
  cargarSopasBaja();
  btnEliminar.addEventListener("click", onEliminar);
});

// Carga las sopas y crea un <div> con checkbox
async function cargarSopasBaja() {
  try {
    const { data } = await read("SELECT id_sopa, nom FROM Sopa_Lletres");
    contenedorForm.innerHTML = `<h4>Sopas:</h4>`;
    data.forEach(({ id_sopa, nom }) => {
      const div = document.createElement("div");
      const cb  = document.createElement("input");
      const lbl = document.createElement("label");

      cb.type  = "checkbox";
      cb.id    = `del-${id_sopa}`;
      cb.name  = "sopas";
      cb.value = id_sopa;

      lbl.htmlFor   = cb.id;
      lbl.textContent = nom;

      div.appendChild(cb);
      div.appendChild(lbl);
      contenedorForm.appendChild(div);
    });
  } catch (e) {
    console.error("Error cargando sopas para baja:", e);
    alert("No se pudieron cargar las sopas.");
  }
}

// Borra la sopa seleccionada
async function onEliminar(evt) {
  evt.preventDefault();
  const seleccionadas = Array.from(
    document.querySelectorAll('input[name="sopas"]:checked')
  ).map(cb => cb.value);

  if (seleccionadas.length === 0) {
    return alert("Selecciona al menos una sopa a eliminar.");
  }
  if (!confirm(`¿Eliminarás ${seleccionadas.length} sopa(s)? Esta acción es irreversible.`)) {
    return;
  }

  const listaSopas = seleccionadas.join(",");

  try {
    //Recuperar los id_paraula asociados a estas sopas ---
    const respPal = await read(`
      SELECT DISTINCT id_paraula
      FROM Sopa_Lletres_Paraula
      WHERE id_sopa IN (${listaSopas});
    `);
    const idsPalabras = respPal.data.map(r => r.id_paraula);
    const listaPalabras = idsPalabras.length ? idsPalabras.join(",") : null;

    // Eliminar letras de la sopa
    await createSilent(`
      DELETE FROM Sopa_Lletres_Lletra
      WHERE id_sopa IN (${listaSopas});
    `);
    // Eliminar posiciones de palabras
    await createSilent(`
      DELETE FROM Sopa_Lletres_Paraula
      WHERE id_sopa IN (${listaSopas});
    `);
    // Eliminar la propia sopa
    await createSilent(`
      DELETE FROM Sopa_Lletres
      WHERE id_sopa IN (${listaSopas});
    `);

    // Eliminar palabras sin sopa
    if (listaPalabras) {
      await createSilent(`
        DELETE FROM Paraula
        WHERE id_paraula IN (${listaPalabras});
      `);
    }

    alert("Sopas y sus palabras relacionadas eliminadas correctamente.");
    await cargarSopasBaja();
  } catch (e) {
    console.error("Error al eliminar sopas y palabras:", e);
    alert("Error al intentar eliminar las sopas y sus palabras.");
  }
}
