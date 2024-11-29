// toast.js
function showToast(message, type = "info", duration = 3000) {
  const container =
    document.getElementById("toast-container") || createToastContainer();
  const toast = document.createElement("div");
  const icons = {
    success: '<i class="fa-solid fa-check"></i>',
    error: '<i class="fa-solid fa-circle-xmark"></i>',
    warning: '<i class="fa-solid fa-circle-exclamation"></i>',
    info: '<i class="fa-solid fa-circle-info"></i>',
  };

  toast.classList.add("toast", type);
  toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">${message}</div>
        <button class="toast-close">×</button>
    `;

  const closeButton = toast.querySelector(".toast-close");
  closeButton.addEventListener("click", () => {
    toast.classList.remove("show");
    setTimeout(() => container.removeChild(toast), 300);
  });

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  const autoCloseTimer = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => container.removeChild(toast), 300);
  }, duration);

  toast.addEventListener("mouseenter", () => {
    clearTimeout(autoCloseTimer);
  });
}

function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toast-container";
  container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    `;
  document.body.appendChild(container);

  // Agregar estilos dinámicamente
  const style = document.createElement("style");
  style.textContent = `
        .toast {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            color: #333;
            margin-bottom: 10px;
            max-width: 300px;
            opacity: 0;
            padding: 15px;
            transform: translateX(100%);
            transition: all 0.3s ease-in-out;
            display: flex;
            align-items: center;
        }
        .toast-icon {
            margin-right: 10px;
            font-size: 24px;
        }
        .toast-content {
            flex-grow: 1;
        }
        .toast-close {
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            font-size: 20px;
            margin-left: 10px;
        }
        .toast.success {
            border-left: 5px solid #4CAF50;
        }
        .toast.error {
            border-left: 5px solid #F44336;
        }
        .toast.warning {
            border-left: 5px solid #FF9800;
        }
        .toast.info {
            border-left: 5px solid #2196F3;
        }
        .toast.success i {
            color: #4CAF50;
        }
        .toast.error i {
            color: #F44336;
        }
        .toast.warning i {
            color: #FF9800;
        }
        .toast.info i {
            color: #2196F3;
        }
        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }
    `;
  document.head.appendChild(style);

  return container;
}

// Exportar la función para su uso en módulos
// export { showToast };
