const botonesAgregar = document.querySelectorAll(".boton-agregar");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const botonVaciar = document.getElementById("boton-vaciar");

const carrito = [];

botonesAgregar.forEach((boton) => {
  boton.addEventListener("click", () => {
    const producto = boton.closest(".producto");

    const nombre = producto.dataset.nombre;
    const precio = Number(producto.dataset.precio);

    carrito.push({ nombre, precio });

    renderizarCarrito();
  });
});

botonVaciar.addEventListener("click", () => {
  carrito.length = 0;
  renderizarCarrito();
});

function renderizarCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    carritoVacio.style.display = "block";
  } else {
    carritoVacio.style.display = "none";
  }

  const carritoAgrupado = {};

  carrito.forEach((producto) => {
    if (carritoAgrupado[producto.nombre]) {
      carritoAgrupado[producto.nombre].cantidad += 1;
    } else {
      carritoAgrupado[producto.nombre] = {
        precio: producto.precio,
        cantidad: 1,
      };
    }
  });

  for (const nombre in carritoAgrupado) {
    const producto = carritoAgrupado[nombre];
    const subtotal = producto.precio * producto.cantidad;

    const item = document.createElement("div");
    item.classList.add("item-carrito");

    item.innerHTML = `
      <div class="item-carrito-info">
        <p>${nombre}</p>
        <p>$${subtotal.toLocaleString("es-AR")}</p>
      </div>

      <div class="controles-cantidad">
        <button class="boton-restar" data-nombre="${nombre}">-</button>
        <span>${producto.cantidad}</span>
        <button class="boton-sumar" data-nombre="${nombre}">+</button>
      </div>

      <button class="boton-eliminar" data-nombre="${nombre}">Eliminar</button>
    `;


    listaCarrito.appendChild(item);
  }

  const botonesSumar = document.querySelectorAll(".boton-sumar");
  const botonesRestar = document.querySelectorAll(".boton-restar");

  botonesSumar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombreProducto = boton.dataset.nombre;

      const productoOriginal = carrito.find(
        (producto) => producto.nombre === nombreProducto
      );

      if (productoOriginal) {
        carrito.push({
          nombre: productoOriginal.nombre,
          precio: productoOriginal.precio,
       });

        renderizarCarrito();
      }
    });
  });

  botonesRestar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombreProducto = boton.dataset.nombre;

      const indice = carrito.findIndex(
        (producto) => producto.nombre === nombreProducto
      );

      if (indice !== -1) {
        carrito.splice(indice, 1);
        renderizarCarrito();
      }
    });
  });


  const botonesEliminar = document.querySelectorAll(".boton-eliminar");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombreProducto = boton.dataset.nombre;

      const carritoFiltrado = carrito.filter(
        (producto) => producto.nombre !== nombreProducto
      );
      
      carrito.length = 0;
      carrito.push(...carritoFiltrado);
      
      renderizarCarrito();
    
    });
  });

  const total = carrito.reduce(
    (acumulador, producto) => acumulador + producto.precio,
    0
  );

  totalCarrito.textContent = `$${total.toLocaleString("es-AR")}`;
}


