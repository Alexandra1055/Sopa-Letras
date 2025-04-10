<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Para leer los valores de los campos del formulario
    $nickname = $_POST["nickname"];
    echo "El nick de usuario introducido es: " . $nickname;
    
    echo "";

    $contrasena = $_POST["contrasena"];
    $longitud_contrasena = strlen($contrasena);
    $contrasena_oculta = "";
    for ($i = 0; $i < $longitud_contrasena; $i++) {
        $contrasena_oculta .= "*";
    }
    echo "La contraseña introducida es: " . $contrasena_oculta;

    echo "";

    $contrasena_rep = $_POST["contrasenaRepetida"];
    if ($contrasena == $contrasena_rep) {
        echo "Las contraseñas coinciden.";
    } else {
        echo "Las contraseñas no coinciden.";
    }

    echo "

    $nombre = $_POST["nombre"];
    echo "El nombre introducido es: " . $nombre;

    echo "";

    $apellido1 = $_POST["apellido1"];
    echo "El primer apellido introducido es: " . $apellido1;

    echo "";

    $apellido2 = $_POST["apellido2"];
    echo "El segundo apellido introducido es: " . ($apellido2 ? $apellido2 : "No se ha introducido");

    echo "";

    $correo_electronico = $_POST["correo_electronico"];
    echo "El correo electrónico introducido es: " . $correo_electronico;

    echo "";

    $fecha_nacimiento = $_POST["fecha_naixament"];
    echo "La fecha de nacimiento introducida es: " . $fecha_nacimiento;

    echo "";

    $pais = $_POST["pais"];
    echo "El país seleccionado es: " . $pais;

    echo "";

    $CCAA = $_POST["CCAA"];
    echo "La comunidad autónoma seleccionada es: " . $CCAA;

    echo "";

    if (isset($_POST["politica_privacidad"])) {
        echo "Se ha aceptado la política de privacidad.";
    } else {
        echo "No se ha aceptado la política de privacidad.";
    }
}
?>
