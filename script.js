const boton = document.getElementById("boton-saludo");
const mensaje = document.getElementById("mensaje");

boton.addEventListener("click", function () {
  mensaje.textContent = "Ahora si: hiciste clic en el boton.";
  mensaje.style.color = "green";
});
