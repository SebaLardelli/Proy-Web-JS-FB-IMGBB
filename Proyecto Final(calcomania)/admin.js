// Importar las funciones necesarias desde Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBNcMYNr72-GnyuqHz9fZKK2hPFE3mlVPc",
    authDomain: "fir-javascript-calcomania.firebaseapp.com",
    projectId: "fir-javascript-calcomania",
    storageBucket: "fir-javascript-calcomania.firebasestorage.app",
    messagingSenderId: "870661766859",
    appId: "1:870661766859:web:095d6fd45d92058ea8654e"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funciones

//Cargar imagen
function cargarImagenAImgBB(archivo, callback) {
    const formData = new FormData();
    formData.append("image", archivo);

    const apiKey = "ed75328de649a3644f9c96f438260132";
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    fetch(url, { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                callback(data.data.url); // Pasar la URL al callback
            } else {
                alert("Error al cargar la imagen.");
            }
        })
        .catch(() => alert("Error al cargar la imagen."));
}

//Guardar productos en la base de datos 
function guardarProducto(urlImagen) {
    const producto = {
        nombre: document.getElementById('nombre-producto').value,
        tamaño: document.getElementById('tamano-producto').value,
        stock: parseInt(document.getElementById('stock-producto').value),
        precio: parseFloat(document.getElementById('precio-producto').value),
        descripción: document.getElementById('descripcion-producto').value,
        imageUrl: urlImagen,
    };

  
    addDoc(collection(db, "productos"), producto) // 
        .then(() => {
            alert("Producto guardado exitosamente.");
            resetearInputs();
            obtenerProductos();
        })
        .catch(() => alert("Error al guardar el producto."));
}

//Inputs
function resetearInputs() {
    const inputs = document.querySelectorAll('#formulario-producto input, #formulario-pr oducto textarea');
    inputs.forEach(input => {
        input.value = ''; // Vaciar el campo
        input.classList.remove('has-content'); // Eliminar clases relacionadas con estado
        input.blur(); // Perder el foco
    });

    document.getElementById('imagen-producto').removeAttribute('data-url'); // Eliminar URL previa de la imagen
    document.getElementById('boton-guardar').style.display = 'block';
    document.getElementById('boton-actualizar').style.display = 'none';
}


//Eliminar producto
function eliminarProducto(idProducto) {
    const productoDoc = doc(db, "productos", idProducto);
    deleteDoc(productoDoc)
        .then(() => {
            alert("Producto eliminado exitosamente.");
            obtenerProductos();
        })
        .catch(() => alert("Error al eliminar el producto."));
}


//Editar producto
function editarProducto(idProducto) {
    const productoDoc = doc(db, "productos", idProducto);
    getDoc(productoDoc)
        .then(docSnap => {
            if (docSnap.exists()) {
                const producto = docSnap.data();
                document.getElementById('nombre-producto').value = producto.nombre;
                document.getElementById('tamano-producto').value = producto.tamaño;
                document.getElementById('stock-producto').value = producto.stock;
                document.getElementById('precio-producto').value = producto.precio;
                document.getElementById('descripcion-producto').value = producto.descripción;
                document.getElementById('id-producto').value = idProducto;


                // Si tiene imagen, configurarla
                if (producto.imageUrl) {
                    document.getElementById('imagen-producto').setAttribute('data-url', producto.imageUrl);
                }


                // Simular el foco en los campos llenados
                const inputs = document.querySelectorAll('#formulario-producto input, #formulario-producto textarea');
                inputs.forEach(input => {
                    if (input.value.trim() !== "") {
                        input.classList.add('has-content');
                    }
                });

                document.getElementById('boton-guardar').style.display = 'none';
                document.getElementById('boton-actualizar').style.display = 'block';
            }
        })
        .catch(() => alert("Error al obtener el producto."));
}


//Guardar los cambios
function guardarCambiosProducto(idProducto, datosProducto) {
    const productoDoc = doc(db, "productos", idProducto); 
    updateDoc(productoDoc, datosProducto)
        .then(() => {
            alert("Producto actualizado exitosamente.");
            resetearInputs();
            obtenerProductos();
        })
        .catch(() => alert("Error al actualizar el producto."));
}

document.getElementById('boton-actualizar').addEventListener('click', function() {
    const idProducto = document.getElementById('id-producto').value;
    const archivo = document.getElementById('imagen-producto').files[0];
    const urlImagen = document.getElementById('imagen-producto').getAttribute('data-url') || null;

    const productoActualizado = {
        nombre: document.getElementById('nombre-producto').value,
        tamaño: document.getElementById('tamano-producto').value,
        stock: parseInt(document.getElementById('stock-producto').value),
        precio: parseFloat(document.getElementById('precio-producto').value),
        descripción: document.getElementById('descripcion-producto').value,
    };

    if (archivo) {
        cargarImagenAImgBB(archivo, (nuevaUrl) => {
            productoActualizado.imageUrl = nuevaUrl;
            guardarCambiosProducto(idProducto, productoActualizado);
        });
    } else {
        productoActualizado.imageUrl = urlImagen;
        guardarCambiosProducto(idProducto, productoActualizado);
    }
});

//Traer los productos
function obtenerProductos() {
    const listaProductos = document.getElementById('tabla-productos');
    listaProductos.innerHTML = ''; // Limpiar tabla antes de mostrar los nuevos productos

    getDocs(collection(db, "productos")) 
        .then(snapshot => {
            snapshot.forEach(doc => {
                const producto = doc.data();
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.tamaño}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.descripción}</td>
                    <td><img src="${producto.imageUrl}" alt="${producto.nombre}" width="50"></td>
                    <td>
                        <button onclick="editarProducto('${doc.id}')">Editar</button>
                        <button onclick="eliminarProducto('${doc.id}')">Eliminar</button>
                    </td>
                `;
                listaProductos.appendChild(fila);
            });
        })
        .catch(() => alert("Error al obtener los productos."));
}


// Exponer funciones globalmente
window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;

// Eventos
document.getElementById('formulario-producto').addEventListener('submit', function(event) {
    event.preventDefault();

    const archivo = document.getElementById('imagen-producto').files[0];
    if (!archivo) {
        alert("Selecciona una imagen.");
        return;
    }

    cargarImagenAImgBB(archivo, guardarProducto);
});

// Inicializar lista de productos al cargar la página
obtenerProductos();
