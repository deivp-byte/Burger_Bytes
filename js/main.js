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
const totalItemsSpan = document.querySelectorAll('#cart-total-items'); // Corregido: Si hay varios, usaremos querySelectorAll
const sidebarFooter = document.querySelector('.sidebar-footer'); 
const totalAmountSpan = document.getElementById('cart-total-amount'); 
const mapToggleBtn = document.getElementById('toggle-map-btn');
const mapPlaceholder = document.querySelector('.map-placeholder');
const navLinks = document.querySelectorAll('.header ul li a'); 

// 2. Elementos para "Ver Más"
const loadMoreBtn = document.getElementById('load-more-btn');
const hideLessBtn = document.getElementById('hide-less-btn'); 
const sectionCardsContainer = document.querySelector('.section2');
const hiddenCards = document.querySelectorAll('.section2 .card-hidden'); 

// 3. Inicializa el contador y el array de items
let itemCount = 0;
let cartItems = []; 

// --- FUNCIONES CENTRALES DEL SITIO ---

function smoothScroll(event) {
    event.preventDefault(); 
    const targetId = event.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
            top: targetPosition, 
            behavior: 'smooth' 
        });
    }
}

function openSidebar() {
    cartSidebar.classList.add('open');
    document.body.classList.add('sidebar-open');
}

function closeSidebar() {
    cartSidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
}

function renderCart() {
    let totalAmount = 0; 
    let totalQuantity = 0; 

    cartCounter.innerHTML = `🛒 (${cartItems.length})`;
    cartList.innerHTML = ''; 

    if (cartItems.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Tu carrito está vacío.';
        cartList.appendChild(emptyMessage);
        sidebarFooter.style.display = 'none'; 
    } else {
        sidebarFooter.style.display = 'flex'; 

        cartItems.forEach((item, index) => {
            const itemTotal = item.unitPrice * item.count;
            totalAmount += itemTotal;
            totalQuantity += item.count;
            
            const listItem = document.createElement('li');
            const itemNameSpan = document.createElement('span');
            
            itemNameSpan.textContent = `${item.name} (x${item.count}) - ${itemTotal.toFixed(2)}€`; 
            listItem.appendChild(itemNameSpan);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = 'BORRAR';
            
            removeBtn.addEventListener('click', (event) => {
                event.stopPropagation(); 
                removeItem(index);
            });
            
            listItem.appendChild(removeBtn);
            cartList.appendChild(listItem);
        });
    }
    
    // Actualización de los span del total
    if (totalItemsSpan) totalItemsSpan.textContent = totalQuantity;
    if (totalAmountSpan) totalAmountSpan.textContent = totalAmount.toFixed(2) + '€';
}

function addItem(name) {
    const existingItem = cartItems.find(item => item.name === name);
    const price = PRODUCT_PRICES[name] || 0;

    if (existingItem) {
        existingItem.count += 1;
    } else {
        cartItems.push({
            name: name,
            count: 1,
            unitPrice: price
        });
    }

    renderCart();

    cartCounter.classList.add('bounce');
    setTimeout(() => {
        cartCounter.classList.remove('bounce');
    }, 500);
}

function removeItem(index) {
    cartItems.splice(index, 1); 
    renderCart();
}

function clearCart() {
    if (confirm('¿Estás seguro que quieres vaciar el carrito?')) {
        cartItems = []; 
        renderCart();   
    }
}

function toggleMap() {
    if (mapPlaceholder.style.display === 'flex') {
        mapPlaceholder.style.display = 'none';
        mapToggleBtn.textContent = 'Ver en Mapa (Pixel Mode)';
    } else {
        mapPlaceholder.style.display = 'flex';
        mapToggleBtn.textContent = 'Ocultar Mapa (Pixel Mode)';
    }
}

// LÓGICA DE "VER MÁS ARTÍCULOS" CON TRANSICIÓN SUAVE
function loadMoreItems() {
    // 1. Expande el contenedor principal suavemente
    if (sectionCardsContainer) {
        sectionCardsContainer.classList.add('expanded');
    }
    
    // 2. Muestra los elementos uno por uno con un retraso
    if (hiddenCards) {
        hiddenCards.forEach((card, index) => {
            card.style.display = 'flex'; 
            
            setTimeout(() => {
                card.classList.add('is-visible');
            }, 100 + index * 100); 
        });
    }

    // 3. Oculta el botón "Ver Más" y muestra "Ver Menos"
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    if (hideLessBtn) hideLessBtn.style.display = 'inline-block';
}

// LÓGICA: OCULTAR ARTÍCULOS
function hideLessItems() {
    // 1. Oculta los elementos extra (revierte la opacidad)
    if (hiddenCards) {
        hiddenCards.forEach((card) => {
            card.classList.remove('is-visible');
            
            // Ocultamos el display después de la transición de opacidad (400ms)
            setTimeout(() => {
                card.style.display = 'none';
            }, 400); 
        });
    }

    // 2. Colapsa el contenedor principal suavemente
    if (sectionCardsContainer) {
        sectionCardsContainer.classList.remove('expanded');
    }
    
    // 3. Oculta el botón "Ver Menos" y muestra "Ver Más"
    if (loadMoreBtn) loadMoreBtn.style.display = 'inline-block';
    if (hideLessBtn) hideLessBtn.style.display = 'none';
}


// --- Event Listeners ---

// 1. Aplica el desplazamiento suave a todos los enlaces del menú
navLinks.forEach(link => {
    link.addEventListener('click', smoothScroll);
});

// 2. Abrir la barra lateral
cartCounter.addEventListener('click', openSidebar);

// 3. Cerrar la barra lateral
closeSidebarBtn.addEventListener('click', closeSidebar);

// 4. VACIAR CARRITO
if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearCart);
}

// 5. Toggle del Mapa
if (mapToggleBtn) {
    mapToggleBtn.addEventListener('click', function(event) {
        event.preventDefault();
        toggleMap();
    });
}

// 6. Añadir productos
function setupAddButtons() {
    addButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); 
            
            const sectionContainer = button.closest('section');
            let productName = 'Producto Desconocido';

            if (sectionContainer.id === 'ofertas-section') {
                productName = 'Oferta de la Semana';
            } else {
                const h4Element = button.closest('.card-item').querySelector('h4');
                productName = h4Element ? h4Element.textContent : 'Producto Desconocido';
            }
            
            addItem(productName);
            openSidebar(); 
            
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 200);
        });
    });
}

// --- FUNCIÓN DE INICIALIZACIÓN GLOBAL ---
function initializePage() {
    // Se asegura de que los botones existan antes de asignar listeners
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreItems);
    }
    if (hideLessBtn) {
        hideLessBtn.addEventListener('click', hideLessItems);
    }
    
    setupAddButtons();
    renderCart();
}

// Inicializa la página y los listeners después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initializePage);