/* Create */
async function create(query) {
  return await ejecutarQuery(query, "Se ha creado con éxito el registro", "Error al crear el registro");
}

/* Read */
async function read(query) {
  return await ejecutarQuery(query, null, "Error al leer los datos");
}

/* Update */
async function update(query) {
  return await ejecutarQuery(query, "Se ha actualizado con éxito", "Error al actualizar el registro");
}

/* Delete */
async function remove(query) {
  return await ejecutarQuery(query, "Se ha eliminado con éxito", "Error al eliminar el registro");
}

/* Ejecutar la Query */
async function ejecutarQuery(query, mensajeExito, mensajeError) {
  try {
    const respuesta = await fetch(`http://localhost:3000/daw/${encodeURIComponent(query)}`);
    const data = await respuesta.json();
    console.log("Respuesta del servidor: ", data);
    if (respuesta.ok && data) {
      if (mensajeExito) {
        alert(mensajeExito);
      }
      return data;
    } else {
      throw new Error(data.error || mensajeError || "Error en la operación");
    }
  } catch (error) {
    console.error("Error en la operación: ", error);
    throw new Error(mensajeError || "Error en la operación");
  }
}