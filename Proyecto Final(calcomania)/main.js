import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"; 
import { getFirestore, collection, getDocs, addDoc} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBNcMYNr72-GnyuqHz9fZKK2hPFE3mlVPc",
    authDomain: "fir-javascript-calcomania.firebaseapp.com",
    projectId: "fir-javascript-calcomania",
    storageBucket: "fir-javascript-calcomania.firebasestorage.app",
    messagingSenderId: "870661766859",
    appId: "1:870661766859:web:095d6fd45d92058ea8654e"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Manejo de inicio y cierre de sesión
document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link"); // Enlace de "Iniciar sesión"
    const user = JSON.parse(localStorage.getItem('usuario')); // Obtener el usuario desde localStorage
    const productosAgregarBtns = document.querySelectorAll('.producto-agregar'); // Botones de agregar al carrito

    if (user) {
        // Usuario autenticado
        loginLink.style.display = "none"; // Ocultar el enlace de inicio de sesión

        // Crear el contenido con el nombre y apellido del usuario, y el botón de cerrar sesión
        const userSection = document.createElement('li');
        userSection.innerHTML = `
            <span>Bienvenido, ${user.nombre} ${user.apellido}</span>
            <button id="logout-btn" class="btn btn-outline-danger">
                <i class="bi bi-box-arrow-right"></i> Cerrar sesión
            </button>
        `;
        
        // Insertar el contenido en el lugar adecuado
        loginLink.parentElement.insertBefore(userSection, loginLink.nextSibling);

        // Habilitar los botones de agregar al carrito
        productosAgregarBtns.forEach(btn => btn.disabled = false);

        // Manejar el cierre de sesión
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('usuario');
            window.location.reload(); // Recargar la página después de cerrar sesión
        });
    } else {
        // Usuario no autenticado
        loginLink.style.display = "block"; // Mostrar el enlace de inicio de sesión

        productosAgregarBtns.forEach(btn => {
            btn.disabled = true;
            btn.addEventListener('click', () => alert('Debes iniciar sesión para agregar productos al carrito.'));
        });
    }
});

// Función para filtrar productos por categoría
function filtrarProductos(categoria) {
    const listaProductos = document.getElementById('contenedor-productos');
    listaProductos.innerHTML = ''; // Limpiar la lista de productos antes de cargar nuevos

    // Deshabilitar botones mientras se cargan los productos
    document.querySelectorAll('.boton-categoria').forEach(boton => {
        boton.disabled = true;
    });

    getDocs(collection(db, "productos"))
        .then(snapshot => {
            const productosAgrupados = {};

            snapshot.forEach(doc => {
                const producto = doc.data();

                // Filtrar productos según la categoría
                let mostrarProducto = false;
                if (categoria === 'todos') {
                    mostrarProducto = true;
                } else if (categoria === 'categoria1' && producto.descripción.toLowerCase().includes('calcomania')) {
                    mostrarProducto = true;
                } else if (categoria === 'categoria2' && producto.descripción.toLowerCase().includes('pack')) {
                    mostrarProducto = true;
                }

                // Si el producto debe ser mostrado
                if (mostrarProducto) {
                    if (!productosAgrupados[producto.nombre]) {
                        productosAgrupados[producto.nombre] = [];
                    }
                    productosAgrupados[producto.nombre].push({
                        id: doc.id,
                        ...producto
                    });
                }
            });

            // Renderizar productos agrupados
            Object.keys(productosAgrupados).forEach(nombre => {
                const variantes = productosAgrupados[nombre];
                const primeraVariante = variantes[0];

                const fila = document.createElement('div');
                fila.classList.add('producto-item');
                fila.dataset.nombre = nombre;

                // Crear menú desplegable solo si alguna variante tiene un tamaño distinto de "no"
                const tieneSeleccion = variantes.some(variante => variante.tamaño.toLowerCase() !== 'no');
                const selectHtml = tieneSeleccion ? `
                    <p class="texto-seleccionar-tamano">Seleccionar tamaño</p>
                    <select class="producto-tamano">
                        ${variantes.filter(variante => variante.tamaño.toLowerCase() !== 'no').map(variante => `
                            <option value="${variante.id}" data-precio="${variante.precio}" 
                                data-image="${variante.imageUrl}">
                                ${variante.tamaño}
                            </option>
                        `).join('')}
                    </select>
                ` : '';

                fila.innerHTML = `
                    <img class="producto-imagen" src="${primeraVariante.imageUrl}" alt="${nombre}">
                    <div class="producto-detalles">
                        <h3 class="producto-titulo">${nombre}</h3>
                        <p class="producto-precio">Precio: $${primeraVariante.precio}</p>
                        ${selectHtml}
                        <button class="producto-agregar" data-id="${primeraVariante.id}" data-nombre="${nombre}" data-precio="${primeraVariante.precio}" data-image="${primeraVariante.imageUrl}">Agregar</button>
                    </div>
                `;

                listaProductos.appendChild(fila);
            });
        })
        .catch(() => alert("Error al obtener los productos."))
        .finally(() => {
            // Volver a habilitar los botones después de cargar los productos
            document.querySelectorAll('.boton-categoria').forEach(boton => {
                boton.disabled = false;
            });
        });
}

// Agregar manejadores de eventos a los botones de categorías
document.querySelectorAll('.boton-categoria').forEach(boton => {
    boton.addEventListener('click', (event) => {
        // Quitar la clase 'active' de todos los botones y asignarla al seleccionado
        document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Cambiar el título del h2 según la categoría seleccionada
        const tituloPrincipal = document.getElementById('titulo-principal');
        if (event.target.id === 'categoria1') {
            tituloPrincipal.textContent = 'Calcomanias';
        } else if (event.target.id === 'categoria2') {
            tituloPrincipal.textContent = 'Packs';
        } else {
            tituloPrincipal.textContent = 'Todos los productos';
        }

        // Filtrar productos según la categoría seleccionada
        filtrarProductos(event.target.id);
    });
});

// Manejar el cambio de tamaño
document.getElementById('contenedor-productos').addEventListener('change', function(event) {
    if (event.target && event.target.classList.contains('producto-tamano')) {
        const fila = event.target.closest('.producto-item');
        const precio = event.target.selectedOptions[0].dataset.precio;
        const imagen = event.target.selectedOptions[0].dataset.image;

        // Actualizar los detalles del producto en la UI
        fila.querySelector('.producto-precio').textContent = `Precio: $${precio}`;
        fila.querySelector('.producto-imagen').src = imagen;
    }
});

// Cargar todos los productos por defecto al cargar la página
window.onload = () => {
    const titulo = document.getElementById('titulo-principal');
    titulo.textContent = 'Todos los productos'; 
    filtrarProductos('todos');
};

// Función para agregar un producto nuevo a Firestore
function agregarProducto(producto) {
    addDoc(collection(db, "productos"), producto)
        .then(() => {
            alert("Producto agregado exitosamente.");
            filtrarProductos('todos');
        })
        .catch(() => alert("Error al agregar el producto."));
}

// Función para manejar el formulario de agregar producto
document.getElementById('formulario-producto')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const archivo = document.getElementById('imagen-producto')?.files[0];
    if (!archivo) {
        alert("Selecciona una imagen.");
        return;
    }

    cargarImagenAImgBB(archivo, (urlImagen) => {
        const producto = {
            imageUrl: urlImagen,
            tamaño: 'no'
        };

        agregarProducto(producto);
    });
});

// Agregar producto al carrito cuando se hace clic en el botón 'Agregar'
document.getElementById('contenedor-productos').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('producto-agregar')) {
        const user = JSON.parse(localStorage.getItem('usuario')); // Verificar si hay un usuario logueado

        if (!user) {
            // Si no hay usuario logueado, mostrar mensaje
            alert('Debes iniciar sesión para agregar productos al carrito.');
        } else {
            // Obtener el tamaño seleccionado
            const selectTamaño = event.target.closest('.producto-item').querySelector('.producto-tamano');
            const selectedOption = selectTamaño ? selectTamaño.selectedOptions[0] : null;
            const precio = selectedOption ? selectedOption.dataset.precio : event.target.dataset.precio;
            const imagen = selectedOption ? selectedOption.dataset.image : event.target.dataset.image;

            // Crear el producto con el tamaño y el precio 
            const producto = {
                id: event.target.dataset.id,
                nombre: event.target.dataset.nombre,
                precio: precio, // Usar el precio seleccionado
                imageUrl: imagen, // Usar la imagen seleccionada
                tamaño: selectedOption ? selectedOption.value : 'no' // Obtener el tamaño seleccionado
            };

            // Agregar el producto al carrito
            agregarAlCarrito(producto);
        }
    }
});
// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Buscar si ya existe un producto con el mismo nombre y tamaño
    const index = carrito.findIndex(item => item.nombre === producto.nombre && item.tamaño === producto.tamaño);

    if (index === -1) {
        // Si no existe, agregarlo al carrito
        producto.cantidad = 1;
        carrito.push(producto);
    } else {
        // Si existe, solo incrementar la cantidad
        carrito[index].cantidad++;
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito(); // Actualizar el contador del carrito
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const numerito = document.getElementById('numerito');
    if (!numerito) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

    numerito.textContent = cantidadTotal;
}

// Cargar el contador del carrito al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
});