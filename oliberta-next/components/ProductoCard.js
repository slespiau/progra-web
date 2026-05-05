export default function ProductoCard({
    nombre,
    descripcion,
    precio,
    onAgregar,
  }) {
    return (
      <article>
        <h3>{nombre}</h3>
        <p>{descripcion}</p>
        <p>${precio.toLocaleString("es-AR")}</p>
        <button onClick={onAgregar}>Agregar al carrito</button>
      </article>
    );
  }
  
  