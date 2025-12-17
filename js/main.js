// main.js

// --- LÓGICA DE PRECIOS ---
const PRODUCT_PRICES = {
    'Cheese Chees': 9.50, 'Extreme Bacon': 11.00, 'Extra Super Crispy': 10.50,
    'Wild West Burger': 12.50, 'Aloha Burger': 11.50, 'Pixel Pulled Pork': 10.90,
    'Tokyo Teriyaki': 13.00, 'Veggie Byte': 9.90, 'Spicy Inferno': 12.90,
    'The Godfather': 13.50, 'Crispy Onion': 10.90,
    'Choco Overload': 6.00, 'Strawberry Dream': 5.50, 'Mint Condition': 6.50,
    'Coffee Boost': 5.90,
    'Oferta de la Semana': 8.00 
};


// 1. Obtiene los elementos del DOM (Globales)
const cartCounter = document.getElementById('cart-counter');
const cartSidebar = document.getElementById('cart-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const clearAllBtn = document.getElementById('clear-all-btn'); 
const cartList = document.getElementById('cart-list');
const addButtons = document.querySelectorAll('.add-to-cart-btn');
const totalItemsSpan = document.querySelectorAll('#cart-total-items'); 
const sidebarFooter = document.querySelector('.sidebar-footer'); 
const totalAmountSpan = document.getElementById('cart-total-amount'); 
const mapPlaceholder = document.querySelector('.map-placeholder'); 
const navLinks = document.querySelectorAll('.header ul li a'); 
const navLogo = document.querySelector('.fixed-navbar img'); 

// NUEVOS ELEMENTOS DE TERMINAL
const formInputs = document.querySelectorAll('#pipboy-form .pipboy-input');
const feedbackTerminal = document.getElementById('feedback-terminal');
const pipboyForm = document.getElementById('pipboy-form'); 
const sendCommandBtn = document.getElementById('send-command-btn'); // Botón de envío
const snakeByteBtn = document.getElementById('snake-byte-btn');     // Botón Snake

// Mapeo de mensajes para la terminal
const validationMessages = {
    'email': { pass: 'EMAIL OK. CONEXIÓN SEGURA.', fail: 'ERROR: FORMATO INVÁLIDO. REVISAR SINTAXIS.' },
    'asunto': { pass: 'ASUNTO OK. CONTINUANDO...', fail: 'ERROR: ASUNTO DEMASIADO CORTO O INVÁLIDO.' },
    'mensaje': { pass: 'MENSAJE OK. DATOS ALMACENADOS.', fail: 'ERROR: MENSAJE VACÍO.' },
    'telefono': { pass: 'TELÉFONO OK. CONTACTO ESTABLECIDO.', fail: 'ERROR: TELÉFONO INVÁLIDO O INCOMPLETO.' },
    'vacio': 'ERROR: CAMPO REQUERIDO VACÍO.' // Mensaje para campos obligatorios vacíos
};


// 2. Elementos para "Ver Más"
const loadMoreBtn = document.getElementById('load-more-btn');
const hideLessBtn = document.getElementById('hide-less-btn'); 
const sectionCardsContainer = document.querySelector('.section2');
const allCards = document.querySelectorAll('.section2 .card-item');

// 3. Inicializa el contador y el array de items
let cartItems = []; 
let initializationAttempts = 0; 


// --- FUNCIÓN CRUCIAL DE CÁLCULO DE ALTURA CON REINTENTO (Para Ver Más/Menos) ---
function setInitialLayout() {
    
    if (initializationAttempts >= 10) {
        console.error("Fallo al calcular la altura inicial de la Carta.");
        setupListeners(); 
        renderCart();
        return;
    }
    initializationAttempts++;

    window.requestAnimationFrame(() => {
        if (allCards.length === 0 || !sectionCardsContainer) {
            setupListeners();
            renderCart();
            return;
        }
        
        const firstRowCards = Array.from(allCards).slice(0, 3);
        
        if (firstRowCards.length > 0) {
            const firstCardHeight = firstRowCards[0].offsetHeight;
            
            if (firstCardHeight === 0) {
                setTimeout(setInitialLayout, 50); 
                return;
            }

            const initialHeight = firstCardHeight + 80; 
            
            sectionCardsContainer.style.maxHeight = `${initialHeight}px`;
            sectionCardsContainer.classList.add('collapsed'); 

            const initiallyHiddenCards = Array.from(allCards).slice(3);
            initiallyHiddenCards.forEach(card => {
                card.classList.add('hidden-item'); 
                card.style.display = 'none'; 
            });
            
            if (hideLessBtn) hideLessBtn.style.display = 'none';
        }
        
        setupListeners();
        renderCart();
    });
}


// --- LÓGICA DE INTERACCIÓN (FUNCIONES DEL CARRITO) ---

function openSidebar() {
    cartSidebar.classList.add('open');
    document.body.classList.add('sidebar-open');
}

function closeSidebar() {
    cartSidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
}

function renderCart() {
    let totalItems = 0;
    let totalAmount = 0;
    
    cartList.innerHTML = ''; 

    if (cartItems.length === 0) {
        cartList.innerHTML = '<li class="empty-message">¡Tu pedido está vacío!</li>';
        sidebarFooter.style.display = 'none';
    } else {
        sidebarFooter.style.display = 'block';
        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.quantity} x ${item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}€</span>
                <button class="remove-btn" data-name="${item.name}">X</button>
            `;
            cartList.appendChild(li);

            totalItems += item.quantity;
            totalAmount += item.price * item.quantity;
        });
    }

    cartCounter.innerHTML = `🛒 (${totalItems})`; 
    
    totalItemsSpan.forEach(span => span.textContent = totalItems);
    totalAmountSpan.textContent = totalAmount.toFixed(2) + '€';
}

function addItem(name) {
    let price = PRODUCT_PRICES[name];
    
    if (name === '¡Pedir Oferta!') {
        name = 'Oferta de la Semana'; 
        price = PRODUCT_PRICES[name];
    } else if (!price) {
        console.error(`Precio no encontrado para: ${name}`);
        return;
    }

    const existingItem = cartItems.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ name, price, quantity: 1 });
    }
    
    renderCart();
}

function removeItem(name) {
    const itemIndex = cartItems.findIndex(item => item.name === name);

    if (itemIndex > -1) {
        cartItems[itemIndex].quantity--;
        if (cartItems[itemIndex].quantity === 0) {
            cartItems.splice(itemIndex, 1);
        }
    }
    renderCart();
}

function clearCart() {
    if (confirm('¿Estás seguro que quieres vaciar el carrito?')) {
        cartItems = [];
        renderCart();
        closeSidebar();
    }
}

function handleAddToCartClick(e) {
    const button = e.target;
    let productName = '';
    const originalText = button.textContent;
    
    if (button.closest('.special-offer-card')) {
        productName = 'Oferta de la Semana';
    } else {
        const cardItem = button.closest('.card-item');
        const h4Element = cardItem ? cardItem.querySelector('h4') : null;
        
        if (h4Element) {
             productName = h4Element.textContent.trim();
        } else {
            console.error("No se pudo encontrar el nombre del producto.");
            return;
        }
    }
    
    button.textContent = "¡AÑADIDO! ✨"; 
    button.classList.add('clicked');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('clicked');
        
        cartCounter.classList.add('bounce');
        setTimeout(() => cartCounter.classList.remove('bounce'), 500);
    }, 500);

    addItem(productName);
}


function setupAddButtons() {
    addButtons.forEach(button => {
        button.removeEventListener('click', handleAddToCartClick);
        button.addEventListener('click', handleAddToCartClick);
    });
}

function setupCartListeners() {
    if (cartCounter) cartCounter.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if (clearAllBtn) clearAllBtn.addEventListener('click', clearCart);

    if (cartList) {
        cartList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const name = e.target.getAttribute('data-name');
                removeItem(name);
            }
        });
    }
}


// --- FUNCIÓN DE DESPLAZAMIENTO SUAVE ---
function smoothScroll(target) {
    const element = document.querySelector(target);
    const fixedNavbar = document.querySelector('.fixed-navbar');
    
    // Obtiene la altura del navbar fijo para compensar el desplazamiento
    const fixedNavbarHeight = fixedNavbar ? fixedNavbar.offsetHeight : 0; 
    
    let targetY = 0;

    if (target !== 'body') {
        // Calcula la posición de la sección menos la altura de la barra fija
        targetY = element ? element.offsetTop - fixedNavbarHeight : 0;
    }
    
    window.scrollTo({
        top: targetY, 
        behavior: 'smooth'
    });
}

// LÓGICA: Navegación por enlaces (UL)
function setupNavLinks() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScroll(targetId);
        });
    });
}

// FUNCIÓN: Manejar el clic del Logo para ir a Inicio
function handleLogoClick(e) {
    e.preventDefault(); 
    const logo = e.target;
    
    // 1. Aplicar efecto visual (usaremos la clase 'clicked')
    logo.classList.add('clicked');
    
    // 2. Realizar desplazamiento suave al inicio del body (target 'body' = 0)
    smoothScroll('body');
    
    // 3. Remover el efecto visual
    setTimeout(() => {
        logo.classList.remove('clicked');
    }, 200); 
}


// LÓGICA DE "VER MÁS ARTÍCULOS" (Se mantiene)
function loadMoreItems() {
    if (!sectionCardsContainer) return;
    
    sectionCardsContainer.classList.remove('collapsed');
    sectionCardsContainer.classList.add('expanded');
    
    const hiddenCardsToReveal = document.querySelectorAll('.section2 .hidden-item');

    hiddenCardsToReveal.forEach((card, index) => {
        card.style.display = 'flex'; 
        
        setTimeout(() => {
            card.classList.add('is-visible');
        }, 50 + index * 100); 
    });

    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
        loadMoreBtn.style.pointerEvents = 'none'; 
    }
    if (hideLessBtn) {
        hideLessBtn.style.display = 'inline-block';
        hideLessBtn.style.pointerEvents = 'auto'; 
    }
}

// LÓGICA: OCULTAR ARTÍCULOS (Se mantiene)
function hideLessItems() {
    if (!sectionCardsContainer) return;

    sectionCardsContainer.classList.remove('expanded');
    sectionCardsContainer.classList.add('collapsed');

    const cardsToHide = document.querySelectorAll('.section2 .hidden-item');
    
    cardsToHide.forEach((card) => {
        card.classList.remove('is-visible');
        
        setTimeout(() => {
            card.style.display = 'none';
        }, 400); 
    });
    
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'inline-block';
        loadMoreBtn.style.pointerEvents = 'auto'; 
    }
    if (hideLessBtn) {
        hideLessBtn.style.display = 'none';
        hideLessBtn.style.pointerEvents = 'none'; 
    }
}


// --- EFECTO MÁQUINA DE ESCRIBIR PARA LA TERMINAL ---
let terminalContent = ''; 

function typewriterEffect(element, text) {
    // 1. Preparamos el nuevo texto, asegurando un salto de línea si ya hay contenido
    const newMessage = (terminalContent.trim() !== '' ? '\n' : '') + text;
    terminalContent += newMessage;
    
    // 2. Inicializamos la escritura
    let i = 0;
    const speed = 25; 
    const currentFullText = element.textContent;
    
    // Calculamos el índice donde comienza el nuevo texto
    const startWriteIndex = currentFullText.length;
    
    // Limpiamos el elemento para la animación
    element.textContent = currentFullText;
    
    function type() {
        if (i < newMessage.length) {
            // Añadimos el nuevo carácter al final del contenido visible
            element.textContent += newMessage.charAt(i);
            i++;
            
            // Forzar desplazamiento al final
            element.scrollTop = element.scrollHeight; 
            
            setTimeout(type, speed);
        } else {
            // Al finalizar el mensaje, añadimos el prompt (>)
            element.textContent += '\n\n>';
            terminalContent += '\n\n>'; // Actualizamos el contenido guardado con el prompt
            element.scrollTop = element.scrollHeight;
        }
    }
    
    // Si la terminal está vacía (primer mensaje), empezamos la escritura directamente
    if (terminalContent.trim() === newMessage.trim()) {
        element.textContent = '';
        terminalContent = '';
        setTimeout(type, speed);
    } else {
        // Para mensajes subsiguientes, ejecutamos la animación
        type();
    }
}

// --- LÓGICA DE VALIDACIÓN DE CAMPOS ---
function validateField(input) {
    const name = input.name;
    const value = input.value.trim();
    let message = '';
    let isValid = false;

    if (value === '') {
        if (input.required) {
            message = validationMessages.vacio;
            isValid = false;
        } else {
            message = `[INFO]: CAMPO OPCIONAL VACÍO. IGNORANDO.`;
            isValid = true;
        }
    } else {
        // Validaciones complejas (campo tiene contenido)
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            message = isValid ? validationMessages[name].pass : validationMessages[name].fail;
        } else if (name === 'asunto') {
            isValid = value.length >= 3;
            message = isValid ? validationMessages[name].pass : validationMessages[name].fail;
        } else if (name === 'mensaje') {
            isValid = value.length > 0;
            message = validationMessages[name].pass;
        } else if (name === 'telefono') {
            const phoneRegex = /^\s*(?:\+?(\d{1,3}))?([-(]?(\d{3})[)-]?)?([ -]?(\d{4}))([ -]?(\d{4}))\s*$/;
            isValid = phoneRegex.test(value);
            message = isValid ? validationMessages[name].pass : validationMessages[name].fail;
        }
    }
    
    input.setAttribute('data-valid', isValid);
    typewriterEffect(feedbackTerminal, `${name.toUpperCase()} STATUS:\n${message}`);
    
    return isValid;
}


// --- FUNCIÓN: MANEJAR EL ENVÍO DEL FORMULARIO ---
function handleFormSubmit(e) {
    e.preventDefault(); 

    let allFieldsValid = true;
    let missingRequiredFields = false;

    // 1. Recorre todos los inputs para forzar la validación final y verificar el estado
    formInputs.forEach(input => {
        const isValid = validateField(input);
        
        if (!isValid) {
            allFieldsValid = false;
            if (input.required && input.value.trim() === '') {
                missingRequiredFields = true;
            }
        }
    });

    // 2. Reporta el resultado final y controla la visibilidad de los botones
    if (allFieldsValid) {
        typewriterEffect(feedbackTerminal, 
            '>> VALIDACIÓN COMPLETA. TODOS LOS CAMPOS CORRECTOS.\n' + 
            '>> INICIANDO TRANSMISIÓN DE DATOS...\n' + 
            '>> MENSAJE ENVIADO. ESPERE RESPUESTA DE LA BASE DE DATOS.\n\n' +
            '>> [INFO]: SECUENCIA DE JUEGO DETECTADA: SNAKE BYTE. LISTO PARA INICIAR.');
        
        // MOSTRAR BOTÓN SNAKE y OCULTAR ENVÍO
        if (sendCommandBtn) sendCommandBtn.style.display = 'none';
        if (snakeByteBtn) snakeByteBtn.style.display = 'inline-block';
        
        // Limpiar los campos para simular el envío exitoso
        pipboyForm.reset(); 

    } else if (missingRequiredFields) {
         typewriterEffect(feedbackTerminal, 
            '>> ERROR CRÍTICO DE ENVÍO: FALTAN CAMPOS REQUERIDOS (*).\n' + 
            '>> VERIFIQUE LA INFORMACIÓN E INTENTE DE NUEVO.');
        
        // Asegurar que el botón SNAKE esté oculto
        if (snakeByteBtn) snakeByteBtn.style.display = 'none';
        if (sendCommandBtn) sendCommandBtn.style.display = 'inline-block';

    } else {
        typewriterEffect(feedbackTerminal, 
            '>> ERROR DE ENVÍO: ALGUNOS DATOS SON INVÁLIDOS.\n' + 
            '>> AJUSTE LOS PARÁMETROS Y VUELVA A INTENTAR.');
        
        // Asegurar que el botón SNAKE esté oculto
        if (snakeByteBtn) snakeByteBtn.style.display = 'none';
        if (sendCommandBtn) sendCommandBtn.style.display = 'inline-block';
    }
}


// --- ESCUCHADORES DE LA TERMINAL ---
function setupTerminalListeners() {
    // 1. Escuchadores de validación al perder el foco (blur)
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });
    
    // 2. Escuchador para el evento de ENVÍO
    if (pipboyForm) {
        pipboyForm.addEventListener('submit', handleFormSubmit);
    }
    
    // 3. NUEVO: Escuchador para el botón SNAKE (REDIRECCIÓN)
    if (snakeByteBtn) {
        snakeByteBtn.addEventListener('click', () => {
            // Redirige al subdirectorio 'snake/'
            window.location.href = './snake/index.html'; 
        });
    }
    
    // Mensaje inicial de la terminal
    terminalContent = ''; 
    typewriterEffect(feedbackTerminal, 'BIENVENIDO A BURGER BYTES TERMINAL V1.0\nCARGANDO PROTOCOLOS DE CONTACTO...');
}


// --- Event Listeners y Configuración Inicial ---

function setupListeners() {
    // Escuchadores del Carrito
    setupCartListeners();
    setupAddButtons(); 
    
    // Escuchadores de Navegación
    setupNavLinks();
    
    // Escuchador para el logo (Vuelve a Inicio)
    if (navLogo) navLogo.addEventListener('click', handleLogoClick);

    // Escuchadores de la Carta (Ver Más/Menos)
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMoreItems);
    if (hideLessBtn) hideLessBtn.addEventListener('click', hideLessItems);
    
    // Escuchadores de la Terminal
    setupTerminalListeners();
}


// Inicializa la página después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', setInitialLayout);