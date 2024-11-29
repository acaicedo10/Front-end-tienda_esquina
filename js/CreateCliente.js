function crearUser(event) {
  const btnSubmit = document.querySelector(".btn_crear_cuenta");
  btnSubmit.disabled = true;
  btnSubmit.value = "Cargando...";
  event.preventDefault();

  const datos = new FormData(event.target);

  const settings_api = {
    url: tunel + "/api/auth/register",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      email: datos.get("correo_electronico"),
      password: datos.get("contrasena"),
      firstName: datos.get("nombre"),
      lastName: datos.get("apellido"),
    }),
  };

  $.ajax(settings_api)
    .done(function (response) {
      btnSubmit.value = "Crear Cuenta";
      showToast(response.message, "success", 5000);
      codigoConfirmacion();
    })
    .fail(function (errorThrown) {
      btnSubmit.disabled = false;
      btnSubmit.value = "Crear Cuenta";
      if (errorThrown.status >= 500) {
        // Alerta de error en el servidor, hecha con el archivo alerta
        showToast(errorThrown.responseJSON.message, "error");
      } else {
        showToast(errorThrown.responseJSON.message, "warning");
      }
    });

  return false;
}

function codigoConfirmacion() {
  const Registrador = document.querySelector(".cont-form");
  document.querySelector(".cont-codigo").style.display = "flex";
  const SuperCont = document.querySelector(".contenedor-form");
  SuperCont.style.justifyContent = "space-around";
  Registrador.style.opacity = "50%";
  Registrador.style.cursor = "default";
  Registrador.style.pointerEvents = "none";
}

const submitCodigoConfirmacion = (event) => {
  const btnSubmit = document.querySelector(".btn_validar_codigo");
  btnSubmit.disabled = true;
  btnSubmit.value = "Cargando...";
  event.preventDefault();
  const datos = new FormData(event.target);

  const settings_api = {
    url: tunel + "/api/auth/veryfyEmail",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      token: datos.get("codigo_confirmacion"),
    }),
  };

  $.ajax(settings_api)
    .done(function (response) {
      btnSubmit.value = "Todo listo!";
      showToast(response.message, "success", 3000);
      setTimeout(function () {
        window.location.href = "index.html";
      }, 3000);
    })
    .fail(function (errorThrown) {
      btnSubmit.disabled = false;
      btnSubmit.value = "Validar codigo";
      if (errorThrown.status >= 500) {
        // Alerta de error en el servidor, hecha con el archivo alerta
        showToast(errorThrown.responseJSON.message, "error");
      } else {
        showToast(errorThrown.responseJSON.message, "warning");
      }
    });
  return false;
};
