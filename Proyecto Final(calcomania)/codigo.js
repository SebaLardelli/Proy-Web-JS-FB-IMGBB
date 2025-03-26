// Función para obtener el código desde localStorage 
let codigoGuardado = localStorage.getItem("codigoVerificacion");

if (!codigoGuardado) {
    codigoGuardado = generarCodigoAleatorio(6);
    localStorage.setItem("codigoVerificacion", codigoGuardado);
}

// Mostrar el código de verificación en la página
document.getElementById("codigo-aleatorio").textContent = codigoGuardado;

// Manejar el formulario de verificación
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const otpInputs = document.querySelectorAll(".otp-inputs input");
    let codigoIngresado = "";

    // Concatenar los valores de los inputs para formar el código completo
    otpInputs.forEach(input => {
        codigoIngresado += input.value;
    });

    // Verificar si el código ingresado coincide con el guardado
    if (codigoIngresado === codigoGuardado) {
        alert("Código verificado correctamente. Puedes proceder a cambiar tu contraseña.");

        // Redirigir 
        window.location.href = "nueva.html";
    } else {
        alert("El código ingresado es incorrecto. Intenta nuevamente.");
    }
});

// Función para mover el foco al siguiente input
function moveToNext(current, nextId) {
    if (current.value.length === 1) {
        document.getElementById(nextId).focus();
    }
}

