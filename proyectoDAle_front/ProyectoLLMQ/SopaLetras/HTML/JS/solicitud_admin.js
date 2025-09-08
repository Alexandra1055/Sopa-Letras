/* Solicitud Administrador */
document.addEventListener("DOMContentLoaded", () => {
    const formSolicitud = document.querySelector("form");
    

    if (formSolicitud) {
        // Manejar el envío del formulario
        formSolicitud.addEventListener("submit", (event) => {
            event.preventDefault(); // Evitar envío predeterminado
            // Mostrar alert de éxito
            alert("Solicitud enviada correctamente. Dentro de poco recibirás un correo.");
            // Limpiar el formulario
            formSolicitud.reset();
        });
    }
});