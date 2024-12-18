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
  document.querySelectorAll(".btn-menu-option").forEach((btn) => {
    const idFuncionBtn = btn.getAttribute("data-id");
    if ("mostrarCategorias" == idFuncionBtn) {
      btn.classList.add("active-menu-seleccionado");
    } else {
      btn.classList.remove("active-menu-seleccionado");
    }
  });
});

function InicioReload() {
  location.reload();
}

//MENU DESDE CLIENTE FILTRACION DE PRODUCTOS

document
  .querySelector(".style-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      filtrarProductos(); // Llama a la función de filtrado
    }
  });

function filtrarOfertas(nombreFuncion) {
  document.querySelectorAll(".btn-menu-option").forEach((btn) => {
    const idFuncionBtn = btn.getAttribute("data-id");
    if (nombreFuncion == idFuncionBtn) {
      btn.classList.add("active-menu-seleccionado");
    } else {
      btn.classList.remove("active-menu-seleccionado");
    }
  });

  const selectCategoria = document.querySelector(".style-select"); // Obtener el elemento select
  selectCategoria.value = "0"; // Establecer el valor predeterminado (opción deshabilitada "Filtrar Categorias")

  document.querySelector(".cont-ajustable").style.display = "flex";
  document.querySelector(".cont-categorias-exhibicion").style.display = "none";
  const tarjetas = document.querySelectorAll(".card");
  tarjetas.forEach((tarjeta) => {
    const precioOferta = tarjeta.querySelector(".pdtoCard"); // Verifica si la tarjeta tiene un precio de oferta
    if (precioOferta) {
      tarjeta.style.display = "block"; // Muestra la tarjeta si tiene oferta
    } else {
      tarjeta.style.display = "none"; // Oculta la tarjeta si no tiene oferta
    }
  });
}

function filtrarProductos(textoFiltro = null) {
  const selectCategoria = document.querySelector(".style-select"); // Obtener el elemento select
  selectCategoria.value = "0"; // Establecer el valor predeterminado (opción deshabilitada "Filtrar Categorias")

  document.querySelector(".cont-ajustable").style.display = "flex";
  document.querySelector(".cont-categorias-exhibicion").style.display = "none";

  const inputFiltro = document.querySelector(".cont-filtro .style-input");
  const textoBusqueda =
    textoFiltro !== null
      ? textoFiltro.toLowerCase()
      : inputFiltro.value.toLowerCase(); // Usa el argumento o el valor del input
  const tarjetas = document.querySelectorAll(".card"); // Selecciona todas las tarjetas de productos

  tarjetas.forEach((tarjeta) => {
    const tituloProducto = tarjeta
      .querySelector(".text-title")
      .textContent.toLowerCase(); // Obtiene el texto del título del producto
    if (tituloProducto.includes(textoBusqueda)) {
      tarjeta.style.display = "block"; // Muestra la tarjeta si coincide
    } else {
      tarjeta.style.display = "none"; // Oculta la tarjeta si no coincide
    }
  });
}

// Función de filtrado de productos por categoría
function simularSeleccionCategoria(idCategoria) {
  document.querySelector(".cont-ajustable").style.display = "flex";
  document.querySelector(".cont-categorias-exhibicion").style.display = "none";
  const selectCategoria = document.querySelector(".style-select");

  // Establecer el valor del select con el id de la categoría seleccionada
  selectCategoria.value = idCategoria;

  // Ejecutar el filtrado de productos
  filtrarPorCategoria();
}

document
  .querySelector(".style-select")
  .addEventListener("change", filtrarPorCategoria);

// Función de filtrado de productos por categoría
function filtrarPorCategoria() {
  document.querySelectorAll(".btn-menu-option").forEach((btn) => {
    btn.classList.remove("active-menu-seleccionado");
  });

  const selectCategoria = document.querySelector(".style-select"); // Obtener el select
  const categoriaSeleccionada = selectCategoria.value; // Obtener la categoría seleccionada desde el select

  const tarjetas = document.querySelectorAll(".card"); // Seleccionar todas las tarjetas de productos

  tarjetas.forEach((tarjeta) => {
    const idCategoriaProducto =
      tarjeta.querySelector(".idCategoria").textContent; // Obtener el id de la categoría del producto desde el HTML oculto
    if (
      categoriaSeleccionada === "0" ||
      idCategoriaProducto === categoriaSeleccionada
    ) {
      tarjeta.style.display = "block"; // Muestra la tarjeta si la categoría coincide
    } else {
      tarjeta.style.display = "none"; // Oculta la tarjeta si la categoría no coincide
    }
  });
}

function resetFiltro(nombreFuncion) {
  document.querySelectorAll(".btn-menu-option").forEach((btn) => {
    const idFuncionBtn = btn.getAttribute("data-id");
    if (nombreFuncion == idFuncionBtn) {
      btn.classList.add("active-menu-seleccionado");
    } else {
      btn.classList.remove("active-menu-seleccionado");
    }
  });

  const selectCategoria = document.querySelector(".style-select"); // Obtener el elemento select
  selectCategoria.value = "0"; // Establecer el valor predeterminado (opción deshabilitada "Filtrar Categorias")

  document.querySelector(".cont-ajustable").style.display = "flex";
  document.querySelector(".cont-categorias-exhibicion").style.display = "none";
  filtrarProductos(""); // Envía un texto vacío como filtro
  const inputFiltro = document.querySelector(".cont-filtro .style-input");
  inputFiltro.value = ""; // Limpia el campo de entrada
}

function mostrarCategorias(nombreFuncion) {
  document.querySelectorAll(".btn-menu-option").forEach((btn) => {
    const idFuncionBtn = btn.getAttribute("data-id");
    if (nombreFuncion == idFuncionBtn) {
      btn.classList.add("active-menu-seleccionado");
    } else {
      btn.classList.remove("active-menu-seleccionado");
    }
  });

  const selectCategoria = document.querySelector(".style-select"); // Obtener el elemento select
  selectCategoria.value = "0"; // Establecer el valor predeterminado (opción deshabilitada "Filtrar Categorias")

  document.querySelector(".cont-ajustable").style.display = "none";
  document.querySelector(".cont-categorias-exhibicion").style.display = "flex";
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
      localStorage.setItem("pedidoUsuario", JSON.stringify(pedidoUsuario));
      mostrarCarrito(pedidoUsuario, contCardCarrito);
    })
    .fail(function (errorThrown) {
      if (errorThrown.status >= 500) {
        showToast(errorThrown.responseJSON.message, "error");
      } else {
        showToast(errorThrown.responseJSON.message, "warning");
      }
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
};

//FIN INICIA Y CIERRA SESION

function AgregarCarrito(idProducto) {
  document.querySelectorAll(".card-button").forEach((btn) => {
    const idBtn = btn.dataset.id;
    if (idBtn == idProducto) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      document.querySelectorAll(".quantity-input").forEach((input) => {
        const idInput = input.getAttribute("id");
        const quantity = input.value;
        if (idInput == idProducto) {
          insertarProductoCarrito(idProducto, quantity, btn);
        }
      });
    }
  });
}

// Insertar datos de carrito a la base de datos
const insertarProductoCarrito = (idProducto, quantity, btn) => {
  const token = localStorage.getItem("token");

  const settings_api = {
    url: tunel + "/api/cart/add",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      productId: idProducto,
      quantity: quantity,
    }),
  };

  $.ajax(settings_api)
    .done(function (response) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';
      showToast(response.message, "success", 5000);
      obtenerDatosCarrito();
    })
    .fail(function (errorThrown) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';
      if (errorThrown.status >= 500) {
        // Alerta de error en el servidor, hecha con el archivo alerta
        showToast(errorThrown.responseJSON.message, "error");
      } else {
        showToast(errorThrown.responseJSON.message, "warning");
      }
    });
};

const obtenerDatosCarrito = () => {
  const contCardCarrito = document.querySelector(".cont-carrito");

  const token = localStorage.getItem("token");
  const settings_api = {
    url: tunel + "/api/cart/",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: "Bearer " + token,
      "ngrok-skip-browser-warning": "true",
    },
  };

  $.ajax(settings_api)
    .done(function (response) {
      const pedidoUsuario = response.data.items;
      localStorage.setItem("pedidoUsuario", JSON.stringify(pedidoUsuario));
      mostrarCarrito(pedidoUsuario, contCardCarrito);
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

const eliminarProductoDelCarrito = (idProducto) => {
  document.querySelectorAll(".btn-eliminar-producto").forEach((btn) => {
    const idBtn = btn.dataset.id;
    if (idBtn == idProducto) {
      btn.disabled = true;
      btn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin" style="font-size:20px"></i>';

      const token = localStorage.getItem("token");
      const settings_api = {
        url: tunel + "/api/cart/remove",
        method: "DELETE",
        timeout: 0,
        headers: {
          Authorization: "Bearer " + token,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          productId: idProducto,
          variants: [],
        }),
      };
      $.ajax(settings_api)
        .done(function (response) {
          showToast(response.message, "success");
          obtenerDatosCarrito();
        })
        .fail(function (errorThrown) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-trash basury"></i>';
          if (errorThrown.status >= 500) {
            // Alerta de error en el servidor, hecha con el archivo alerta
            showToast(errorThrown.responseJSON.message, "error");
          } else {
            showToast(errorThrown.responseJSON.message, "warning");
          }
        });
    }
  });
};

const mostrarCarrito = (pedidoUsuario, contCardCarrito) => {
  contCardCarrito.innerHTML = "";
  if (pedidoUsuario.length > 0) {
    const cargando_pago = document.querySelector(".loader-container");
    cargando_pago.style.display = "none";
    cargando_pago.querySelector("h4").style.display = "none";

    // AGREGO LA CANTIDAD DE PRODUCTOS AL MENSAJITO DEL CARRITO
    let cantidadProductos = pedidoUsuario.length.toString();
    const cantidadSpan = document.querySelector(".cantidad-car");
    cantidadSpan.style.display = "flex";
    cantidadSpan.textContent = cantidadProductos;

    pedidoUsuario.forEach((element, i) => {
      const nombreProducto = element.product.name; // Nombre del producto que el usuario quiere comprar
      const precioProducto = element.product.price.regular; // Precio del producto que el usuario quiere comprar
      const precioOfertaProducto = element.product.price.sale; // Precio de oferta del producto que el usuario quiere comprar, si no hay oferta este campo es null
      const descripcionProducto = element.product.description.short; // Descripcion corta del producto que el usuario quiere comprar
      const stockProducto = element.product.stock; // Cantidad de productos que existe para comprar
      const imgProducto = element.product.images[0].url; // Imagen del producto que el usuario quiere comprar, si el producto tiene mas de una imagen, esta es la primera
      const altImgProducto = element.product.images[0].alt; // Texto alternativo de la imagen del producto que el usuario quiere comprar, si el producto tiene mas de una imagen, esta es la primera
      const cantidadProducto = element.quantity; // Cantidad de productos que el usuario quiere comprar
      const idProducto = element.product._id;

      // ISERTO LOS DATOS EN EL CARRITO FROEND

      // DETERMINA SI EL PRECIO OFERTA TIENE CONTENIDO O ES NULLO Y SE GUARDA EN PRECIOFINAL LA OFERTA O EL ORIGINAL
      //SEGUN SU RESULTADO SIN CONTENIDO O NULL OFERTA O NO NULL
      const precioFinal =
        precioOfertaProducto !== null ? precioOfertaProducto : precioProducto;

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
      const precioAnteriorFormateado = precioProducto.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      });

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
                        ${precioFormateado}
                    </span>
                    <span class="valor-precio">
                        ${totalPrecioFormateado}
                    </span>
                    </div>
                    <button class="btn-eliminar-producto" data-id="${idProducto}" onclick="eliminarProductoDelCarrito('${idProducto}')">
                      <i class="fa-solid fa-trash basury"></i>
                    </button>
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
    document.querySelector(".cantidad-car").style.display = "none";
    const cargando_pago = document.querySelector(".loader-container");
    cargando_pago.style.display = "flex";
    cargando_pago.querySelector("h4").style.display = "block";
    cargando_pago.querySelector(".loader").style.display = "none";
  }
};
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
  const contCardP = document.querySelector(".cont-ajustable");
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
          const precioOfertaProducto = element.price.sale;
          const descripcionProducto = element.description.short;
          const stockProducto = element.stock;
          const idCategoria = element.categories[0]._id;
          const nameCategoria = element.categories[0].name;
          const imgProducto = element.images[0].url;
          const altImgProducto = element.images[0].alt;

          // FORMATEAR PRECIOS
          const precioFinal =
            precioOfertaProducto !== null
              ? precioOfertaProducto
              : precioProducto;
          const precioFormateado = precioFinal.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          });

          const precioAnteriorFormateado = precioProducto.toLocaleString(
            "es-CO",
            {
              style: "currency",
              currency: "COP",
            }
          );

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
              <div class="categoriaData" style="display: none;">
              <span class="idCategoria">${idCategoria}</span>
              <span class="nameCategoria">${nameCategoria}</span>
              </div>
              <div class="card-footer">
                <div class="right-footer">
                 <div class="precios-format">
                  ${
                    precioOfertaProducto !== null
                      ? `
                       
                        <span class="pdtoCard">
                            ${precioAnteriorFormateado}
                         </span>`
                      : ""
                  }
                  <span class="text-title precio">${precioFormateado}</span>
                  </div>
                 
                </div>
                <div class="botones-product">
                 <div class="quantity-controls">
                    <button type="button" class="btn-decrement btn-control-sr" data-id="${idProducto}">-</button>
                    <div class="cont-cantidad-input cci">
                      <input type="text" id="${idProducto}" class="quantity-input" value="1" min="1" max="${stockProducto}" readonly />
                    </div>
                    <button type="button" class="btn-increment btn-control-sr" data-id="${idProducto}">+</button>
                  </div>
                <button class="card-button" data-id="${idProducto}" onclick="AgregarCarrito('${idProducto}')">
                  <i class="fa-solid fa-cart-plus"></i>
                  Agregar
                </button>
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
  document.querySelectorAll(".btn-increment").forEach((btn) => {
    btn.addEventListener("click", (e) => {
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

  document.querySelectorAll(".btn-decrement").forEach((btn) => {
    btn.addEventListener("click", (e) => {
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
  const contCategorias = document.querySelector(".contCategories");
  const contCategoriasExhibe = document.querySelector(
    ".cont-categorias-exhibicion"
  );
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
          const idCategoria = element._id;
          const nombreCategoria = element.name; // Nombre de la categoria
          const descripcionCategoria = element.description; // Descripcion de la categoria
          const imgCategoria = element.image; // Imagen de la categoria

          var contenidoCat = `
          <option class="categoria-option" value="${idCategoria}">${nombreCategoria}</option>
          `;
          contCategorias.innerHTML += contenidoCat;

          var exhibeCat = ` 
          <div class="categoria-cont" onclick="simularSeleccionCategoria('${idCategoria}')">
            <img class="imagen-categoria" src="${imgCategoria}" alt="">
            <div class="nombre-categoria">${nombreCategoria}</div>
            <span style="display: none;" class="idCategoriaCont">${idCategoria}</span>
          </div>`;
          contCategoriasExhibe.innerHTML += exhibeCat;
        });
      }
      document
        .querySelector(".style-select")
        .addEventListener("change", filtrarPorCategoria);
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

const dots = document.querySelectorAll(".dot");
let currentDot = 0;

function animateDots() {
  dots.forEach((dot, index) => {
    dot.style.opacity = index === currentDot ? "1" : "0";
  });

  currentDot = (currentDot + 1) % dots.length;
}

setInterval(animateDots, 500);
