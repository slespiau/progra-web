import ProductoCard from "../components/ProductoCard";

export default function Productos({ productos, onAgregar }) {
  return (
    <section>
      <h2>Productos</h2>
      <p>
        Una colección de velas artesanales pensadas para acompañar momentos de
        calma, decorar con calidez y regalar sensaciones.
      </p>

      <div>
        {productos.map((producto) => (
          <ProductoCard
            key={producto.id}
            nombre={producto.nombre}
            descripcion={producto.descripcion}
            precio={producto.precio}
            onAgregar={() => onAgregar(producto)}
          />
        ))}
      </div>
    </section>
  );
}
