import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Configuración e inicialización de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBNcMYNr72-GnyuqHz9fZKK2hPFE3mlVPc",
    authDomain: "fir-javascript-calcomania.firebaseapp.com",
    projectId: "fir-javascript-calcomania",
    storageBucket: "fir-javascript-calcomania.firebasestorage.app",
    messagingSenderId: "870661766859",
    appId: "1:870661766859:web:095d6fd45d92058ea8654e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Event listener para el envío del formulario
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.querySelector("input[type='email']");
    const email = emailInput.value.trim();

    if (email === "") {
        alert("Por favor, ingresa tu correo electrónico.");
        return;
    }

    try {
        const usersRef = collection(db, "usuarios"); 
        const q = query(usersRef, where("correo", "==", email)); 
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Genera un código alfanumérico de 6 caracteres
            const codigo = generarCodigoAleatorio(6);

            // Guarda el código en Local Storage para usarlo en codigo.html
            localStorage.setItem("codigoVerificacion", codigo);

            // Redirige a la página de código
            window.location.href = "codigo.html";
        } else {
            alert("El correo electrónico no está registrado.");
        }
    } catch (error) {
        console.error("Error verificando el correo:", error);
        alert("Ocurrió un error. Intenta nuevamente más tarde.");
    }
});

// Función para generar un código alfanumérico aleatorio de 6 caracteres
function generarCodigoAleatorio(longitud) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let codigo = "";
    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[indice];
    }
    return codigo;
}


//Guardar el email en local storage 
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.querySelector("input[type='email']");
    const email = emailInput.value.trim();

    if (email === "") {
        alert("Por favor, ingresa tu correo electrónico.");
        return;
    }

    try {
        const usersRef = collection(db, "usuarios");
        const q = query(usersRef, where("correo", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Guarda el correo en Local Storage
            localStorage.setItem("emailUsuario", email);

            // Genera un código alfanumérico de 6 caracteres
            const codigo = generarCodigoAleatorio(6);

            // Guarda el código en Local Storage para usarlo en codigo.html
            localStorage.setItem("codigoVerificacion", codigo);

            // Redirige a la página de código
            window.location.href = "codigo.html";
        } else {
            alert("El correo electrónico no está registrado.");
        }
    } catch (error) {
        console.error("Error verificando el correo:", error);
        alert("Ocurrió un error. Intenta nuevamente más tarde.");
    }
});

// Selecciónar el input
const emailInput = document.getElementById("email-input");

// Almacenar el valor
emailInput.addEventListener("input", () => {
    localStorage.setItem("email-input", emailInput.value);
});

// Establecer el foco al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("email-input");
    if (savedEmail) {
        emailInput.value = savedEmail;
        emailInput.classList.add("has-content"); // Aplicar si tiene contenido
        emailInput.focus(); 
    }
});
