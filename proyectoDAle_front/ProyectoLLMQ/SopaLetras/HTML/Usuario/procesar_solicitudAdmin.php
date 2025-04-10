<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $nickname = $_POST["nickname"];
    echo "El nick de usuario introducido es: " . $nickname;
    
    echo "<br>";

    $nombre = $_POST["nombre"];
    echo "El nombre introducido es: " . $nombre;
    
    echo "<br>";

    $apellido1 = $_POST["apellido1"];
    echo "El primer apellido introducido es: " . $apellido1;
    
    echo "<br>";

    $apellido2 = $_POST["apellido2"];
    echo "El segundo apellido introducido es: " . ($apellido2 ? $apellido2 : "No se ha introducido");
    
    echo "<br>";

    $correo_electronico = $_POST["correo_electronico"];
    echo "El correo electrónico introducido es: " . $correo_electronico;
    
    echo "<br>";

    $fecha_nacimiento = $_POST["fecha_naixament"];
    echo "La fecha de nacimiento introducida es: " . $fecha_nacimiento;
    
    echo "<br>";

    $descripcion_consulta = $_POST["dscrConsulta"];
    echo "La razón para ser administrador es: " . $descripcion_consulta;
    
    echo "<br>";

    if (isset($_POST["politica_privacidad"])) {
        echo "Se ha aceptado la política de privacidad.";
    } else {
        echo "No se ha aceptado la política de privacidad.";
    }
}
?>
