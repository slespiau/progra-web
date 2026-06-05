"use client";

import { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";

export default function Productos() {
  const { agregarAlCarrito } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  useEffect(() => {
    async function getProductos() {
      const { data, error } = await supabase.from("productos").select();

      if (error) {
        console.error("Supabase error:", error.message, error.details, error.hint);
        setProductos([]);
      } else {
        setProductos(data || []);
      }

      setLoading(false);
    }

    getProductos();
  }, []);

  return (
    <section id="productos" className="productos">
      <div className="productos-encabezado">
        <h2>Productos</h2>
        <p>
          Una colección de velas artesanales pensadas para acompañar momentos de
          calma, decorar con calidez y regalar sensaciones.
        </p>
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="lista-productos">
          {productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              id={producto.id}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              precio={producto.precio}
              imagen={producto.imagen_url}
            />
          ))}
        </div>
      )}
    </section>
  );
}


