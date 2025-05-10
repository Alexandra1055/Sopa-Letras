/* Contacto Formulario */
document.addEventListener("DOMContentLoaded", () => {
    const formContacto = document.querySelector("form");

    if (formContacto) {
        // Manejar el envío del formulario
        formContacto.addEventListener("submit", (event) => {
            event.preventDefault(); // Evitar envío predeterminado
            // Mostrar alert de éxito
            alert("Solicitud enviada correctamente. Dentro de poco recibirás un correo.");
            // Limpiar el formulario
            formContacto.reset();
        });
    }
});