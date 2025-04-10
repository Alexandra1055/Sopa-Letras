<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $usuario = $_POST["nickname"];
    echo "El usuario introducido es: " . htmlspecialchars($usuario) . "<br>";

    $contrasena = $_POST["contrasena"];
    echo "La contraseña introducida es: " . htmlspecialchars($contrasena) . "<br>";
}
?>
