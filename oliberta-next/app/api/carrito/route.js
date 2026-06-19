import { createClient } from "@supabase/supabase-js";

function errorResponse(error, status) {
  return Response.json(
    { success: false, error },
    { status }
  );
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse("No autenticado", 401);
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
      return errorResponse("No autenticado", 401);
    }

    const body = await request.json();
    const { producto_id, cantidad } = body;

    if (!producto_id || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 100) {
      return errorResponse("Datos inválidos", 400);
    }

    const { data: producto, error: productoError } = await supabase
      .from("productos")
      .select("id, stock")
      .eq("id", producto_id)
      .single();

    if (productoError || !producto) {
      return errorResponse("Producto no encontrado", 404);
    }

    const { data: existente, error: carritoError } = await supabase
      .from("carrito")
      .select("id, cantidad")
      .eq("usuario_id", user.id)
      .eq("producto_id", producto_id)
      .maybeSingle();

    if (carritoError) {
      return errorResponse("Error al consultar carrito", 500);
    }

    const nuevaCantidad = existente ? existente.cantidad + cantidad : cantidad;

    if (producto.stock < nuevaCantidad) {
      return errorResponse("Stock insuficiente", 400);
    }

    let result;

    if (existente) {
      const { data, error } = await supabase
        .from("carrito")
        .update({ cantidad: nuevaCantidad })
        .eq("id", existente.id)
        .select()
        .single();

      if (error) {
        return errorResponse("Error al actualizar carrito", 500);
      }

      result = data;
    } else {
      const { data, error } = await supabase
        .from("carrito")
        .insert({
          usuario_id: user.id,
          producto_id,
          cantidad,
        })
        .select()
        .single();

      if (error) {
        return errorResponse("Error al insertar en carrito", 500);
      }

      result = data;
    }

    return Response.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return errorResponse("Error al agregar al carrito", 500);
  }
}