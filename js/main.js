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
const mapToggleBtn = document.getElementById('toggle-map-btn');
const mapPlaceholder = document.querySelector('.map-placeholder');
const navLinks = document.querySelectorAll('.header ul li a'); 
const navLogo = document.querySelector('.fixed-navbar img'); // NUEVO: Logo

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
            
            // Añade efecto visual a los enlaces UL (si es necesario, aunque ya tienen CSS)
            // link.classList.add('clicked'); 
            // setTimeout(() => link.classList.remove('clicked'), 200);
        });
    });
}

// NUEVA FUNCIÓN: Manejar el clic del Logo para ir a Inicio
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


// LÓGICA: Alternar la vista del mapa/imagen (Se mantiene)
function toggleMap() {
    if (mapPlaceholder.style.display === 'none' || mapPlaceholder.style.display === '') {
        mapPlaceholder.style.display = 'flex';
        mapToggleBtn.textContent = 'Ocultar Mapa (Pixel Mode)';
    } else {
        mapPlaceholder.style.display = 'none';
        mapToggleBtn.textContent = 'Ver en Mapa (Pixel Mode)';
    }
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


// --- Event Listeners y Configuración Inicial ---

function setupListeners() {
    // Escuchadores del Carrito
    setupCartListeners();
    setupAddButtons(); 
    
    // Escuchadores de Navegación y Mapa
    setupNavLinks();
    if (mapToggleBtn) mapToggleBtn.addEventListener('click', toggleMap);
    
    // NUEVO: Escuchador para el logo (Vuelve a Inicio)
    if (navLogo) navLogo.addEventListener('click', handleLogoClick);

    // Escuchadores de la Carta (Ver Más/Menos)
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMoreItems);
    if (hideLessBtn) hideLessBtn.addEventListener('click', hideLessItems);
}


// Inicializa la página después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', setInitialLayout);