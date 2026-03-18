<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['nombre']) || !isset($data['puntuacion'])) {
    echo json_encode(['success' => false, 'error' => 'Faltan datos']);
    exit;
}

$nombre = strtoupper(substr(trim(htmlspecialchars($data['nombre'])), 0, 3)); 
$puntuacion = filter_var($data['puntuacion'], FILTER_VALIDATE_INT);

require_once 'connection.php';

try {
    $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
    $stmt = $pdo->prepare("INSERT INTO puntuaciones_snake (nombre_jugador, puntuacion) VALUES (:nombre, :puntuacion)");
    $stmt->execute([
        'nombre' => $nombre,
        'puntuacion' => $puntuacion
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    // Esto nos dirá el error real si falla
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>