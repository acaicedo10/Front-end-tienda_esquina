// Ejecucion de datos al cargar la pagina
document.addEventListener("DOMContentLoaded", function () {
  if (!isAuthenticated()) {
    // Si no hay nadie logueado:
    document.querySelector(".OpnLog").style.display = "flex";
    document.querySelector(".PrfIcon").style.display = "none";
  } else {
    // Si hay un usuario logueado:
    obtenerDatosUsuario();
  }
});

function InicioReload() {
  location.reload();
}

// Autentificacion si existe un usuario logueado
function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token;
}

// CIERRA SESION

function cerrarSesion() {
  document.querySelector(".OpnLog").style.display = "flex";
  document.querySelector(".PrfIcon").style.display = "none";
  // Se remueve el token para que la validacion identifique que no hay nadie logueado
  localStorage.removeItem("token");
  setTimeout(function () {
    window.location.href = "index.html";
  }, 500);
}

const iniciarSesion = (event) => {
  const btnSubmit = document.querySelector(".login-button");
  btnSubmit.disabled = true;
  btnSubmit.value = "Cargando...";
  event.preventDefault();

  const datos = new FormData(event.target);

  const settings_api = {
    url: tunel + "/api/auth/login",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      email: datos.get("email_login"),
      password: datos.get("password_login"),
    }),
  };

  $.ajax(settings_api)
    .done(function (response) {
      btnSubmit.value = "Bienvenido!";
      localStorage.setItem("token", response.data.token);
      showToast(response.message, "success", 5000);
      setTimeout(function () {
        window.location.href = "index.html";
      }, 2000);
    })
    .fail(function (errorThrown) {
      btnSubmit.disabled = false;
      btnSubmit.value = "Iniciar";
      if (errorThrown.status >= 500) {
        // Alerta de error en el servidor, hecha con el archivo alerta
        showToast(errorThrown.responseJSON.message, "error");
      } else {
        showToast(errorThrown.responseJSON.message, "warning");
      }
    });
  return false;
};

const obtenerDatosUsuario = () => {
  // AQUI ESTAN LOS DATOS DEL USUARIO LOGUEADO "LAS VARIABLES"

  const token = localStorage.getItem("token");
  console.log(token);
  const settings_api = {
    url: tunel + "/api/users/profile",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "Bearer " + token,
      "ngrok-skip-browser-warning": "true",
    },
  };

  $.ajax(settings_api)
    .done(function (response) {
      // VARIABLES DE USUARIO LOGUEADO
      const nombreUsuario = response.data.profile.firstName;
      const apellidoUsuario = response.data.profile.lastName;
      const imgUsuario = response.data.profile.avatar; // Ninguno tiene imagenes pero hay esta
      const correoUsuario = response.data.email;
      const ultimavezLogeo = response.data.lastLogin; // La fecha de la ultima vez que se logeo el usuario


      // Variables del carrito de compras del usuario logueado:
      console.log("El usuario tenia un pedido antes?")
      const pedidoUsuario = response.data.cart.items; // Arreglo del pedido del usuario, osea los productos que piensa comprar el usuario
      
      if(pedidoUsuario.length > 0) {
        pedidoUsuario.forEach((element, i) => {
          console.log("Producto " + i+1 + " del pedido:");
          const nombreProducto = element.product.name; // Nombre del producto que el usuario quiere comprar
          const precioProducto = element.product.price.regular; // Precio del producto que el usuario quiere comprar
          const precioOfertaProducto = element.product.price.sale; // Precio de oferta del producto que el usuario quiere comprar, si no hay oferta este campo es null
          const descripcionProducto = element.product.description.short; // Descripcion corta del producto que el usuario quiere comprar
          const stockProducto = element.product.stock; // Cantidad de productos que existe para comprar
          const imgProducto = element.product.images[0].url; // Imagen del producto que el usuario quiere comprar, si el producto tiene mas de una imagen, esta es la primera
          const altImgProducto = element.product.images[0].alt; // Texto alternativo de la imagen del producto que el usuario quiere comprar, si el producto tiene mas de una imagen, esta es la primera
          const cantidadProducto = element.quantity; // Cantidad de productos que el usuario quiere comprar
          console.log(
            nombreProducto,
            precioProducto,
            precioOfertaProducto,
            descripcionProducto,
            stockProducto,
            imgProducto,
            altImgProducto,
            cantidadProducto
          );
          console.log("-----------------------------------");
        });
      }else{
        // Cuando el usuario recien logueado no tiene nada en el carrito
        console.log("No tenia")
      }
    })
    .fail(function (errorThrown) {
      if (errorThrown.status >= 500) {
        showToast(errorThrown.responseJSON.message, "error");
      } else {
        showToast(errorThrown.responseJSON.message, "warning");
      }
      localStorage.removeItem("token");
    });
};

//FIN INICIA Y CIERRA SESION

function AgregarCarrito() {
  const cantidadSpan = document.querySelector(".cantidad-car");
  if (cantidadSpan.textContent.trim() === "") {
    cantidadSpan.textContent = "1";
    cantidadSpan.style.display = "flex";
    return;
  }
  let cantidadActual =
    cantidadSpan.textContent === "99+"
      ? 99
      : parseInt(cantidadSpan.textContent, 10);

  cantidadActual++;

  if (cantidadActual > 99) {
    cantidadSpan.textContent = "99+";
  } else {
    cantidadSpan.textContent = cantidadActual;
  }
}

// MODALES FUNCIONES

function OpenContLogin() {
  document.querySelector(".cont-login-user").style.display = "flex";
}

function CloseLogin() {
  document.querySelector(".cont-login-user").style.display = "none";
}

function OpenCarShop() {
  document.querySelector(".cont-perfil-user").style.display = "none";
  document.querySelector(".cont-carrito-modal").style.display = "flex";
  document.querySelector(".cont-estructura").style.pointerEvents = "none";
  document.querySelector(".cont-carrito-modal").style.pointerEvents = "all";
}

function CloseCarShop() {
  document.querySelector(".cont-carrito-modal").style.display = "none";
  document.querySelector(".cont-estructura").style.pointerEvents = "all";
}

function OpenUserOptions() {
  document.querySelector(".cont-perfil-user").style.display = "flex";
  document.querySelector(".cont-carrito-modal").style.display = "none";
  document.querySelector(".cont-estructura").style.pointerEvents = "none";
  document.querySelector(".cont-perfil-user").style.pointerEvents = "all";
}

function CloseUserOptions() {
  document.querySelector(".cont-perfil-user").style.display = "none";
  document.querySelector(".cont-estructura").style.pointerEvents = "all";
}

// CONTROLADOR DE CANTIDAD DE PRONDUCTOS

function incrementarCantidad() {
  const inputCantidad = document.getElementById("cantidad");
  let cantidadActual = parseInt(inputCantidad.value, 10);
  inputCantidad.value = cantidadActual + 1;
}

function decrementarCantidad() {
  const inputCantidad = document.getElementById("cantidad");
  let cantidadActual = parseInt(inputCantidad.value, 10);

  if (cantidadActual > 1) {
    inputCantidad.value = cantidadActual - 1;
  }
}
