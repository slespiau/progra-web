import AgregarAlCarrito from "./AgregarAlCarrito";

export default function ProductoCard({
  id,
  nombre,
  descripcion,
  precio,
  imagen,
}) {
  return (
    <article className="producto-card">
      <img
        src={imagen}
        alt={`Imagen del producto ${nombre}`}
        className="producto-imagen"
      />

      <h3>{nombre}</h3>
      <p className="producto-descripcion">{descripcion}</p>

      <div className="producto-footer">
        <p className="producto-precio">${precio.toLocaleString("es-AR")}</p>

        <AgregarAlCarrito
          producto={{ id, nombre, descripcion, precio, imagen }}
        />
      </div>
    </article>
  );
}