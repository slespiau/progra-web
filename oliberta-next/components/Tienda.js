"use client";

import { useState } from "react";
import Inicio from "../components/Inicio";
import Nosotros from "../components/Nosotros";
import Productos from "../components/Productos";
import Contacto from "../components/Contacto";
import Carrito from "../components/Carrito";
import Header from "../components/Header";


export default function Tienda() {
    const productos = [
        {
          id: 1,
          nombre: "Vela Valle",
          descripcion:
            "Vela artesanal en recipiente verde, inspirada en la calma de la naturaleza. Su aroma suave a eucalipto y té blanco acompaña momentos de descanso y frescura en el hogar.",
          precio: 17000,
          imagen: "/vela-valle.png",
        },
        {
          id: 2,
          nombre: "Vela Relax",
          descripcion:
            "Vela artesanal en envase verde con tapa, pensada para crear un ambiente sereno y acogedor. Su aroma a lavanda y vainilla suave invita a bajar el ritmo y disfrutar de un momento de calma.",
          precio: 18000,
          imagen: "/vela-relax.png",
        },
        {
          id: 3,
          nombre: "Vela Naturaleza",
          descripcion:
            "Vela artesanal decorativa en cuenco de madera, con detalles inspirados en suculentas y flores. Su aroma a bambú, jazmín y notas verdes aporta frescura, armonía y conexión con lo natural.",
          precio: 28000,
          imagen: "/vela-naturaleza.png",
        },
        {
          id: 4,
          nombre: "Vela Bosque",
          descripcion:
            "Vela artesanal en cuenco de madera con delicados detalles florales. Su aroma a cedro, ámbar y flores blancas crea una sensación cálida, envolvente y tranquila.",
          precio: 24000,
          imagen: "/vela-bosque.png",
        },
        {
          id: 5,
          nombre: "Colección Esencia",
          descripcion:
            "Velas artesanales en envase de vidrio con frases inspiradoras, ideales para regalar o acompañar pequeños rituales diarios. Aromas disponibles: vainilla cálida, flor de algodón y coco suave.",
          precio: 16000,
          imagen: "/coleccion-esencia.png",
        },
        {
          id: 6,
          nombre: "Vela Terra",
          descripcion:
            "Vela artesanal en recipiente estilo piedra, de diseño minimalista y textura natural. Sin aroma, ideal para quienes prefieren una experiencia visual y decorativa simple, elegante y armoniosa.",
          precio: 20000,
          imagen: "/vela-terra.png",
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
          <Header />
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
