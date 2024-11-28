
function crearUser() {
    alert('Enviando Correo pues mijo');
    codigoConfirmacion();
}

function codigoConfirmacion() {
    const Registrador = document.querySelector('.cont-form');
    document.querySelector('.cont-codigo').style.display = "flex";
    const SuperCont = document.querySelector('.contenedor-form');
    SuperCont.style.justifyContent = "space-around";
    Registrador.style.opacity = "50%";
    Registrador.style.cursor = "default";
    Registrador.style.pointerEvents = "none";
    
    
}

