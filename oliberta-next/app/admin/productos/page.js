"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminProductosPage() {
  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const router = useRouter();

  async function cargarProductos(token) {
    const res = await fetch("/api/admin/productos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      setError(result.error || "No se pudieron cargar los productos");
      return;
    }

    setProductos(result.data || []);
  }

  useEffect(() => {
    async function iniciar() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/auth/login");
          return;
        }

        const rolRes = await fetch("/api/auth/rol", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const rolData = await rolRes.json();

        if (!rolData.autenticado || rolData.rol !== "admin") {
          setAutorizado(false);
          setLoading(false);
          return;
        }

        setAutorizado(true);
        await cargarProductos(session.access_token);
      } catch (err) {
        setError("Error al cargar el panel admin");
      } finally {
        setLoading(false);
      }
    }

    iniciar();
  }, [router]);

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setStock("");
    setImagenUrl("");
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        stock: Number(stock),
        imagen_url: imagenUrl.trim(),
      };

      const url = "/api/admin/productos";
      const method = editandoId ? "PUT" : "POST";

      const body = editandoId
        ? JSON.stringify({ id: editandoId, ...payload })
        : JSON.stringify(payload);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error || "No se pudo guardar el producto");
        return;
      }

      await cargarProductos(session.access_token);
      limpiarFormulario();
    } catch (err) {
      setError("Error al guardar el producto");
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (producto) => {
    setEditandoId(producto.id);
    setNombre(producto.nombre || "");
    setDescripcion(producto.descripcion || "");
    setPrecio(String(producto.precio ?? ""));
    setStock(String(producto.stock ?? ""));
    setImagenUrl(producto.imagen_url || "");
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Querés eliminar este producto?");
    if (!confirmar) return;

    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/admin/productos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error || "No se pudo eliminar el producto");
        return;
      }

      await cargarProductos(session.access_token);
    } catch (err) {
      setError("Error al eliminar el producto");
    }
  };

  if (loading) {
    return (
      <section className="admin-productos">
        <div className="admin-productos-contenido">
          <p>Cargando panel admin...</p>
        </div>
      </section>
    );
  }

  if (!autorizado) {
    return (
      <section className="admin-productos">
        <div className="admin-productos-contenido">
          <h2>Acceso denegado</h2>
          <p>Esta sección es solo para administradores.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-productos">
      <div className="admin-productos-contenido">
        <h2>Administrar productos</h2>
        <p className="admin-productos-intro">
          Desde acá podés crear, editar y eliminar productos del catálogo.
        </p>

        <form className="admin-formulario" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            min="0"
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            min="0"
          />

          <input
            type="text"
            placeholder="URL de imagen"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            required
          />

          {error && <p className="admin-error">{error}</p>}

          <div className="admin-formulario-botones">
            <button type="submit" className="boton-finalizar" disabled={guardando}>
              {guardando
                ? "Guardando..."
                : editandoId
                ? "Guardar cambios"
                : "Crear producto"}
            </button>

            {editandoId && (
              <button
                type="button"
                id="boton-vaciar"
                onClick={limpiarFormulario}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        <div className="admin-lista">
          {productos.map((producto) => (
            <article key={producto.id} className="admin-card">
              <div>
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <p>Precio: ${Number(producto.precio).toLocaleString("es-AR")}</p>
                <p>Stock: {producto.stock}</p>
              </div>

              <div className="admin-card-botones">
                <button
                  type="button"
                  className="boton-finalizar"
                  onClick={() => handleEditar(producto)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  id="boton-vaciar"
                  onClick={() => handleEliminar(producto.id)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}