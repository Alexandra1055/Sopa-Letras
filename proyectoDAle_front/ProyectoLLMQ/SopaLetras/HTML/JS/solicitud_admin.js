/* Solicitud Administrador */
document.addEventListener("DOMContentLoaded", () => {
    const formSolicitud = document.querySelector("form");
    if (formSolicitud) {
        formSolicitud.addEventListener("submit", async (event) => {
            event.preventDefault(); // Evitar cualquier envío predeterminado
            await procesarSolicitudAdmin();
        });
    }
});

function obtenerDatosSolicitud() {
    const nickusuari = document.querySelector("#nick").value;
    const nom = document.querySelector("#nombre").value;
    const llin1 = document.querySelector("#lli1").value;
    const llin2 = document.querySelector("#lli2").value || null; // Puede ser opcional
    const email = document.querySelector("#correo").value;
    const data_naixament = document.querySelector("#fechanacimiento").value;
    const descripcio = document.querySelector("#descripcioConsulta").value;

    return {
        nickusuari,
        nom,
        llin1,
        llin2,
        email,
        data_naixament,
        descripcio,
    };
}

async function verificarUsuario(nickusuari) {
    try {
        const query = `SELECT id_usuari FROM Usuari WHERE nickusuari = '${nickusuari}'`;
        const result = await read(query);
        if (result && result.data && result.data.length > 0) {
            return result.data[0].id_usuari;
        }
        return null;
    } catch (error) {
        console.error("Error al verificar el usuario:", error);
        return null;
    }
}

async function insertarSolicitudAdmin(id_usuari, datos) {
    const query = `INSERT INTO Solicitud_Admin (id_usuari, nom, llin1, llin2, email, data_naixament, descripcio) 
                   VALUES ('${id_usuari}', '${datos.nom}', '${datos.llin1}', ${datos.llin2 ? `'${datos.llin2}'` : 'NULL'}, 
                           '${datos.email}', '${datos.data_naixament}', '${datos.descripcio}')`;
    await create(query);
}

async function procesarSolicitudAdmin() {
    try {
        const datos = obtenerDatosSolicitud();
        const id_usuari = await verificarUsuario(datos.nickusuari);

        if (!id_usuari) {
            alert("El usuario con el nickname proporcionado no existe. Por favor, regístrate primero.");
            return; // Detener el flujo aquí
        }

        await insertarSolicitudAdmin(id_usuari, datos);
        alert("Se ha enviado la solicitud de administrador correctamente.");
        document.querySelector("form").reset(); // Limpiar el formulario
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        alert("Error al enviar la solicitud. Inténtalo de nuevo.");
    }
}