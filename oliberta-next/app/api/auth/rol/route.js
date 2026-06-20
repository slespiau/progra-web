import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({
        rol: null,
        autenticado: false,
        email: null,
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({
        rol: null,
        autenticado: false,
        email: null,
      });
    }

    const { data: perfil, error: perfilError } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (perfilError || !perfil) {
      return Response.json({
        rol: null,
        autenticado: true,
        email: user.email,
      });
    }

    return Response.json({
      rol: perfil.rol,
      autenticado: true,
      email: user.email,
    });
  } catch (err) {
    return Response.json({
      rol: null,
      autenticado: false,
      email: null,
    });
  }
}