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
const sendCommandBtn = document.getElementById('send-command-btn');
const snakeByteBtn = document.getElementById('snake-byte-btn');     

const validationMessages = {
    'email': { pass: 'EMAIL OK. CONEXIÓN SEGURA.', fail: 'ERROR: FORMATO INVÁLIDO. REVISAR SINTAXIS.' },
    'asunto': { pass: 'ASUNTO OK. CONTINUANDO...', fail: 'ERROR: ASUNTO DEMASIADO CORTO O INVÁLIDO.' },
    'mensaje': { pass: 'MENSAJE OK. DATOS ALMACENADOS.', fail: 'ERROR: MENSAJE VACÍO.' },
    'telefono': { pass: 'TELÉFONO OK. CONTACTO ESTABLECIDO.', fail: 'ERROR: TELÉFONO INVÁLIDO O INCOMPLETO.' },
    'vacio': 'ERROR: CAMPO REQUERIDO VACÍO.' 
};

// 2. Elementos para "Ver Más"
const loadMoreBtn = document.getElementById('load-more-btn');
const hideLessBtn = document.getElementById('hide-less-btn'); 
const sectionCardsContainer = document.querySelector('.section2');
const allCards = document.querySelectorAll('.section2 .card-item');

// 3. Inicializa el contador
let cartItems = []; 
let initializationAttempts = 0; 

function setInitialLayout() {
    if (initializationAttempts >= 10) {
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

// --- LÓGICA DE CARRITO Y NAVEGACIÓN ---
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
    } else if (!price) return;

    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) existingItem.quantity++;
    else cartItems.push({ name, price, quantity: 1 });
    
    renderCart();
}

function removeItem(name) {
    const itemIndex = cartItems.findIndex(item => item.name === name);
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity--;
        if (cartItems[itemIndex].quantity === 0) cartItems.splice(itemIndex, 1);
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
        if (h4Element) productName = h4Element.textContent.trim();
        else return;
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

function smoothScroll(target) {
    const element = document.querySelector(target);
    const fixedNavbar = document.querySelector('.fixed-navbar');
    const fixedNavbarHeight = fixedNavbar ? fixedNavbar.offsetHeight : 0; 
    let targetY = 0;
    if (target !== 'body') targetY = element ? element.offsetTop - fixedNavbarHeight : 0;
    
    window.scrollTo({ top: targetY, behavior: 'smooth' });
}

function setupNavLinks() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScroll(this.getAttribute('href'));
        });
    });
}

function handleLogoClick(e) {
    e.preventDefault(); 
    e.target.classList.add('clicked');
    smoothScroll('body');
    setTimeout(() => e.target.classList.remove('clicked'), 200); 
}

function loadMoreItems() {
    if (!sectionCardsContainer) return;
    sectionCardsContainer.classList.remove('collapsed');
    sectionCardsContainer.classList.add('expanded');
    
    const hiddenCardsToReveal = document.querySelectorAll('.section2 .hidden-item');
    hiddenCardsToReveal.forEach((card, index) => {
        card.style.display = 'flex'; 
        setTimeout(() => card.classList.add('is-visible'), 50 + index * 100); 
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

function hideLessItems() {
    if (!sectionCardsContainer) return;
    sectionCardsContainer.classList.remove('expanded');
    sectionCardsContainer.classList.add('collapsed');

    const cardsToHide = document.querySelectorAll('.section2 .hidden-item');
    cardsToHide.forEach((card) => {
        card.classList.remove('is-visible');
        setTimeout(() => card.style.display = 'none', 400); 
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

// --- TERMINAL ---
function initTerminalTypewriter() {
    if (!feedbackTerminal) return;
    const textToType = feedbackTerminal.textContent.trim();
    feedbackTerminal.textContent = '';
    
    let i = 0;
    const speed = 25; 

    function type() {
        if (i < textToType.length) {
            feedbackTerminal.textContent += textToType.charAt(i);
            i++;
            feedbackTerminal.scrollTop = feedbackTerminal.scrollHeight; 
            setTimeout(type, speed);
        }
    }
    setTimeout(type, 500); 
}

function setupTerminalListeners() {
    initTerminalTypewriter();
}


// --- NUEVA LÓGICA ROBUSTA PARA EL MODAL DE BORRADO ---
function setupModalListeners() {
    let formToSubmit = null; 
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    
    if(!deleteModal) return;

    // CAMBIO CLAVE: Escuchamos el CLIC en lugar del SUBMIT
    document.addEventListener('click', function(e) {
        // Comprobamos si lo que se ha clicado es exactamente el botón de la 'X'
        if (e.target && e.target.classList.contains('remove-btn')) {
            // Comprobamos si este botón 'X' está dentro de un formulario de borrado
            const parentForm = e.target.closest('.delete-form');
            
            if (parentForm) {
                e.preventDefault(); // ¡FRENAMOS EL CLIC EN SECO!
                formToSubmit = parentForm; // Guardamos el formulario en memoria
                deleteModal.classList.remove('hidden'); // Mostramos la alerta retro
            }
        }
    });

    // Botón de Cancelar
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.classList.add('hidden'); 
            formToSubmit = null; 
        });
    }

    // Botón de Confirmar Purga
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (formToSubmit) {
                // Inyectamos la señal secreta para que el PHP lo procese
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'delete_consulta';
                hiddenInput.value = '1';
                formToSubmit.appendChild(hiddenInput);
                
                // ¡Fuego! Enviamos el borrado
                formToSubmit.submit(); 
            }
        });
    }
}

// --- Event Listeners y Configuración Inicial ---
function setupListeners() {
    setupCartListeners();
    setupAddButtons(); 
    setupNavLinks();
    if (navLogo) navLogo.addEventListener('click', handleLogoClick);
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMoreItems);
    if (hideLessBtn) hideLessBtn.addEventListener('click', hideLessItems);
    setupTerminalListeners();
    
    // INICIAR EL MODAL AQUÍ (Asegura que el HTML ya cargó completo)
    setupModalListeners();
}

document.addEventListener('DOMContentLoaded', setInitialLayout);