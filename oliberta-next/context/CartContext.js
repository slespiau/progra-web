"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  function agregarAlCarrito(producto) {
    setCarrito((prevCarrito) => [...prevCarrito, producto]);
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  function eliminarDelCarrito(nombreAEliminar) {
    setCarrito((prevCarrito) =>
      prevCarrito.filter((producto) => producto.nombre !== nombreAEliminar)
    );
  }

  function sumarUnidad(nombreProducto) {
    setCarrito((prevCarrito) => {
      const productoOriginal = prevCarrito.find(
        (producto) => producto.nombre === nombreProducto
      );

      if (!productoOriginal) return prevCarrito;

      return [...prevCarrito, productoOriginal];
    });
  }

  function restarUnidad(nombreProducto) {
    setCarrito((prevCarrito) => {
      const indice = prevCarrito.findIndex(
        (producto) => producto.nombre === nombreProducto
      );

      if (indice === -1) return prevCarrito;

      return prevCarrito.filter((_, index) => index !== indice);
    });
  }

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        vaciarCarrito,
        eliminarDelCarrito,
        sumarUnidad,
        restarUnidad,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
