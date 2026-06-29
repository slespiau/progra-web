import Link from "next/link";

export default function Inicio() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-contenido hero-contenido-centrado">
        <h1>
          Encendé la <span className="hero-destacado">calma.</span>
        </h1>

        <p className="hero-frase hero-frase-principal">
          Aromas suaves. Diseño artesanal.
        </p>

        <p className="hero-frase hero-frase-secundaria">
          Luz para hacer de cada espacio un ritual.
        </p>

        <Link href="/productos" className="hero-boton">
          Ver productos
        </Link>
      </div>
    </section>
  );
}