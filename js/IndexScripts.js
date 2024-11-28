
// Ejecucion de datos al cargar la pagina
document.addEventListener("DOMContentLoaded", function(){


});

function InicioReload(){
  location.reload();
   
}


// CIERRA SESION

function cerrarSesion(){
  document.querySelector('.OpnLog').style.display = "flex";
  document.querySelector('.PrfIcon').style.display = "none";

}
//FIN INICIA Y CIERRA SESION


function AgregarCarrito() {
    const cantidadSpan = document.querySelector(".cantidad-car");
    if (cantidadSpan.textContent.trim() === ""){
        cantidadSpan.textContent = "1";
        cantidadSpan.style.display = "flex";
        return;
    }
    let cantidadActual = cantidadSpan.textContent === "99+" 
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

function OpenContLogin(){
    document.querySelector('.cont-login-user').style.display = "flex";
}

function CloseLogin(){
    document.querySelector('.cont-login-user').style.display = "none";
}



function OpenCarShop(){
  document.querySelector('.cont-perfil-user').style.display = "none";
  document.querySelector('.cont-carrito-modal').style.display = "flex";
  document.querySelector('.cont-estructura').style.pointerEvents = "none";
  document.querySelector('.cont-carrito-modal').style.pointerEvents = "all";

}

function CloseCarShop(){
  document.querySelector('.cont-carrito-modal').style.display = "none";
  document.querySelector('.cont-estructura').style.pointerEvents = "all";
}




function OpenUserOptions(){
  document.querySelector('.cont-perfil-user').style.display = "flex";
  document.querySelector('.cont-carrito-modal').style.display = "none";
  document.querySelector('.cont-estructura').style.pointerEvents = "none";
  document.querySelector('.cont-perfil-user').style.pointerEvents = "all";
}

function CloseUserOptions(){
  document.querySelector('.cont-perfil-user').style.display = "none";
  document.querySelector('.cont-estructura').style.pointerEvents = "all";
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

