"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function UserSession() {
  const [session, setSession] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef(null);

  useEffect(() => {
    async function cargarSesion() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
    }

    cargarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (session) {
    return (
      <div className="user-session">
        <Link
          href="/ordenes"
          className={`user-nav-link ${pathname === "/ordenes" ? "activo" : ""}`}
        >
          Órdenes
        </Link>

        <span className="user-email">{session.user.email}</span>

        <button type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="user-session" ref={menuRef}>
      <button
        type="button"
        className="auth-menu-boton"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        Iniciar sesión
        <span className="auth-menu-flecha">{menuAbierto ? "▴" : "▾"}</span>
      </button>

      {menuAbierto && (
        <div className="auth-dropdown">
          <Link href="/auth/login" onClick={() => setMenuAbierto(false)}>
            Iniciar sesión
          </Link>
          <Link href="/auth/register" onClick={() => setMenuAbierto(false)}>
            Crear cuenta
          </Link>
        </div>
      )}
    </div>
  );
}