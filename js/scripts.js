document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el envío del formulario

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Aquí puedes agregar la lógica para enviar los datos a un servidor o procesarlos
    console.log("Nombre:", name);
    console.log("Correo Electrónico:", email);
    console.log("Mensaje:", message);

    // Limpiar el formulario después de enviar
    form.reset();
    alert("¡Gracias por tu mensaje!");
  });
});
