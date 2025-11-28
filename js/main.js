// main.js

// 1. Obtiene los elementos del DOM (Carrito)
const cartCounter = document.getElementById('cart-counter');
const cartSidebar = document.getElementById('cart-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const clearAllBtn = document.getElementById('clear-all-btn'); 
const cartList = document.getElementById('cart-list');
const addButtons = document.querySelectorAll('.add-to-cart-btn');
const totalItemsSpan = document.getElementById('cart-total-items');
const sidebarFooter = document.querySelector('.sidebar-footer'); 

// 1. Obtiene los elementos del DOM (Mapa)
const mapToggleBtn = document.getElementById('toggle-map-btn');
const mapPlaceholder = document.querySelector('.map-placeholder'); 

// 2. Inicializa el contador y el array de items
let itemCount = 0;
let cartItems = [];

// --- Funciones de Apertura/Cierre de la Barra Lateral ---

function openSidebar() {
    cartSidebar.classList.add('open');
}

function closeSidebar() {
    cartSidebar.classList.remove('open');
}

// --- Funciones de Lógica del Carrito ---

function renderCart() {
    itemCount = cartItems.length;
    cartCounter.innerHTML = `🛒 (${itemCount})`;
    totalItemsSpan.textContent = itemCount;

    cartList.innerHTML = ''; 

    if (itemCount === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Tu carrito está vacío.';
        cartList.appendChild(emptyMessage);
        
        // Oculta el footer (Total/Botones) si no hay items
        sidebarFooter.style.display = 'none'; 
    } else {
        sidebarFooter.style.display = 'flex'; // Usamos flex para la disposición vertical

        cartItems.forEach((item, index) => {
            const listItem = document.createElement('li');
            
            const itemNameSpan = document.createElement('span');
            itemNameSpan.className = 'item-name';
            itemNameSpan.textContent = item.name;
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
}

function addItem(name) {
    cartItems.push({ id: Date.now(), name: name });
    renderCart();

    // Efecto visual de rebote en el contador
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

// --- Lógica de Mapa Interactivo ---

function toggleMap() {
    if (mapPlaceholder.style.display === 'flex') {
        // Si es visible, lo oculta
        mapPlaceholder.style.display = 'none';
        mapToggleBtn.textContent = 'Ver en Mapa (Pixel Mode)';
    } else {
        // Si está oculto, lo muestra
        mapPlaceholder.style.display = 'flex';
        mapToggleBtn.textContent = 'Ocultar Mapa (Pixel Mode)';
    }
}

// --- Event Listeners ---

// 1. Abrir la barra lateral
cartCounter.addEventListener('click', openSidebar);

// 2. Cerrar la barra lateral
closeSidebarBtn.addEventListener('click', closeSidebar);

// 3. VACIAR CARRITO
if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearCart);
}

// 4. Toggle del Mapa
if (mapToggleBtn) {
    mapToggleBtn.addEventListener('click', function(event) {
        event.preventDefault();
        toggleMap();
    });
}

// 5. Añadir productos
addButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); 
        
        const sectionContainer = button.closest('section');
        let productName = 'Producto Desconocido';

        if (sectionContainer.id === 'ofertas-section') {
            // CORRECCIÓN: Captura el nombre específico de la oferta
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

// Inicializa el renderizado al cargar la página
renderCart();