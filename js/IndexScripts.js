// Ejecucion de datos al cargar la pagina
document.addEventListener("DOMContentLoaded", function () {
  if (!isAuthenticated()) {
    // Si no hay nadie logueado:
    document.querySelector(".OpnLog").style.display = "flex";
    document.querySelector(".iconcarrito").style.display = "none";
    document.querySelector(".PrfIcon").style.display = "none";
  } else {
    // Si hay un usuario logueado:
    obtenerDatosUsuario();
  }
  obtenerProductos();
  obtenerCategorias();
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
  document.querySelector(".iconcarrito").style.display = "none";
  // Se remueve el token para que la validacion identifique que no hay nadie logueado
  localStorage.removeItem("token");
  setTimeout(function () {
    window.location.href = "index.html";
  }, 10);
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
        document.querySelector(".iconcarrito").style.display = "flex";
      }, 1000);
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
  const contCardCarrito = document.querySelector(".cont-carrito");
  const token = localStorage.getItem("token");
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

      //OK AQUI COLOCO EL NOMBRE QUE ES LO UNICO QUE NECESITABA V:
      const ModalDatosUser = document.querySelector(".cont-data-user");
      ModalDatosUser.innerHTML = "";
      var contDataUser = `              <i class="fa-solid fa-circle-user"></i>
              <div class="nameuser-text">${nombreUsuario} ${apellidoUsuario}</div>
`;
      ModalDatosUser.innerHTML += contDataUser;

      // Variables del carrito de compras del usuario logueado:
      const pedidoUsuario = response.data.cart.items; // Arreglo del pedido del usuario, osea los productos que piensa comprar el usuario

      if (pedidoUsuario.length > 0) {
        // AGREGO LA CANTIDAD DE PRODUCTOS AL MENSAJITO DEL CARRITO
        let cantidadProductos = pedidoUsuario.length.toString();
        const cantidadSpan = document.querySelector(".cantidad-car");
        cantidadSpan.style.display = "flex";
        cantidadSpan.textContent = cantidadProductos;

        pedidoUsuario.forEach((element, i) => {
          console.log("Producto " + i + 1 + " del pedido:");
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

          // ISERTO LOS DATOS EN EL CARRITO FROEND

          // DETERMINA SI EL PRECIO OFERTA TIENE CONTENIDO O ES NULLO Y SE GUARDA EN PRECIOFINAL LA OFERTA O EL ORIGINAL
          //SEGUN SU RESULTADO SIN CONTENIDO O NULL OFERTA O NO NULL
          const precioFinal =
            precioOfertaProducto !== null
              ? precioOfertaProducto
              : precioProducto;

          // CALCULA PRECIO FINAL DE PRODUCTO CON CANTIDAD
          const totalPrecio = precioFinal * cantidadProducto;

          // FORMATEA PRECIO LOCAL COLOMBIANO
          const precioFormateado = precioFinal.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          });
          const totalPrecioFormateado = totalPrecio.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          });
          const precioAnteriorFormateado = precioProducto.toLocaleString(
            "es-CO",
            { style: "currency", currency: "COP" }
          );

          var cardCarrito = `
        
                       <div class="carrito-card">
                <img src="${imgProducto}" class="img-producto-car" alt="${altImgProducto}">
                <div class="cont-name-descripcion">
                    <div class="name-producto">
                        ${nombreProducto}
                    </div>
                    <div class="descrip-producto">
                        ${descripcionProducto}
                    </div>
                </div>
                <div class="cantidad-precio">
                    <div class="cantidad-productos">
                        <span class="Ncantidad">${cantidadProducto}</span>
                    </div>
                    <div class="cont-precio-car">
                    <div class="cont-precios">
                        ${
                          precioOfertaProducto !== null
                            ? `
                            <span class="precio-anterior">
                                ${precioAnteriorFormateado}
                             </span>`
                            : ""
                        }
                        <span class="precio-anterior pruni">
                            ${precioFormateado} COP
                        </span>
                        <span class="valor-precio">
                            ${totalPrecioFormateado} COP
                        </span>
                        </div>
                        <i class="fa-solid fa-trash basury"></i>
                    </div>
                </div>
            </div>`;
          contCardCarrito.innerHTML += cardCarrito;
        });
      } else {
        // Cuando el usuario recien logueado no tiene nada en el carrito
        var mensCarrito = `<div class="mensajeRespuesta">
                      No has escogido ningun producto.
                    </div>
`;
        contCardCarrito.innerHTML += mensCarrito;
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

const obtenerProductos = () => {
  const settings_api = {
    url: tunel + "/api/productos",
    method: "GET",
    timeout: 0,
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  };

  $.ajax(settings_api)
    .done(function (response) {
      // VARIABLES DE LOS DATOS DE LOS PRODUCTOS
      const productos = response.data.products; // Arreglo de los productos

      if (productos.length > 0) {
        productos.forEach((element, i) => {
          console.log("Producto " + (i + 1));
          const nombreProducto = element.name; // Nombre del producto
          const precioProducto = element.price.regular; // Precio del producto
          const precioOfertaProducto = element.price.sale; // Precio de oferta del producto, si no hay oferta este campo es null
          const descripcionProducto = element.description.short; // Descripcion corta del producto
          const stockProducto = element.stock; // Cantidad de productos que existe para comprar
          const imgProducto = element.images[0].url; // Imagen del producto, si el producto tiene mas de una imagen, esta es la primera
          const altImgProducto = element.images[0].alt;
          const idCategoriaProducto = element.categories[0]._id;
          const nombreCategoriaProducto = element.categories[0].name; // Categorias que tine este producto
          console.log(
            nombreProducto,
            precioProducto,
            precioOfertaProducto,
            descripcionProducto,
            stockProducto,
            imgProducto,
            altImgProducto,
            idCategoriaProducto,
            nombreCategoriaProducto
          );
          console.log("-----------------------------------");
        });
      } else {
        console.log("No hay productos disponibles.");
      }
    })
    .fail(function (errorThrown) {
      if (errorThrown.status >= 500) {
        // Alerta de error en el servidor, hecha con el archivo alerta
        showToast(errorThrown.responseJSON.message, "error");
      } else {
        showToast(errorThrown.responseJSON.message, "warning");
      }
    });
};

const obtenerCategorias = () => {
  const settings_api = {
    url: tunel + "/api/categories",
    method: "GET",
    timeout: 0,
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  };

  $.ajax(settings_api)
    .done(function (response) {
      // VARIABLES DE LOS DATOS DE LAS CATEGORIAS
      const categorias = response.data.data;
      if (categorias.length > 0) {
        categorias.forEach((element, i) => {
          console.log("Categoria " + (i + 1));
          const idCategoria = element._id;
          const nombreCategoria = element.name; // Nombre de la categoria
          const descripcionCategoria = element.description; // Descripcion de la categoria
          const imgCategoria = element.image; // Imagen de la categoria
          console.log(nombreCategoria, imgCategoria, descripcionCategoria);
          console.log("-----------------------------------");
        });
      }
    })
    .fail(function (errorThrown) {
      if (errorThrown.status >= 500) {
        // Alerta de error en el servidor, hecha con el archivo alerta
        showToast(errorThrown.responseJSON.message, "error");
      } else {
        showToast(errorThrown.responseJSON.message, "warning");
      }
    });
};
