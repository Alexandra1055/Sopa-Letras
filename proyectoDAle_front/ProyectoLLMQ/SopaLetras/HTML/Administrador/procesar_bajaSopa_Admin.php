<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    if (isset($_POST["categoria"])) {
        $categorias = $_POST["categoria"];
        echo "Categorías seleccionadas: " . htmlspecialchars(implode(", ", $categorias)) . "<br>";
    } else {
        echo "No se seleccionó ninguna categoría.<br>";
    }
}
?>
