"use client";

import { useEffect, useState } from "react";
import ProductoCard from "./ProductoCard";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProductos() {
      try {
        const res = await fetch("/api/productos");
        const result = await res.json();

        if (!res.ok || !result.success) {
          console.error("Error al obtener productos:", result.error);
          setProductos([]);
          return;
        }

        setProductos(result.data || []);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setProductos([]);
      } finally {
        setLoading(false);
      }
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
        <p className="productos-loading">Cargando productos...</p>
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