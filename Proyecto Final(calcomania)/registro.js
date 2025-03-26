import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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


function validarCampo(campo, mensaje) {
    if (!campo.trim()) return mensaje;
    return null;
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const correo = document.getElementById('email').value;
        let contraseña = document.getElementById("contraseña").value;
        const confirmarContraseña = document.getElementById("confirmar-contraseña").value;
        const fechaNacimiento = document.getElementById("fecha-nacimiento").value;
        const direccion = document.getElementById('direccion').value;
        const localidad = document.getElementById('localidad').value;

        // Validaciones
        const errores = [
            validarCampo(nombre, "El nombre no puede estar vacío."),
            validarCampo(apellido, "El apellido no puede estar vacío."),
            validarCampo(correo, "El correo no puede estar vacío."),
            validarCampo(direccion, "La dirección no puede estar vacía."),
            validarCampo(localidad, "La localidad no puede estar vacía."),
        ];

        if (contraseña !== confirmarContraseña) {
            errores.push("Las contraseñas no coinciden.");
        }

        if (contraseña.length < 8) {
            errores.push("La contraseña debe tener al menos 8 caracteres.");
        }

        const fechaSeleccionada = new Date(fechaNacimiento);
        const edad = new Date().getFullYear() - fechaSeleccionada.getFullYear();
        if (edad < 12) {
            errores.push("Debes tener al menos 12 años.");
        }

        if (errores.filter(error => error !== null).length > 0) {
            alert(errores.filter(error => error !== null).join("\n"));
            return;
        }

        // Hashear la contraseña antes de guardarla
        contraseña = CryptoJS.SHA256(contraseña).toString();

        try {
            await addDoc(collection(db, "usuarios"), {
                nombre,
                apellido,
                correo,
                contraseña,  
                direccion,
                localidad,
                fecha_nacimiento: fechaNacimiento,
                fecha_registro: serverTimestamp(),
            });

            alert("Registro exitoso.");
            
            document.querySelector("form").reset();
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            alert("Ocurrió un error al registrar el usuario. Intenta nuevamente.");
        }
    });
});