import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

// Referencia al formulario y los inputs
const form = document.getElementById("reset-form");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (newPassword === "" || confirmPassword === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Obtén el correo del usuario desde Local Storage
    const email = localStorage.getItem("emailUsuario");
    if (!email) {
        alert("No se pudo identificar al usuario. Intenta nuevamente.");
        return;
    }

    try {
        // Consulta para obtener al usuario desde el correo
        const usersRef = collection(db, "usuarios");
        const q = query(usersRef, where("correo", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("No se encontró el usuario asociado al correo.");
            return;
        }

        // Obtén el ID del documento del usuario
        let userId;
        querySnapshot.forEach((doc) => {
            userId = doc.id;
        });

        // Hashea la nueva contraseña
        const hashedPassword = CryptoJS.SHA256(newPassword).toString();

        // Actualiza la contraseña en la base de datos
        const userDocRef = doc(db, "usuarios", userId);
        await updateDoc(userDocRef, { contraseña: hashedPassword });

        alert("Contraseña actualizada exitosamente.");
        window.location.href = "login.html"; // Redirige al login
    } catch (error) {
        console.error("Error actualizando la contraseña:", error);
        alert("Ocurrió un error. Intenta nuevamente más tarde.");
    }
});
