<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $idioma = $_POST["idioma"];
    echo "El idioma seleccionado es: " . htmlspecialchars($idioma) . "<br>";

    $nivelSonidoGeneral = $_POST["nivelSonidoGeneral"];
    echo "El nivel de sonido general es: " . htmlspecialchars($nivelSonidoGeneral) . "<br>";

    $nivelSonidoAlertas = $_POST["nivelSonidoAlertas"];
    echo "El nivel de efectos es: " . htmlspecialchars($nivelSonidoAlertas) . "<br>";

    $nivelLetras = $_POST["nivelLetras"];
    echo "El tamaño de las letras es: " . htmlspecialchars($nivelLetras) . "<br>";

    $colorCorrecto = $_POST["colorCorrecto"];
    echo "El color para letras correctas es: " . htmlspecialchars($colorCorrecto) . "<br>";

    $colorIncorrecto = $_POST["colorIncorrecto"];
    echo "El color para letras incorrectas es: " . htmlspecialchars($colorIncorrecto) . "<br>";

    $modoDaltónico = isset($_POST["modoDaltónico"]) ? "Activado" : "Desactivado";
    echo "Modo daltónico: " . htmlspecialchars($modoDaltónico) . "<br>";

    $idConfiguracion = $_POST["id_configuracion"];
    echo "ID de la configuración: " . htmlspecialchars($idConfiguracion) . "<br>";
}
?>
