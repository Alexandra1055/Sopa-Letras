<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $categoria_nivel = $_POST["usuarios"];
    
    switch ($categoria_nivel) {
        case "animalesP":
            echo "Categoría seleccionada: Animales - Nivel: Principiante";
            break;
        case "animalesI":
            echo "Categoría seleccionada: Animales - Nivel: Intermedio";
            break;
        case "animalesE":
            echo "Categoría seleccionada: Animales - Nivel: Experto";
            break;
        case "profesionesP":
            echo "Categoría seleccionada: Profesiones - Nivel: Principiante";
            break;
        case "profesionesI":
            echo "Categoría seleccionada: Profesiones - Nivel: Intermedio";
            break;
        case "profesionesE":
            echo "Categoría seleccionada: Profesiones - Nivel: Experto";
            break;
        case "peliculasP":
            echo "Categoría seleccionada: Películas - Nivel: Principiante";
            break;
        case "peliculasI":
            echo "Categoría seleccionada: Películas - Nivel: Intermedio";
            break;
        case "peliculasE":
            echo "Categoría seleccionada: Películas - Nivel: Experto";
            break;
        case "arteP":
            echo "Categoría seleccionada: Arte - Nivel: Principiante";
            break;
        case "arteI":
            echo "Categoría seleccionada: Arte - Nivel: Intermedio";
            break;
        case "arteE":
            echo "Categoría seleccionada: Arte - Nivel: Experto";
            break;
        case "musicaP":
            echo "Categoría seleccionada: Música - Nivel: Principiante";
            break;
        case "musicaI":
            echo "Categoría seleccionada: Música - Nivel: Intermedio";
            break;
        case "musicaE":
            echo "Categoría seleccionada: Música - Nivel: Experto";
            break;
        case "comidaP":
            echo "Categoría seleccionada: Comida - Nivel: Principiante";
            break;
        case "comidaI":
            echo "Categoría seleccionada: Comida - Nivel: Intermedio";
            break;
        case "comidaE":
            echo "Categoría seleccionada: Comida - Nivel: Experto";
            break;
        case "infantilP":
            echo "Categoría seleccionada: Infantil - Nivel: Principiante";
            break;
        case "infantilI":
            echo "Categoría seleccionada: Infantil - Nivel: Intermedio";
            break;
        case "infantilE":
            echo "Categoría seleccionada: Infantil - Nivel: Experto";
            break;
        case "eventosEspeciales":
            echo "Categoría seleccionada: Eventos Especiales";
            break;
        default:
            echo "No se ha seleccionado ninguna categoría válida.";
            break;
    }

    echo "<br>";

    $tiempo = $_POST["tiempo"]; 
    echo "Tiempo: " . ($tiempo ? $tiempo : "No disponible");

    echo "<br>";

    $resultado = $_POST["resultado"]; 
    echo "Resultado: " . ($resultado ? $resultado : "No disponible");
}
?>
