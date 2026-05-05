"use client";

import { useState } from "react";
import Inicio from "../components/Inicio";
import Nosotros from "../components/Nosotros";
import Productos from "../components/Productos";
import Contacto from "../components/Contacto";
import Carrito from "../components/Carrito";

export default function Tienda() {
  const productos = [
    {
      id: 1,
      nombre: "Vela Valle",
      descripcion:
        "Vela artesanal en recipiente verde, inspirada en la calma de la naturaleza. Su aroma suave a eucalipto y té blanco acompaña momentos de descanso y frescura en el hogar.",
      precio: 17000,
    },
    {
      id: 2,
      nombre: "Vela Relax",
      descripcion:
        "Vela artesanal en envase verde con tapa, pensada para crear un ambiente sereno y acogedor. Su aroma a lavanda y vainilla suave invita a bajar el ritmo y disfrutar de un momento de calma.",
      precio: 18000,
    },
    {
      id: 3,
      nombre: "Vela Naturaleza",
      descripcion:
        "Vela artesanal decorativa en cuenco de madera, con detalles inspirados en suculentas y flores. Su aroma a bambú, jazmín y notas verdes aporta frescura, armonía y conexión con lo natural.",
      precio: 28000,
    },
  ];

    const [carrito, setCarrito] = useState([]);

    function agregarAlCarrito(producto) {
        setCarrito([...carrito, producto]);
    }

    function vaciarCarrito() {
        setCarrito([]);
    }

    function eliminarDelCarrito(nombreAEliminar) {
        setCarrito(carrito.filter((producto) => producto.nombre !== nombreAEliminar));
    }

    function sumarUnidad(nombreProducto) {
        const productoOriginal = carrito.find(
          (producto) => producto.nombre === nombreProducto
        );
      
        if (productoOriginal) {
          setCarrito([...carrito, productoOriginal]);
        }
    }
      
    function restarUnidad(nombreProducto) {
        const indice = carrito.findIndex(
          (producto) => producto.nombre === nombreProducto
        );
      
        if (indice !== -1) {
          setCarrito(carrito.filter((_, index) => index !== indice));
        }
    }
      
      
      


  return (
    <main>
      <Inicio />
      <Nosotros />
      <Productos productos={productos} onAgregar={agregarAlCarrito} />
      <Contacto />
      <Carrito
        carrito={carrito}
        onVaciar={vaciarCarrito}
        onEliminar={eliminarDelCarrito}
        onSumar={sumarUnidad}
        onRestar={restarUnidad}
        />
    </main>
  );
}
