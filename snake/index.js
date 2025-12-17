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
        snake = [{ x: 10, y: 10 }];
        dx = 1;
        dy = 0;
        score = 0;
        gameSpeed = 150;
        scoreElement.textContent = score;
        messageOverlay.classList.add('hidden');

        createGrid();
        generateFood();
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

    /**
     * Dibuja la serpiente y la comida en el tablero.
     */
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
        clearInterval(gameLoopInterval);
        gameMessage.textContent = `¡GAME OVER! ${message} Puntuación final: ${score}`;
        messageOverlay.classList.remove('hidden');
    }

    // --- MANEJO DE TECLADO ---

    document.addEventListener('keydown', (e) => {
        // Solo permite cambiar la dirección si no es la dirección opuesta a la actual
        // (La serpiente no puede girar 180 grados instantáneamente)
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

    // --- EVENTOS ---
    restartButton.addEventListener('click', initGame);

    // Iniciar el juego al cargar la página
    initGame();
});