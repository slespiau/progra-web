"use client";

import { useCart } from "../context/CartContext";

export default function Carrito() {
  const {
    carrito,
    vaciarCarrito,
    eliminarDelCarrito,
    sumarUnidad,
    restarUnidad,
  } = useCart();

  const total = carrito.reduce((acumulador, producto) => {
    return acumulador + producto.precio;
  }, 0);

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

  return (
    <section id="carrito" className="carrito">
      <div className="carrito-contenido">
        <h2>Carrito</h2>
        <p className="carrito-intro">
          Acá vas a ver los productos seleccionados para tu compra.
        </p>

        <div className="carrito-box">
          {carrito.length === 0 ? (
            <p className="carrito-vacio">
              Todavía no agregaste productos al carrito.
            </p>
          ) : (
            Object.entries(carritoAgrupado).map(([nombre, producto]) => (
              <div key={nombre} className="item-carrito">
                <div className="item-carrito-info">
                  <p>
                    {nombre} x{producto.cantidad}
                  </p>
                  <p>
                    $
                    {(producto.precio * producto.cantidad).toLocaleString(
                      "es-AR"
                    )}
                  </p>
                </div>

                <div className="controles-cantidad">
                  <button onClick={() => restarUnidad(nombre)}>-</button>
                  <span>{producto.cantidad}</span>
                  <button onClick={() => sumarUnidad(nombre)}>+</button>
                  <button
                    className="boton-eliminar"
                    onClick={() => eliminarDelCarrito(nombre)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="carrito-resumen">
            <p>
              Total: <span>${total.toLocaleString("es-AR")}</span>
            </p>

            <div className="carrito-botones">
              <button id="boton-vaciar" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>
              <button className="boton-finalizar">Finalizar compra</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


  