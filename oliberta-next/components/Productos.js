"use client";

import ProductoCard from "../components/ProductoCard";
import { useCart } from "../context/CartContext";

export default function Productos({ productos }) {
  const { agregarAlCarrito } = useCart();

  return (
    <section id="productos" className="productos">
      <div className="productos-encabezado">
        <h2>Productos</h2>
        <p>
          Una colección de velas artesanales pensadas para acompañar momentos de
          calma, decorar con calidez y regalar sensaciones.
        </p>
      </div>

      <div className="lista-productos">
        {productos.map((producto) => (
          <ProductoCard
            key={producto.id}
            nombre={producto.nombre}
            descripcion={producto.descripcion}
            precio={producto.precio}
            imagen={producto.imagen}
            onAgregar={() => agregarAlCarrito(producto)}
          />
        ))}
      </div>
    </section>
  );
}


