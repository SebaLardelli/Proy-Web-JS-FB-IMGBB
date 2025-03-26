import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBNcMYNr72-GnyuqHz9fZKK2hPFE3mlVPc",
    authDomain: "fir-javascript-calcomania.firebaseapp.com",
    projectId: "fir-javascript-calcomania",
    storageBucket: "fir-javascript-calcomania.firebasestorage.app",
    messagingSenderId: "870661766859",
    appId: "1:870661766859:web:095d6fd45d92058ea8654e"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Validar los campos
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#login-button").addEventListener("click", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        // Hashear la contraseña ingresada (Usar Hexadecimal)
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);  // Hasheamos la contraseña en formato hexadecimal

        try {
            // Obtener la colección de usuarios
            const usuariosRef = collection(db, "usuarios");
            const q = query(usuariosRef, where("correo", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert("El usuario no está registrado.");
                return;
            }

            // El usuario existe, obtenemos la contraseña guardada
            const usuario = querySnapshot.docs[0].data();
            const storedPassword = usuario.contraseña;  // Contraseña hasheada guardada en Firebase

            // Comparar las contraseñas hasheadas
            if (hashedPassword === storedPassword) {
                // Contraseña correcta, guardamos los datos del usuario en localStorage
                localStorage.setItem("usuario", JSON.stringify({
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    correo: usuario.correo
                }));
                
                // Redirigir a la página principal
                window.location.href = "index.html";
            } else {
                // Contraseña incorrecta
                alert("La contraseña es incorrecta.");
            }

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Hubo un error al iniciar sesión. Intenta nuevamente.");
        }
    });
});

//Recordar contraseña
document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberMeCheckbox = document.getElementById("remember-me");

    // Cargar datos guardados al cargar la página
    if (localStorage.getItem("rememberMe") === "true") {
        emailInput.value = localStorage.getItem("email") || "";
        passwordInput.value = localStorage.getItem("password") || "";
        rememberMeCheckbox.checked = true;

        // Mantener la clase "has-content" si hay datos
        if (emailInput.value.trim() !== "") {
            emailInput.classList.add("has-content");
        }
        if (passwordInput.value.trim() !== "") {
            passwordInput.classList.add("has-content");
        }
    }

    // Guardar datos al marcar/desmarcar el checkbox
    rememberMeCheckbox.addEventListener("change", () => {
        if (rememberMeCheckbox.checked) {
            localStorage.setItem("email", emailInput.value);
            localStorage.setItem("password", passwordInput.value);
            localStorage.setItem("rememberMe", "true");
        } else {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
            localStorage.setItem("rememberMe", "false");
        }
    });

    // Actualizar los datos 
    emailInput.addEventListener("input", () => {
        toggleFocus(emailInput);
        if (rememberMeCheckbox.checked) {
            localStorage.setItem("email", emailInput.value);
        }
    });

    passwordInput.addEventListener("input", () => {
        toggleFocus(passwordInput);
        if (rememberMeCheckbox.checked) {
            localStorage.setItem("password", passwordInput.value);
        }
    });
});

// Función para alternar la clase "has-content"
function toggleFocus(input) {
    if (input.value.trim() === "") {
        input.classList.remove("has-content");
    } else {
        input.classList.add("has-content");
    }
}
