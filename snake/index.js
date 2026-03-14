document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const messageOverlay = document.getElementById('message-overlay');
    const gameMessage = document.getElementById('game-message');
    const restartButton = document.getElementById('restart-button');

    // --- CONFIGURACIÓN DEL JUEGO ---
    const GRID_SIZE = 20;
    const CELL_SIZE = 20; // En píxeles (debe coincidir con style.css)
    let snake = [{ x: 10, y: 10 }]; // Posición inicial de la serpiente (cabeza)
    let food = {}; // Posición de la hamburguesa
    let dx = 1; // Dirección inicial: derecha (x-delta)
    let dy = 0; // y-delta
    let score = 0;
    let gameLoopInterval;
    let gameSpeed = 150; // Velocidad inicial en milisegundos
    let gameStarted = false; // Estado del juego

    // --- FUNCIONES DE INICIALIZACIÓN ---

    /**
     * Crea la cuadrícula del juego en el DOM.
     */
    function createGrid() {
        gameBoard.innerHTML = ''; // Limpia el tablero
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `cell-${x}-${y}`;
                gameBoard.appendChild(cell);
            }
        }
    }

    /**
     * Genera una posición aleatoria para la comida que no esté ocupada por la serpiente.
     */
    function generateFood() {
        let newFoodPosition;
        do {
            newFoodPosition = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
        } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
        
        food = newFoodPosition;
    }

    /**
     * Inicia o reinicia el estado del juego.
     */
    function initGame() {
        // Asegurarse de que el temblor no esté activo
        document.getElementById('main-layout').classList.remove('shake-effect');
        
        snake = [{ x: 10, y: 10 }];
        dx = 1;
        dy = 0;
        score = 0;
        gameSpeed = 150;
        scoreElement.textContent = score;
        
        // Escondemos las pantallas superpuestas
        messageOverlay.classList.add('hidden');
        document.getElementById('score-input-section').classList.add('hidden');

        createGrid();
        generateFood();
        drawGame(); // Dibujamos el primer frame INMEDIATAMENTE
        startGameLoop();
    }

    // --- LÓGICA DEL JUEGO ---

    /**
     * Función principal que se ejecuta en cada paso del juego.
     */
    function gameTick() {
        const head = snake[0];
        const newHead = { x: head.x + dx, y: head.y + dy };

        // 1. Detección de Colisiones
        
        // Colisión con paredes
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
            return gameOver('¡Chocaste con la pared!');
        }

        // Colisión con la serpiente
        if (snake.some((segment, index) => index !== 0 && segment.x === newHead.x && segment.y === newHead.y)) {
            return gameOver('¡Te mordiste la cola!');
        }

        // 2. Mover la serpiente
        snake.unshift(newHead); // Añade la nueva cabeza

        // 3. Comer la hamburguesa
        if (newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            generateFood(); // Genera nueva comida
            increaseSpeed(); // Aumenta la velocidad
        } else {
            snake.pop(); // Si no come, quita el último segmento (la serpiente se mueve)
        }

        // 4. Dibujar el juego
        drawGame();
    }
    
    /**
     * Aumenta la velocidad del juego al comer.
     */
    function increaseSpeed() {
        // Reducimos el intervalo de tiempo, pero con un límite para que no sea injugable
        if (gameSpeed > 50) {
            gameSpeed -= 5; 
        }
        clearInterval(gameLoopInterval);
        startGameLoop(); // Reinicia el bucle con la nueva velocidad
    }

    function drawGame() {
        // Limpia las clases de todas las celdas
        document.querySelectorAll('.cell').forEach(cell => {
            cell.className = 'cell';
        });

        // Dibuja la hamburguesa
        const foodCell = document.getElementById(`cell-${food.x}-${food.y}`);
        if (foodCell) {
            foodCell.classList.add('hamburger');
        }

        // Dibuja la serpiente
        snake.forEach((segment, index) => {
            const cell = document.getElementById(`cell-${segment.x}-${segment.y}`);
            if (cell) {
                cell.classList.add('snake');
                if (index === 0) {
                    cell.classList.add('head'); // Clase para la cabeza
                }
            }
        });
    }

    /**
     * Inicia el bucle principal del juego.
     */
    function startGameLoop() {
        gameLoopInterval = setInterval(gameTick, gameSpeed);
    }

    /**
     * Muestra el mensaje de fin de juego y detiene el bucle.
     * @param {string} message Mensaje de Game Over.
     */
    function gameOver(message) {
        gameStarted = false; // El juego ya no está activo
        clearInterval(gameLoopInterval);
        
        // Aplicamos la sacudida
        document.getElementById('main-layout').classList.add('shake-effect');
        
        gameMessage.textContent = `¡GAME OVER! ${message} Puntuación: ${score}`;
        
        const scoreSection = document.getElementById('score-input-section');
        const initialsInput = document.getElementById('player-initials');
        
        if (score > 0) {
            scoreSection.classList.remove('hidden');
            initialsInput.value = '';
            setTimeout(() => initialsInput.focus(), 100); 
        } else {
            scoreSection.classList.add('hidden');
        }

        // Preparamos el botón para volver a jugar
        restartButton.textContent = 'Jugar de Nuevo';
        messageOverlay.classList.remove('hidden');
    }

    // --- FUNCIONES DE INICIO DE PANTALLA ---
    function showStartScreen() {
        messageOverlay.classList.remove('hidden');
        gameMessage.textContent = '>> PRESS START <<';
        
        document.getElementById('score-input-section').classList.add('hidden');
        restartButton.textContent = 'INICIAR JUEGO';
        restartButton.style.display = 'inline-block';
        
        createGrid(); 
    }

    // --- MANEJO DE TECLADO MEJORADO ---
    document.addEventListener('keydown', (e) => {
        // Si el juego NO ha empezado y pulsas Enter o Espacio, empieza.
        if (!gameStarted && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault(); // Evita que la página baje al pulsar espacio
            gameStarted = true;
            initGame();
            return;
        }

        if (!gameStarted) return; // Si no ha empezado, no leemos las flechas de dirección

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
                if (dy === 0) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
            case 's':
                if (dy === 0) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
            case 'a':
                if (dx === 0) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
            case 'd':
                if (dx === 0) { dx = 1; dy = 0; }
                break;
        }
    });

    // --- EVENTOS DE BOTONES ---
    restartButton.addEventListener('click', () => {
        gameStarted = true;
        initGame();
    });

    const backToHomeBtn = document.getElementById('back-to-home');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.location.href = '/Proyecto/index.php'; 
        });
    }

    // --- GUARDAR PUNTUACIÓN EN LA BASE DE DATOS ---
    const saveScoreBtn = document.getElementById('save-score-btn');
    if (saveScoreBtn) {
        saveScoreBtn.addEventListener('click', () => {
            const initialsInput = document.getElementById('player-initials');
            let initials = initialsInput.value.trim().toUpperCase();
            
            if (initials.length === 0) initials = 'UNK'; 

            saveScoreBtn.textContent = 'GUARDANDO...';
            saveScoreBtn.disabled = true;

            fetch('guardar_puntuaciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: initials, puntuacion: score })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                } else {
                    alert('Error al guardar: ' + data.error);
                    saveScoreBtn.textContent = 'GUARDAR';
                    saveScoreBtn.disabled = false;
                }
            })
            .catch(err => {
                alert('Error de conexión');
                saveScoreBtn.textContent = 'GUARDAR';
                saveScoreBtn.disabled = false;
            });
        });
    }

    // --- ARRANQUE INICIAL ---
    showStartScreen();
});