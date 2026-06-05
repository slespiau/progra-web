"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function getCarritoActual() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data, error } = await supabase
      .from("carrito")
      .select(`
        id,
        cantidad,
        usuario_id,
        producto_id,
        productos (
          id,
          nombre,
          precio,
          imagen_url
        )
      `)
      .eq("usuario_id", user.id);

    if (error) {
      console.error("Error al traer carrito:", error.message);
      setCarrito([]);
    } else {
      setCarrito(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    getCarritoActual();
  }, []);

  const sumarCantidad = async (item) => {
    const { error } = await supabase
      .from("carrito")
      .update({ cantidad: item.cantidad + 1 })
      .eq("id", item.id);

    if (error) {
      console.error("Error al sumar cantidad:", error.message);
      return;
    }

    getCarritoActual();
  };

  const restarCantidad = async (item) => {
    if (item.cantidad === 1) {
      const { error } = await supabase.from("carrito").delete().eq("id", item.id);

      if (error) {
        console.error("Error al eliminar producto:", error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("carrito")
        .update({ cantidad: item.cantidad - 1 })
        .eq("id", item.id);

      if (error) {
        console.error("Error al restar cantidad:", error.message);
        return;
      }
    }

    getCarritoActual();
  };

  const eliminarProducto = async (item) => {
    const { error } = await supabase.from("carrito").delete().eq("id", item.id);

    if (error) {
      console.error("Error al eliminar producto:", error.message);
      return;
    }

    getCarritoActual();
  };

  const total = carrito.reduce((acumulador, item) => {
    return acumulador + item.cantidad * item.productos.precio;
  }, 0);

  return (
    <section id="carrito" className="carrito">
      <div className="carrito-contenido">
        <h2>Carrito</h2>
        <p className="carrito-intro">
          Acá vas a ver los productos seleccionados para tu compra.
        </p>

        <div className="carrito-box">
          {loading ? (
            <p className="carrito-vacio">Cargando carrito...</p>
          ) : carrito.length === 0 ? (
            <p className="carrito-vacio">
              Todavía no agregaste productos al carrito.
            </p>
          ) : (
            carrito.map((item) => (
              <div key={item.id} className="item-carrito">
                <div className="item-carrito-info">
                  <p>
                    {item.productos.nombre} x{item.cantidad}
                  </p>
                  <p>
                    $
                    {(item.productos.precio * item.cantidad).toLocaleString(
                      "es-AR"
                    )}
                  </p>
                </div>

                <div className="controles-cantidad">
                  <button onClick={() => restarCantidad(item)}>-</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => sumarCantidad(item)}>+</button>
                  <button
                    className="boton-eliminar"
                    onClick={() => eliminarProducto(item)}
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
          </div>
        </div>
      </div>
    </section>
  );
}