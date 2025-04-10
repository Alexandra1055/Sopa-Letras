<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $nombre = $_POST["nombre"];
    echo "El nombre introducido es: " . htmlspecialchars($nombre) . "<br>";

    $apellido1 = $_POST["apellido1"];
    echo "El primer apellido introducido es: " . htmlspecialchars($apellido1) . "<br>";

    $correo = $_POST["correo_electronico"];
    echo "El correo electrónico introducido es: " . htmlspecialchars($correo) . "<br>";

    $telefono = $_POST["num_telefono"];
    echo "El teléfono introducido es: " . htmlspecialchars($telefono) . "<br>";

    $fechaNacimiento = $_POST["fecha_naixament"];
    echo "La fecha de nacimiento introducida es: " . htmlspecialchars($fechaNacimiento) . "<br>";

    $tipoConsulta = $_POST["tipoconsulta"];
    echo "El tipo de consulta seleccionada es: " . htmlspecialchars($tipoConsulta) . "<br>";

    $descripcionConsulta = $_POST["dscrConsulta"];
    echo "Descripción de la consulta: " . htmlspecialchars($descripcionConsulta) . "<br>";

    $idConsulta = $_POST["id_consulta"];
    echo "ID de la consulta: " . htmlspecialchars($idConsulta) . "<br>";
}
?>