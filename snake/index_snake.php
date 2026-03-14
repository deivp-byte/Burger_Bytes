<?php

$host = 'deivid123-deividprueba.c.aivencloud.com'; 
$port = '14862';       
$dbname = 'burger_bytes'; 
$user = 'avnadmin';      
$password = 'AVNS_UhqeIZJ-Luzsf6oVbO0';

$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
$top_scores = [];

try {
    $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $stmt = $pdo->query("SELECT nombre_jugador, puntuacion FROM puntuaciones_snake ORDER BY puntuacion DESC LIMIT 5");
    $top_scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Si falla, simplemente no mostrará puntuaciones, pero el juego no se rompe
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐍 snake byte 🍔</title>
    <link rel="stylesheet" href="index.css">
    <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
</head>
<body>
    
    <a href="../index.php" id="back-to-home">
        <img src="../imagenes/logo.png" alt="Volver a Burger Bytes" width="80" height="80">
    </a>

    <h1>🐍 Snake byte 🍔</h1>
    
    <div id="main-layout">
        
        <div id="game-container">
            <div id="score-board">
                Puntuación: <span id="score">0</span>
            </div>
            <div id="game-board"></div>
            
            <div id="message-overlay" class="hidden">
                <p id="game-message"></p>
                
                <div id="score-input-section" class="hidden">
                    <p>NUEVO RÉCORD. INGRESA TUS INICIALES:</p>
                    <input type="text" id="player-initials" maxlength="3" placeholder="AAA" autocomplete="off">
                    <button id="save-score-btn">GUARDAR</button>
                </div>

                <button id="restart-button" style="margin-top: 15px;">Jugar de Nuevo</button>
            </div>
        </div>

        <div id="leaderboard-container">
            <h2>🏆 TOP BYTES 🏆</h2>
            <ul id="leaderboard-list">
                <?php if (empty($top_scores)): ?>
                    <li>SIN REGISTROS</li>
                <?php else: ?>
                    <?php foreach ($top_scores as $index => $score): ?>
                        <li>
                            <span class="rank">#<?= $index + 1 ?></span>
                            <span class="name"><?= htmlspecialchars($score['nombre_jugador']) ?></span>
                            <span class="points"><?= $score['puntuacion'] ?></span>
                        </li>
                    <?php endforeach; ?>
                <?php endif; ?>
            </ul>
        </div>

    </div>

    <script src="index.js?v=2"></script>
</body>
</html>