document.addEventListener("DOMContentLoaded", () => {
    // Selección de elementos del DOM
    const contenedorCarritoVacio = document.getElementById("carrito-vacio");
    const contenedorCarritoProductos = document.getElementById("carrito-productos");
    const contenedorCarritoAcciones = document.getElementById("carrito-acciones");
    const contenedorCarritoComprado = document.getElementById("carrito-comprado");
    const totalCarrito = document.getElementById("total");
    const botonVaciarCarrito = document.getElementById("carrito-acciones-vaciar");
    const botonComprarCarrito = document.getElementById("carrito-acciones-comprar");

    // Cargar productos desde localStorage y mostrar en el carrito
    cargarProductosCarrito();

    // Función para cargar productos desde localStorage y mostrar en el carrito
    function cargarProductosCarrito() {
        const productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

        if (productosEnCarrito.length > 0) {
            contenedorCarritoVacio.classList.add("disabled");
            contenedorCarritoProductos.classList.remove("disabled");
            contenedorCarritoAcciones.classList.remove("disabled");
            contenedorCarritoComprado.classList.add("disabled");

            contenedorCarritoProductos.innerHTML = ""; // Limpiar contenido previo

            let total = 0;

            // Mostrar cada producto en el carrito
            productosEnCarrito.forEach(producto => {
                const div = document.createElement("div");
                div.classList.add("carrito-producto");
                div.innerHTML = `
                    <img class="carrito-producto-imagen" src="${producto.imageUrl}" alt="${producto.nombre}">
                    <div class="carrito-producto-titulo">
                        <small>Título</small>
                        <h3>${producto.nombre}</h3>
                    </div>
                    <div class="carrito-producto-cantidad">
                        <small>Cantidad</small>
                        <p>${producto.cantidad}</p>
                    </div>
                    <div class="carrito-producto-precio">
                        <small>Precio</small>
                        <p>$${producto.precio}</p>
                    </div>
                    <div class="carrito-producto-subtotal">
                        <small>Subtotal</small>
                        <p>$${producto.precio * producto.cantidad}</p>
                    </div>
                    <button class="carrito-producto-eliminar" data-id="${producto.id}" data-tamaño="${producto.tamaño}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                `;
                contenedorCarritoProductos.append(div);

                // Añadir evento de eliminación
                const botonEliminar = div.querySelector(".carrito-producto-eliminar");
                botonEliminar.addEventListener("click", () => eliminarProductoCarrito(producto.id, producto.tamaño));

                total += producto.precio * producto.cantidad;
            });

            // Actualizar el total del carrito
            totalCarrito.textContent = `$${total}`;
        } else {
            contenedorCarritoVacio.classList.remove("disabled");
            contenedorCarritoProductos.classList.add("disabled");
            contenedorCarritoAcciones.classList.add("disabled");
            contenedorCarritoComprado.classList.add("disabled");
        }
    }

    // Función para eliminar producto del carrito
    function eliminarProductoCarrito(id, tamaño) {
        let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        // Filtrar productos por ID y tamaño
        productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== id || producto.tamaño !== tamaño);
        localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));

        // Recargar el carrito después de eliminar un producto
        cargarProductosCarrito();
        actualizarContadorCarrito();
    }

    // Vaciar el carrito
    botonVaciarCarrito.addEventListener("click", () => {
        localStorage.removeItem("carrito");
        cargarProductosCarrito();  // Recargar el carrito vacío
        actualizarContadorCarrito();
    });

    // Comprar los productos (limpiar el carrito y mostrar mensaje de compra)
    botonComprarCarrito.addEventListener("click", () => {
        localStorage.removeItem("carrito");
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.remove("disabled");
        actualizarContadorCarrito();
    });

    // Función para actualizar el contador del carrito
    function actualizarContadorCarrito() {
        const numerito = document.getElementById('numerito');
        if (!numerito) return;

        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

        numerito.textContent = cantidadTotal;
    }
});
