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



const obtenerProductos = () => {
  const contCardP = document.querySelector('.cont-ajustable');
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
      const productos = response.data.products;

      if (productos.length > 0) {
        productos.forEach((element) => {
          const idProducto = element._id;
          const nombreProducto = element.name;
          const precioProducto = element.price.regular;
          const descripcionProducto = element.description.short;
          const stockProducto = element.stock;
          const imgProducto = element.images[0].url;
          const altImgProducto = element.images[0].alt;

          const productoCard = `
            <div class="card">
              <span class="token-categ"></span>
              <div class="card-img">
                <img src="${imgProducto}" alt="${altImgProducto}">
              </div>
              <div class="card-info">
                <p class="text-title">${nombreProducto}</p>
                <p class="text-body">${descripcionProducto}</p>
              </div>
              <div class="card-footer">
                <div class="right-footer">
                  <span class="text-title precio">${precioProducto}</span>
                  <div class="quantity-controls">
                    <button type="button" class="btn-decrement btn-control-sr" data-id="${idProducto}">-</button>
                    <div class="cont-cantidad-input cci">
                      <input type="text" id="${idProducto}" class="quantity-input" value="1" min="1" max="${stockProducto}" readonly />
                    </div>
                    <button type="button" class="btn-increment btn-control-sr" data-id="${idProducto}">+</button>
                  </div>
                </div>
                <div class="card-button" onclick="AgregarCarrito('${idProducto}')">
                  <svg class="svg-icon" viewBox="0 0 20 20">
                      <path
                    d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z">
                  </path>
                  <path
                    d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z">
                  </path>
                  <path
                    d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z">
                  </path>
                  </svg>
                </div>
              </div>
            </div>
          `;
          contCardP.innerHTML += productoCard;
        });

        // Asociar eventos de cantidad después de generar las tarjetas
        configurarEventosCantidad();
      } else {
        console.log("No hay productos disponibles.");
      }
    })
    .fail(function (errorThrown) {
      if (errorThrown.status >= 500) {
        showToast(errorThrown.responseJSON.message, "error");
      } else {
        showToast(errorThrown.responseJSON.message, "warning");
      }
    });
};

const configurarEventosCantidad = () => {
  document.querySelectorAll('.btn-increment').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idProducto = e.target.dataset.id;
      const inputCantidad = document.getElementById(idProducto);
      let cantidadActual = parseInt(inputCantidad.value, 10);
      const maxCantidad = parseInt(inputCantidad.max, 10);

      if (cantidadActual < maxCantidad) {
        inputCantidad.value = cantidadActual + 1;
      } else {
        alert("Has alcanzado el stock máximo disponible.");
      }
    });
  });

  document.querySelectorAll('.btn-decrement').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idProducto = e.target.dataset.id;
      const inputCantidad = document.getElementById(idProducto);
      let cantidadActual = parseInt(inputCantidad.value, 10);

      if (cantidadActual > 1) {
        inputCantidad.value = cantidadActual - 1;
      } else {
        alert("La cantidad mínima es 1.");
      }
    });
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
