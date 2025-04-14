// Modo daltonico
document.addEventListener("DOMContentLoaded", () => {
    const daltonic = localStorage.getItem("modo_daltonico");
    if (daltonic === "true") {
        document.body.classList.add("daltonic-mode");
    }
});
