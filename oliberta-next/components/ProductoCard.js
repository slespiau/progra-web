export default function ProductoCard({
    nombre,
    descripcion,
    precio,
    imagen,
    onAgregar,
  }) {
    return (
      <article className="producto-card">
        <img src={imagen} alt={nombre} className="producto-imagen" />
  
        <h3>{nombre}</h3>
        <p className="producto-descripcion">{descripcion}</p>
  
        <div className="producto-footer">
          <p className="producto-precio">${precio.toLocaleString("es-AR")}</p>
          <button className="producto-boton" onClick={onAgregar}>
            Agregar al carrito
          </button>
        </div>
      </article>
    );
  }
  
  
  