<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    if (isset($_POST["sopascategorias"])) {
        $categoriaSeleccionada = $_POST["sopascategorias"];
        echo "Categoría y nivel seleccionados: " . htmlspecialchars($categoriaSeleccionada) . "<br>";
    } else {
        echo "No se ha seleccionado ninguna categoría.<br>";
    }
}
?>

