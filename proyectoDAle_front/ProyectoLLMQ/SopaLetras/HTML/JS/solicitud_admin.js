/* Solicitud Administrador */
document.addEventListener("DOMContentLoaded", () => {
    const formSolicitud = document.querySelector("form[action='procesar_solicitudAdmin.php']");
    if (formSolicitud) {
        formSolicitud.addEventListener("submit", async (event) => {
            event.preventDefault();
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
    const query = `SELECT id_usuari FROM Usuari WHERE nickusuari = '${nickusuari}'`;
    const result = await read(query);
    return result && result.data && result.data.length > 0 ? result.data[0].id_usuari : null;
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

        if (id_usuari) {
            await insertarSolicitudAdmin(id_usuari, datos);
            alert("Se ha enviado la solicitud de administrador correctamente.");
            formSolicitud.reset(); // Limpiar el formulario
        } else {
            alert("El usuario con el nickname proporcionado no existe. Por favor, regístrate primero.");
        }
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        alert("Error al enviar la solicitud. Inténtalo de nuevo.");
    }
}