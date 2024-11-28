
// Ejecucion de datos al cargar la pagina
document.addEventListener("DOMContentLoaded", function(){


});

function InicioReload(){
  location.reload();
   
}

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

function OpenContLogin(){
    document.querySelector('.cont-login-user').style.display = "flex";
}

function CloseLogin(){
    document.querySelector('.cont-login-user').style.display = "none";
}

function OpenUserOptions(){
  document.querySelector('.cont-perfil-user').style.display = "flex";
}