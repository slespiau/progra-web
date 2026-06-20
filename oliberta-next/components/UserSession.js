"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function UserSession() {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadSessionData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);

      if (session?.access_token) {
        try {
          const res = await fetch("/api/auth/rol", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          const result = await res.json();
          setRol(result.rol ?? null);
        } catch (err) {
          console.error("Error al obtener rol:", err);
          setRol(null);
        }
      } else {
        setRol(null);
      }
    }

    loadSessionData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.access_token) {
        try {
          const res = await fetch("/api/auth/rol", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          const result = await res.json();
          setRol(result.rol ?? null);
        } catch (err) {
          console.error("Error al obtener rol:", err);
          setRol(null);
        }
      } else {
        setRol(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRol(null);
    router.push("/auth/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-session">
      <div className="user-session-info">
        <span>{user.email}</span>
        {rol && <small>{rol}</small>}
      </div>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}