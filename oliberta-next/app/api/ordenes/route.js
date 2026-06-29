import { createClient } from "@supabase/supabase-js";

function errorResponse(error, status) {
  return Response.json(
    { success: false, error },
    { status }
  );
}

function createSupabaseFromToken(token) {
  return createClient(
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
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse("No autenticado", 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createSupabaseFromToken(token);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("No autenticado", 401);
    }

    const { data, error } = await supabase
      .from("ordenes")
      .select(`
        id,
        total,
        estado,
        creado_en,
        metodo_pago,
        referencia_pago,
        pagado_en,
        items:orden_items(
          nombre_producto,
          cantidad,
          subtotal
        )
      `)
      .eq("usuario_id", user.id)
      .order("creado_en", { ascending: false });

    if (error) {
      return errorResponse("Error al obtener órdenes", 500);
    }

    return Response.json({
      success: true,
      data,
    });
  } catch (err) {
    return errorResponse("Error al obtener órdenes", 500);
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse("No autenticado", 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createSupabaseFromToken(token);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("No autenticado", 401);
    }

    const { data: carritoItems, error: carritoError } = await supabase
      .from("carrito")
      .select(`
        producto_id,
        cantidad,
        producto:productos(id, nombre, precio, stock)
      `)
      .eq("usuario_id", user.id);

    if (carritoError) {
      return errorResponse("Error al obtener carrito", 500);
    }

    if (!carritoItems || carritoItems.length === 0) {
      return errorResponse("El carrito está vacío", 400);
    }

    for (const item of carritoItems) {
      if (!item.producto) {
        return errorResponse("Producto no encontrado", 404);
      }

      if (item.producto.stock < item.cantidad) {
        return errorResponse(
          `Stock insuficiente para ${item.producto.nombre}`,
          400
        );
      }
    }

    const total = carritoItems.reduce((sum, item) => {
      return sum + item.producto.precio * item.cantidad;
    }, 0);

    const items = carritoItems.map((item) => ({
      producto_id: item.producto_id,
      cantidad: item.cantidad,
    }));

    const { data, error } = await supabase.rpc("crear_orden_completa", {
      p_usuario_id: user.id,
      p_items: items,
      p_total: total,
    });

    if (error) {
      return errorResponse("Error al crear la orden", 500);
    }

    const resultado = data?.[0];

    if (!resultado?.success) {
      return errorResponse(
        resultado?.error_msg || "Error al crear la orden",
        500
      );
    }

    return Response.json({
      success: true,
      data: {
        orden_id: resultado.orden_id,
        total,
      },
    });
  } catch (err) {
    return errorResponse("Error al crear la orden", 500);
  }
}