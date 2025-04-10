<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
    $nombresopa = $_POST["nombresopa"];
    echo "El nombre de la sopa de letras introducido es: " . htmlspecialchars($nombresopa);
    echo "<br>";

    $categoria = $_POST["categoria"];
    if (in_array("Catálogo", $categoria)) {
        $categoria_existe = $_POST["categoria_existe"];
        echo "La categoría existente seleccionada es: " . htmlspecialchars($categoria_existe);
        echo "<br>";
    } else {
        $nombrecategoria = $_POST["nombrecategoria"];
        echo "El nombre de la categoría nueva es: " . htmlspecialchars($nombrecategoria);
        echo "<br>";
    }

    $dificultad = $_POST["dificultad"];
    echo "La dificultad seleccionada es: " . htmlspecialchars($dificultad[0]);
    echo "<br>";

  
    for ($i = 1; $i <= 10; $i++) {
        $palabra = $_POST["palabra" . $i];
        echo "Palabra " . $i . ": " . htmlspecialchars($palabra);
        echo "<br>";
    }

    if (isset($_POST["letras"])) {
        $letras = $_POST["letras"];
        echo "Las letras seleccionadas son: ";
        foreach ($letras as $letra) {
            echo htmlspecialchars($letra) . " ";
        }
        echo "<br>";
    }
}
?>