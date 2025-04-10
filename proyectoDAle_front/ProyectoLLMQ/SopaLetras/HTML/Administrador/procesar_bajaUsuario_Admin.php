<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    if (isset($_POST["usuarios"])) {
        $usuariosSeleccionados = $_POST["usuarios"];
        echo "Usuarios seleccionados para eliminar: " . htmlspecialchars(implode(", ", $usuariosSeleccionados)) . "<br>";
    } else {
        echo "No se ha seleccionado ningún usuario.<br>";
    }
}
?>
