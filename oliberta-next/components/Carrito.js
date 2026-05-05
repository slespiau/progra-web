export default function Carrito({
    carrito,
    onVaciar,
    onEliminar,
    onSumar,
    onRestar,
}) {
  
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
      <section>
        <h2>Carrito</h2>
        <p>Acá vas a ver los productos seleccionados para tu compra.</p>
  
        <div>
          {carrito.length === 0 ? (
            <p>Todavía no agregaste productos al carrito.</p>
          ) : (
            Object.entries(carritoAgrupado).map(([nombre, producto]) => (
                <div key={nombre}>
                    <p>
                        {nombre} x{producto.cantidad} - $
                        {(producto.precio * producto.cantidad).toLocaleString("es-AR")}
                    </p>

                    <div>
                        <button onClick={() => onRestar(nombre)}>-</button>
                        <span>{producto.cantidad}</span>
                        <button onClick={() => onSumar(nombre)}>+</button>
                        <button onClick={() => onEliminar(nombre)}>Eliminar</button>
                    </div>
                </div>

            ))
              
          )}
  
          <p>Total: ${total.toLocaleString("es-AR")}</p>
  
          <div>
            <button onClick={onVaciar}>Vaciar carrito</button>
            <button>Finalizar compra</button>
          </div>
        </div>
      </section>
    );
  }
  
  