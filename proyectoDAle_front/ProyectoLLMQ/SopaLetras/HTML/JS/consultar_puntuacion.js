/* Consultar Puntuación */
document.addEventListener("DOMContentLoaded", async () => {
    await cargarPuntuaciones();
});

async function cargarPuntuaciones() {
    try {
        const id_usuari = localStorage.getItem("id_usuari");
        const nickusuari = localStorage.getItem("nickusuari");

        if (!id_usuari || !nickusuari) {
            alert("Debes iniciar sesión para ver tus puntuaciones.");
            window.location.href = "./wordSearch.html";
            return;
        }

        const query = `SELECT id_sopa, puntuacion, dificultat FROM Puntuacion WHERE id_usuari = '${id_usuari}' ORDER BY dificultat, id_sopa`;
        const result = await read(query);
        console.log("Resultado de la consulta de puntuaciones:", result); // Depuración

        const puntuacionDiv = document.querySelector(".puntuacion");
        puntuacionDiv.innerHTML = ""; // Limpiar contenido estático

        if (result && result.data && result.data.length > 0) {
            // Organizar puntuaciones por dificultad
            const puntuacionesPorDificultad = {
                "Fácil": [],
                "Intermedio": [],
                "Difícil": [],
            };

            result.data.forEach((puntuacion) => {
                puntuacionesPorDificultad[puntuacion.dificultat].push({
                    id_sopa: puntuacion.id_sopa,
                    puntuacion: puntuacion.puntuacion,
                });
            });

            // Generar HTML dinámico
            const ul = document.createElement("ul");
            for (const dificultat in puntuacionesPorDificultad) {
                if (puntuacionesPorDificultad[dificultat].length > 0) {
                    const liDificultad = document.createElement("li");
                    const divDificultad = document.createElement("div");
                    divDificultad.className = "dificultat";
                    divDificultad.textContent = `Nivel ${dificultat}:`;
                    liDificultad.appendChild(divDificultad);

                    const ulSopas = document.createElement("ul");
                    puntuacionesPorDificultad[dificultat].forEach((puntuacion) => {
                        const liSopa = document.createElement("li");
                        liSopa.textContent = `${puntuacion.id_sopa}: ${puntuacion.puntuacion}`;
                        ulSopas.appendChild(liSopa);
                    });

                    liDificultad.appendChild(ulSopas);
                    ul.appendChild(liDificultad);
                }
            }

            puntuacionDiv.appendChild(ul);
        } else {
            puntuacionDiv.innerHTML = "<p>No tienes puntuaciones registradas.</p>";
        }
    } catch (error) {
        console.error("Error al cargar las puntuaciones:", error);
        alert("Error al cargar las puntuaciones. Inténtalo de nuevo.");
    }
}