let carritoVisible = false;

$(document).ready(function() {
    ready();
});

function ready() {
    $('.btn-eliminar').click(eliminarItemCarrito);
    $('.sumar-cantidad').click(sumarCantidad);
    $('.restar-cantidad').click(restarCantidad);
    $('.boton-item').click(agregarAlCarritoClicked);
    $('.btn-pagar').click(pagarClicked);


}

function pagarClicked() {
    alert("Gracias por la compra");
    let carritoItems = $('.carrito-items');
    carritoItems.empty();
    actualizarTotalCarrito();
    ocultarCarrito();
    saveCartToLocalStorage();
}

function agregarAlCarritoClicked(event) {
    let button = $(event.target);
    let item = button.closest('.item');
    let titulo = item.find('.titulo-item').text();
    let precio = item.find('.precio-item').text();
    let imagenSrc = item.find('.img-item').attr('src');
    console.log(imagenSrc);

    agregarItemAlCarrito(titulo, precio, imagenSrc);

    hacerVisibleCarrito();
    saveCartToLocalStorage();
}

function hacerVisibleCarrito() {
    carritoVisible = true;
    let carrito = $('.carrito');
    carrito.css({ marginRight: '0', opacity: '1' });

    let items = $('.contenedor-items');
    items.css('width', '60%');
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    let itemsCarrito = $('.carrito-items');

    let nombresItemsCarrito = itemsCarrito.find('.carrito-item-titulo');
    for (let i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito.eq(i).text() == titulo) {
            alert("El item ya se encuentra en el carrito");
            return;
        }
    }

    let itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;

    let item = $(itemCarritoContenido);
    itemsCarrito.append(item);

    item.find('.btn-eliminar').click(eliminarItemCarrito);
    item.find('.restar-cantidad').click(restarCantidad);
    item.find('.sumar-cantidad').click(sumarCantidad);

    actualizarTotalCarrito();
}

function sumarCantidad(event) {
    let buttonClicked = $(event.target);
    let selector = buttonClicked.closest('.selector-cantidad');
    let cantidadActual = parseInt(selector.find('.carrito-item-cantidad').val());
    cantidadActual++;
    selector.find('.carrito-item-cantidad').val(cantidadActual);
    actualizarTotalCarrito();
    saveCartToLocalStorage();
}

function restarCantidad(event) {
    let buttonClicked = $(event.target);
    let selector = buttonClicked.closest('.selector-cantidad');
    let cantidadActual = parseInt(selector.find('.carrito-item-cantidad').val());
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.find('.carrito-item-cantidad').val(cantidadActual);
        actualizarTotalCarrito();
        saveCartToLocalStorage();
    }
}

function eliminarItemCarrito(event) {
    let buttonClicked = $(event.target).closest('.btn-eliminar');
    buttonClicked.closest('.carrito-item').remove();
    actualizarTotalCarrito();
    ocultarCarrito();
    saveCartToLocalStorage();
}

function ocultarCarrito() {
    let carritoItems = $('.carrito-items');
    console.log('Number of items in cart:', carritoItems.children().length);
    if (carritoItems.children().length === 0) {
        let carrito = $('.carrito');
        carrito.css({ marginRight: '-100%', opacity: '0' });
        carritoVisible = false;

        let items = $('.contenedor-items');
        items.css('width', '100%');
    }
}

function actualizarTotalCarrito() {
    let carritoItems = $('.carrito-item');
    let total = 0;

    carritoItems.each(function() {
        let item = $(this);
        let precioElemento = item.find('.carrito-item-precio');
        let precio = parseFloat(precioElemento.text().replace('$', '').replace('.', ''));
        let cantidadItem = item.find('.carrito-item-cantidad').val();
        total += (precio * cantidadItem);
    });

    total = Math.round(total * 100) / 100;
    $('.carrito-precio-total').text('$' + total.toLocaleString("es") + ",00");
}

function saveCartToLocalStorage() {
    let cartItems = [];
    $('.carrito-item').each(function() {
        let item = $(this);
        let title = item.find('.carrito-item-titulo').text();
        let price = item.find('.carrito-item-precio').text();
        let quantity = item.find('.carrito-item-cantidad').val();
        cartItems.push({ title, price, quantity });
    });

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCartFromJSON() {
    fetch('json/productos.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                console.log('Item loaded from JSON:', item.title, item.price);
                agregarItemAlCarrito(item.title, item.price, item.imageSrc);
                let lastCartRow = $('.carrito-item').last();
                lastCartRow.find('.carrito-item-cantidad').val(item.quantity);
            });
            actualizarTotalCarrito();
        })
        .catch(error => console.error('Error al cargar el carrito:', error));
}


function loadCartFromLocalStorage() {
    let savedCartItems = JSON.parse(localStorage.getItem('cartItems'));

    if (savedCartItems) {
        savedCartItems.forEach(item => {
            agregarItemAlCarrito(item.title, item.price, '');
            let lastCartRow = $('.carrito-item').last();
            lastCartRow.find('.carrito-item-cantidad').val(item.quantity);
        });

        actualizarTotalCarrito();
    }
}
