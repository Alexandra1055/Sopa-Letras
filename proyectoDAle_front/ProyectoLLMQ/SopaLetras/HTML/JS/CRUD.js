/* Create */
async function create(query) {
    return await ejecutarQuery(query, "Se ha creado con exito el registro", "Error al crear el registro");
  }
/* Read */
async function read(query) {
    return await ejecutarQuery(query, null, "Error al leer los datos");
  }
/* Update */
async function update(query) {
    return await ejecutarQuery(query, "Se ha actualizado con exito", "Error al actualizar el registro");
  }
/* Delete */
async function remove(query) {
    return await ejecutarQuery(query, "Se ha eliminado con exito", "Error al eliminar el registro");
  }

/* Ejecutar la Query */
async function ejecutarQuery(query, mensajeExito, mensajeError) {
    try {
      const respuesta = await fetch(`http://localhost:3000/daw/${encodeURIComponent(query)}`);
      const data = await respuesta.json();
      console.log("Respuesta del servidor: ", data);
      if (mensajeExito) 
        alert(mensajeExito);
      return data;
    } catch (error) {
      console.error("Error en la operación: ", error);
      alert(mensajeError || "Error en la operación");
    }
  }