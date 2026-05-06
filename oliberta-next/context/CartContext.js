"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }

    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    }
  }, [carrito, cargado]);

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
