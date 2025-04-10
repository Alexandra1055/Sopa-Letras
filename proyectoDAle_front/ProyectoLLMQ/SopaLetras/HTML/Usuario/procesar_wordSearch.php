<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $nickname = $_POST["nickname"];
    echo "El nombre de usuario introducido es: " . $nickname;
    
    echo "<br>";

    $contrasena = $_POST["contrasena"];
    $longitud_contrasena = strlen($contrasena);
    $contrasena_oculta = "";
    for ($i = 0; $i < $longitud_contrasena; $i++) {
        $contrasena_oculta .= "*";
    }
    echo "La contraseña introducida es: " . $contrasena_oculta;

    echo "<br>";
}
?>

