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
const pipboyForm = document.getElementById('pipboy-form'); // Capturamos el formulario

// Mapeo de mensajes para la terminal
const validationMessages = {
    'email': { pass: 'EMAIL OK. INICIANDO CONEXIÓN.', fail: 'ERROR: FORMATO EMAIL INVÁLIDO.' },
    'asunto': { pass: 'ASUNTO RECIBIDO. CONTINÚE.', fail: 'ERROR: ASUNTO DEMASIADO CORTO.' },
    'mensaje': { pass: 'MENSAJE ACEPTADO. ESPERANDO TELEFONO.', fail: 'ERROR: MENSAJE REQUERIDO.' },
    'telefono': { pass: 'VALIDACIÓN TELEFÓNICA COMPLETADA.', fail: 'ERROR: TELÉFONO INVÁLIDO O VACÍO.' }
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
function typewriterEffect(element, text) {
    let i = 0;
    // Agregamos un salto de línea antes de la nueva entrada, si no está vacío
    if (element.textContent.trim() !== '') {
        element.textContent += '\n'; 
    }
    const startIndex = element.textContent.length;
    element.scrollTop = element.scrollHeight; 
    
    const speed = 25; // Velocidad de escritura
    
    function type() {
        if (i < text.length) {
            // Aseguramos que solo se añada el texto, manteniendo el contenido anterior
            element.textContent += text.charAt(i);
            i++;
            element.scrollTop = element.scrollHeight; 
            setTimeout(type, speed);
        } else {
            // Añadir el prompt de '>' después de que termine de escribir
            element.textContent += '\n\n>';
            element.scrollTop = element.scrollHeight;
        }
    }
    type();
}

// --- LÓGICA DE VALIDACIÓN DE CAMPOS ---
function validateField(input) {
    const name = input.name;
    const value = input.value.trim();
    let message = '';
    let isValid = true;
    
    if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    } else if (name === 'asunto') {
        isValid = value.length >= 3;
    } else if (name === 'mensaje') {
        isValid = value.length > 0;
    } else if (name === 'telefono') {
        const phoneRegex = /^\s*(?:\+?(\d{1,3}))?([-(]?(\d{3})[)-]?)?([ -]?(\d{4}))([ -]?(\d{4}))\s*$/;
        isValid = phoneRegex.test(value);
    }
    
    if (input.required && value === '') {
        isValid = false;
        message = 'ERROR: CAMPO REQUERIDO VACÍO.';
    } else if (isValid) {
        message = validationMessages[name].pass;
    } else {
        message = validationMessages[name].fail;
    }
    
    // Almacenar el estado de validación en el elemento input
    input.setAttribute('data-valid', isValid);
    
    typewriterEffect(feedbackTerminal, `>${name.toUpperCase()} STATUS:\n${message}`);
    return isValid;
}


// --- NUEVA FUNCIÓN: MANEJAR EL ENVÍO DEL FORMULARIO ---
function handleFormSubmit(e) {
    e.preventDefault(); // Detiene la recarga de la página

    let allFieldsValid = true;
    let requiredFieldsMissing = false;

    // 1. Recorre todos los inputs para forzar la validación final y verificar el estado
    formInputs.forEach(input => {
        // Ejecuta la validación de campo (esto también actualiza el atributo data-valid)
        const isValid = validateField(input);
        
        if (!isValid) {
            allFieldsValid = false;
            // Si es requerido y está vacío, es un error más grave
            if (input.required && input.value.trim() === '') {
                requiredFieldsMissing = true;
            }
        }
    });

    // 2. Reporta el resultado en la terminal
    if (allFieldsValid) {
        typewriterEffect(feedbackTerminal, 
            'VALIDACIÓN COMPLETA. TODOS LOS CAMPOS CORRECTOS.\n' + 
            'MENSAJE ENVIADO A LA BASE. ESPERE RESPUESTA.');
        
        // Opcional: limpiar el formulario después de un envío exitoso ficticio
        pipboyForm.reset(); 

    } else if (requiredFieldsMissing) {
         typewriterEffect(feedbackTerminal, 
            'FALLO DE ENVÍO: CAMPOS REQUERIDOS INCOMPLETOS O INVÁLIDOS.\n' + 
            'VERIFIQUE LA INFORMACIÓN E INTENTE DE NUEVO.');
    } else {
        typewriterEffect(feedbackTerminal, 
            'FALLO DE ENVÍO: ALGUNOS DATOS SON INVÁLIDOS.\n' + 
            'AJUSTE LOS PARÁMETROS Y VUELVA A INTENTAR.');
    }
}


// --- ESCUCHADORES DE LA TERMINAL ---
function setupTerminalListeners() {
    // 1. Escuchadores de validación al perder el foco (blur)
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });
    
    // 2. NUEVO: Escuchador para el evento de ENVÍO
    if (pipboyForm) {
        pipboyForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Mensaje inicial de la terminal
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