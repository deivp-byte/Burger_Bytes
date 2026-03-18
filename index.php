<?php
require_once 'connection.php';
// ==========================================
// 2. LÓGICA DE BORRADO (Si se hace clic en la 'X')
// ==========================================
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['delete_consulta'])) {
    $id_borrar = filter_input(INPUT_POST, 'id_consulta', FILTER_VALIDATE_INT);
    if ($id_borrar) {
        $stmt = $pdo->prepare("DELETE FROM consultas WHERE id = :id");
        $stmt->execute(['id' => $id_borrar]);
    }
    header("Location: index.php#faq-section");
    exit;
}

// ==========================================
// 3. LÓGICA DE INSERCIÓN (Si se envía el formulario)
// ==========================================
$show_snake_btn = false;

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['submit_consulta'])) {
    
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $asunto = htmlspecialchars(trim($_POST["asunto"]));
    $mensaje = htmlspecialchars(trim($_POST["mensaje"]));
    $telefono = htmlspecialchars(trim($_POST["telefono"]));

    $errores = [];

    // Validaciones
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errores[] = "ERROR: E-MAIL INVÁLIDO O VACÍO.";
    }
    if (!empty($asunto) && strlen($asunto) < 3) {
         $errores[] = "ERROR: ASUNTO DEMASIADO CORTO.";
    }
    if (empty($mensaje)) {
         $errores[] = "ERROR: EL MENSAJE ES OBLIGATORIO.";
    }

    // Si no hay errores, guardamos en base de datos
    if (empty($errores)) {
        $stmt = $pdo->prepare("INSERT INTO consultas (email, asunto, mensaje, telefono) VALUES (:email, :asunto, :mensaje, :telefono)");
        $stmt->execute([
            'email' => $email,
            'asunto' => $asunto,
            'mensaje' => $mensaje,
            'telefono' => $telefono
        ]);
        
        $terminal_message = ">> VALIDACIÓN SERVIDOR COMPLETA.\n>> DATOS SANITIZADOS Y GUARDADOS EN BD.\n>> [OK] COMANDO REGISTRADO.\n\n>> [INFO]: SECUENCIA DE JUEGO DETECTADA: SNAKE BYTE. LISTO PARA INICIAR.\n\n>";
        $show_snake_btn = true; 
    } else {
        // Si hay errores, preparamos el mensaje de la terminal
        $terminal_message = ">> ERROR CRÍTICO DE ENVÍO:\n";
        foreach ($errores as $error) {
            $terminal_message .= " - " . $error . "\n";
        }
        $terminal_message .= ">> REVISE LOS DATOS Y VUELVA A INTENTAR.\n\n>";
    }
}

// ==========================================
// 4. LECTURA DE DATOS PARA LA SECCIÓN FAQ
// ==========================================
$stmt = $pdo->query("SELECT id, asunto, mensaje FROM consultas ORDER BY id DESC");
$consultas_faq = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/responsive.css?v=2"> 
    <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
    <title>Burger Bytes - Retro Food</title>
</head>

<body> 
    
    <div class="fixed-navbar">
        <img src="imagenes/logo.png" width="100" height="100" alt="Logo de Burger Bytes">
        <div class="cart-icon" id="cart-counter" title="Abrir Carrito">🛒 (0)</div>
    </div>
    
    <div id="page-overlay"></div>

    <header class="header">
        <video autoplay muted loop id="bg-video">
            <source src="imagenes/PixVerse_V5_Image_Text_720P_quiero_crear_una_i.mp4" type="video/mp4">
        </video>
        
        <h1 class="typewriter"><strong>BURGER BYTES</strong></h1>
        
        <ul>
            <li><a href="#ofertas-section">Ofertas</a></li>
            <li><a href="#topbytes-section">Top Bytes</a></li>
            <li><a href="#carta-section">Carta</a></li>
            <li><a href="#ubicacion-section">Ubicación</a></li>
            <li><a href="#contacto-section">Contacto</a></li>
        </ul>
        
    </header>

    <main>
        
        <section class="top" id="ofertas-section"> 
            <h1>OFERTA DE LA SEMANA</h1>
            <div class="special-offer-card">
                <h2>⭐ Double Cheese Megablast ⭐</h2>
                <p> Hamburguesa especial Double Cheese </p>
                <p>¡Dos carnes, triple queso y salsa secreta de la abuela pixelada por solo 8€! ¡Byte it!</p>
                <button class="add-to-cart-btn">¡Pedir Oferta!</button>
            </div>
        </section>
        
        <section class="top" id="topbytes-section"> 
            <h1>TOP BYTES</h1>
            <div class="section">
                <article id="hamburgesa1" class="card-item">
                    <img src="imagenes/Hamburguesa gourmet con queso derretido.png" width="300" height="300" alt="Hamburguesa con queso derretido">
                    <h4>Cheese Chees</h4>
                    <p>Burger llena de queso chedar derretido con un toque picantón y delicioso</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>

                <article id="hamburgesa2" class="card-item">
                    <img src="imagenes/ChatGPT Image 2 nov 2025, 14_50_23.png" width="300" height="300" alt="Hamburguesa con abundante bacon">
                    <h4>Extreme Bacon</h4>
                    <p>Burger de sabor puro bacon para amantes</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>

                <article id="hamburgesa3" class="card-item">
                    <img src="imagenes/Sándwich de pollo crujiente y fresco.png" width="300" height="300" alt="Sándwich de pollo crujiente">
                    <h4>Extra Super Crispy</h4>
                    <p>Pollo crujientre y lleno de sabor</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>
            </div>
        </section>

        <section id="carta-section">
            <div class="header2">
                <h1>Carta Completa</h1>
            </div>
            
            <div class="section2"> 
                
                <article id="carta1" class="card-item">
                    <img src="imagenes/wild west.png" width="300" height="300" alt="Wild West Burger con aros de cebolla">
                    <h4>Wild West Burger</h4>
                    <p>Jugosa carne de res con queso cheddar fundido, tiras de bacon crujiente, aros de cebolla y una capa generosa de salsa BBQ ahumada.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>
                
                <article id="carta6" class="card-item">
                    <img src="imagenes/aloha burger.png" width="300" height="300" alt="Aloha Burger con piña a la parrilla">
                    <h4>Aloha Burger</h4>
                    <p>Hamburguesa tropical con carne de res, queso, bacon, lechuga fresca y una rodaja de piña a la parrilla.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>
                
                <article id="carta7" class="card-item">
                    <img src="imagenes/pulled pork.png" width="300" height="300" alt="Hamburguesa de cerdo desmenuzado">
                    <h4>Pixel Pulled Pork</h4>
                    <p>Cerdo desmenuzado ahumado con salsa de mostaza y miel y col crujiente.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>

                <article id="carta8" class="card-item hidden-item">
                    <img src="imagenes/tokyo.png" width="300" height="300" alt="Hamburguesa con salsa Teriyaki">
                    <h4>Tokyo Teriyaki</h4>
                    <p>Carne de res bañada en salsa teriyaki, alga nori y mayonesa de wasabi.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>

                <article id="carta9" class="card-item hidden-item">
                    <img src="imagenes/veggie.png" width="300" height="300" alt="Hamburguesa vegana de garbanzos">
                    <h4>Veggie Byte</h4>
                    <p>Hamburguesa vegana de garbanzos y espinacas con pan de semillas y salsa de yogurt.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>

                <article id="carta10" class="card-item hidden-item">
                    <img src="imagenes/spicy.png" width="300" height="300" alt="Hamburguesa muy picante">
                    <h4>Spicy Inferno</h4>
                    <p>Carne con chile habanero, queso fantasma y salsa ultra picante. Solo para valientes.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>

                <article id="carta11" class="card-item hidden-item">
                    <img src="imagenes/godfather.png" width="300" height="300" alt="Hamburguesa con pesto y mozzarella">
                    <h4>The Godfather</h4>
                    <p>Carne de res con pesto, mozzarella fresca y tomate seco. Un clásico italiano.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>

                <article id="carta12" class="card-item hidden-item">
                    <img src="imagenes/crispy onion.png" width="300" height="300" alt="Hamburguesa con cebolla crujiente">
                    <h4>Crispy Onion</h4>
                    <p>Carne de res con queso suizo y una montaña de cebolla frita crujiente.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>

                <article id="carta13" class="card-item hidden-item">
                    <img src="imagenes/choco overloadpng.png" width="300" height="300" alt="Batido de triple chocolate">
                    <h4>Choco Overload</h4>
                    <p>Batido espeso de triple chocolate con trozos de galleta.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>

                <article id="carta14" class="card-item hidden-item">
                    <img src="imagenes/strawberry dreampng.png" width="300" height="300" alt="Batido de fresa y vainilla">
                    <h4>Strawberry Dream</h4>
                    <p>Batido de fresa natural con un toque de vainilla y nata montada pixelada.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>
                
                <article id="carta15" class="card-item hidden-item">
                    <img src="imagenes/mind condition.png" width="300" height="300" alt="Batido de menta y chocolate">
                    <h4>Mint Condition</h4>
                    <p>Batido refrescante de menta y chocolate con un efecto frío extremo.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>
                
                <article id="carta16" class="card-item hidden-item">
                    <img src="imagenes/coffe boost.png" width="300" height="300" alt="Batido de café y caramelo">
                    <h4>Coffee Boost</h4>
                    <p>Batido energético de café espresso y caramelo. Ideal para recargar vidas.</p>
                    <button class="add-to-cart-btn">Añadir</button>
                </article>
                
            </div>
            
            <div class="load-more-container">
                <button id="load-more-btn" class="button-link">🡻Ver Más Artículos🡻</button>
                <button id="hide-less-btn" class="button-link" style="display:none;">🡹Ver Menos Artículos🡹</button>
            </div>
            
        </section>
        
        <section class="top" id="ubicacion-section">
            <h1>📍 Byte Point 📍</h1>
            <div class="location-container">
                <div class="map-placeholder" id="map-area"> 
                   <img src="./imagenes/unnamed.jpg" width="300" height="300" alt="Mapa de la ubicación">
                </div>
                
                <div class="hours-info">
                    <h2>Horario de Apertura</h2>
                    <ul>
                        <li>**Lunes a Viernes:** 13:00h - 16:00h | 20:00h - 23:30h</li>
                        <li>**Sábados:** 13:00h - 00:00h</li>
                        <li>**Domingos:** Cerrado (Maintenance Byte)</li>
                    </ul>
                    <p>📍 Dirección: Calle Pixel Art, 1980, Vic, España</p>
                    
                </div>
            </div>
        </section>

        <section id="contacto-section" class="pipboy-section">
            <h1>Contacto | ¡Get a Byte!</h1>
            
            <div class="pipboy-screen-container">
                <div class="pipboy-flex-content"> 
                    <div class="formulari pipboy-content form-area">
                        <p>// INGRESO DE DATOS</p>
                        <form action="index.php#contacto-section" method="POST" class="box pipboy-form" id="pipboy-form">
                            
                            <label for="email">E-mail de Acceso:*</label>
                            <input type="email" id="email" name="email" placeholder="STEVE@GMAIL.COM" required class="pipboy-input">

                            <label for="asunto">Asunto de la Consulta:</label>
                            <input type="text" id="asunto" name="asunto" placeholder="URGENTE" class="pipboy-input">

                            <label for="mensaje">Mensaje:</label>
                            <textarea id="mensaje" name="mensaje" rows="5" placeholder="INSERTE DATOS..." class="pipboy-input pipboy-textarea"></textarea> 

                            <label for="telefono">Teléfono de Retorno:</label>
                            <input type="tel" id="telefono" name="telefono" placeholder="EJ: 600 123 456" class="pipboy-input"> 

                            <button type="submit" name="submit_consulta" id="send-command-btn" class="pipboy-button">>> ENVIAR COMANDO</button>
                            
                        </form>
                    </div>

                    <div class="pipboy-terminal-carcasa">
                        <div class="pipboy-terminal-screen">
                            <pre id="feedback-terminal"><?php
                                // Lógica para mostrar mensajes de la terminal desde PHP
                                if (isset($terminal_message)) {
                                    echo htmlspecialchars($terminal_message);
                                } else {
                                    echo "BIENVENIDO A BURGER BYTES TERMINAL V1.0\nCARGANDO PROTOCOLOS DE CONTACTO...\n\n>";
                                }
                                ?>
                            </pre>
                            <?php if (isset($show_snake_btn) && $show_snake_btn): ?>
                                <a href="snake/index_snake.php" id="snake-byte-btn" class="pipboy-button snake-button" style="display:inline-block; text-decoration:none;">> SNAKE BYTE <</a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="faq-section" class="top">
            <h1>Consultas / Mensajes</h1>
            <div class="hours-info" style="width: 80%; margin: 0 auto; max-width: 800px;">
                
                <?php if (empty($consultas_faq)): ?>
                    <p style="text-align: center;"><em>[INFO]: NO SE HAN ENCONTRADO REGISTROS.</em></p>
                <?php else: ?>
                    
                    <ul style="list-style: none; padding: 0;">
                        <?php foreach ($consultas_faq as $consulta): ?>
                            <li style="border: 2px solid var(--primary-yellow); padding: 15px; margin-bottom: 15px; border-radius: 5px; background: rgba(0,0,0,0.5); position: relative;">
                                
                                <form action="index.php" method="POST" class="delete-form" style="position: absolute; top: 10px; right: 10px;">
                                    <input type="hidden" name="id_consulta" value="<?= $consulta['id']; ?>">
                                    <button type="submit" name="delete_consulta" class="remove-btn" title="Borrar Consulta">X</button>
                                </form>

                                <h2 style="color: var(--pipboy-green-fallout); margin-top: 0; font-size: 24px;">
                                    > <?= empty($consulta['asunto']) ? 'SIN ASUNTO' : htmlspecialchars($consulta['asunto']); ?>
                                </h2>
                                <p style="color: white; font-size: 18px; margin-bottom: 0;">
                                    <?= nl2br(htmlspecialchars($consulta['mensaje'])); ?>
                                </p>
                            </li>
                        <?php endforeach; ?>
                    </ul>

                <?php endif; ?>

            </div>
        </section>

    </main>
    
    <footer class="footer">
        <div class="footer-content">
            <img src="imagenes/logo.png" width="80" height="80" alt="Logo de Burger Bytes">
            
            <div class="footer-links">
                <h2><a href="#topbytes-section">TOP BYTES</a></h2>
                <h2><a href="#carta-section">CARTA</a></h2>
            </div>
            
            <div class="social-media">
                <p>Síguenos:</p>
                <img class="social-icon" src="./imagenes/Captura de pantalla 2025-11-26 180357.png" width="30" height="30" alt="Icono de Twitter Pixel Art">
                <img class="social-icon" src="./imagenes/Captura de pantalla 2025-11-26 180118.png" width="30" height="30" alt="Icono de Instagram Pixel Art">
                <img class="social-icon" src="./imagenes/Captura de pantalla 2025-11-26 180230.png" width="30" height="30" alt="Icono de Facebook Pixel Art">
            </div>

            <div class="credits">
                <p>© 2025 Burger Bytes | Universitat de Vic</p>
                <p>Vídeos: Pixeverse | Imágenes: ChatGPT</p>
            </div>
        </div>
    </footer>

    <aside id="cart-sidebar">
        <div class="sidebar-header">
            <h2>🛒 Tu Pedido</h2>
            <button class="close-btn" id="close-sidebar">X</button>
        </div>
        
        <ul id="cart-list" class="sidebar-list">
            </ul>

        <div class="sidebar-footer">
            <p>Importe Total (<span id="cart-total-items">0</span> Bytes): 
                <span id="cart-total-amount">0.00€</span> 
            </p>
            
            <button class="clear-all-btn" id="clear-all-btn">Vaciar Carrito</button>
            
            <button class="checkout-btn">IR A PAGAR</button>
        </div>
    </aside>
    <div id="delete-modal" class="modal-overlay hidden">
        <div class="modal-content retro-box">
            <h2 class="warning-text">⚠️ ADVERTENCIA ⚠️</h2>
            <p>¿ESTÁS SEGURO DE QUE DESEAS PURGAR ESTE DATO?</p>
            <p style="font-size: 14px; color: #ccc;">Esta acción no se puede deshacer.</p>
            <div class="modal-buttons">
                <button id="cancel-delete-btn" class="button-link" style="margin-top: 0;">CANCELAR</button>
                <button id="confirm-delete-btn" class="clear-all-btn" style="width: auto; margin-bottom: 0;">SÍ, PURGAR</button>
            </div>
        </div>
    </div>
    <script src="js/main.js?v=2"></script> 
</body>
</html>