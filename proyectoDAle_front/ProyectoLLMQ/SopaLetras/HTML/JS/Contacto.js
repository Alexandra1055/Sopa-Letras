/* Contacto */
document.addEventListener("DOMContentLoaded", () => {
    const formContacto = document.querySelector("form");
    if (formContacto) {
        formContacto.addEventListener("submit", async (event) => {
            event.preventDefault(); // Evitar envío predeterminado
            await procesarContacto();
        });
    }
});

function obtenerDatosContacto() {
    const nickusuari = document.querySelector("#nick").value;
    const email = document.querySelector("#correo").value;
    const tipoconsulta = document.querySelector("#consultas").value;
    const descripcio = document.querySelector("#descripcioConsulta").value;

    return {
        nickusuari,
        email,
        tipoconsulta,
        descripcio,
    };
}

async function verificarUsuario(nickusuari) {
    try {
        const query = `SELECT id_usuari FROM Usuari WHERE nickusuari = '${nickusuari}'`;
        const result = await read(query);
        console.log("Resultado de verificarUsuario:", result); // Depuración
        if (result && result.data && result.data.length > 0) {
            console.log("Usuario encontrado:", result.data[0]);
            return result.data[0].id_usuari;
        } else {
            console.log("No se encontró el usuario con nickname:", nickusuari);
            return null;
        }
    } catch (error) {
        console.error("Error al verificar el usuario:", error);
        return null;
    }
}

async function insertarConsulta(id_usuari, datos) {
    const query = `INSERT INTO Consulta (id_usuari, email, tipoconsulta, descripcio) 
                   VALUES ('${id_usuari}', '${datos.email}', '${datos.tipoconsulta}', '${datos.descripcio}')`;
    try {
        const result = await create(query);
        console.log("Resultado de insertarConsulta:", result); // Depuración
        return result;
    } catch (error) {
        console.error("Error al insertar la consulta:", error);
        throw new Error("Error al insertar la consulta en la base de datos");
    }
}

async function procesarContacto() {
    try {
        const datos = obtenerDatosContacto();
        console.log("Datos del formulario:", datos); // Depuración
        const id_usuari = await verificarUsuario(datos.nickusuari);

        if (!id_usuari) {
            alert("El usuario con el nickname proporcionado no existe. Por favor, regístrate primero.");
            return; // Detener el flujo
        }

        await insertarConsulta(id_usuari, datos);
        alert("Se ha enviado la consulta correctamente.");
        document.querySelector("form").reset(); // Limpiar el formulario
    } catch (error) {
        console.error("Error al procesar la consulta:", error);
        alert("Error al enviar la consulta: " + error.message);
    }
}