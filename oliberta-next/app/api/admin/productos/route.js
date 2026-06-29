import { createClient } from "@supabase/supabase-js";

function errorResponse(error, status) {
  return Response.json({ success: false, error }, { status });
}

function createUserSupabaseFromToken(token) {
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

function createAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

async function getAdminUser(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "No autenticado", status: 401 };
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = createUserSupabaseFromToken(token);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "No autenticado", status: 401 };
  }

  const { data: perfil, error: perfilError } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (perfilError || !perfil || perfil.rol !== "admin") {
    return { error: "No autorizado", status: 403 };
  }

  return { user };
}

function validarProducto({ nombre, descripcion, precio, stock, imagen_url }) {
  if (
    !nombre?.trim() ||
    !descripcion?.trim() ||
    !imagen_url?.trim() ||
    Number.isNaN(Number(precio)) ||
    Number.isNaN(Number(stock))
  ) {
    return "Datos inválidos";
  }

  if (Number(precio) < 0 || Number(stock) < 0) {
    return "Precio o stock inválidos";
  }

  return null;
}

export async function GET(request) {
  try {
    const admin = await getAdminUser(request);

    if (admin.error) {
      return errorResponse(admin.error, admin.status);
    }

    const supabase = createAdminSupabase();

    const { data, error } = await supabase
      .from("productos")
      .select("id, nombre, descripcion, precio, stock, imagen_url")
      .order("id", { ascending: true });

    if (error) {
      return errorResponse("No se pudieron obtener los productos", 500);
    }

    return Response.json({
      success: true,
      data,
    });
  } catch (err) {
    return errorResponse("Error al obtener productos", 500);
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminUser(request);

    if (admin.error) {
      return errorResponse(admin.error, admin.status);
    }

    const supabase = createAdminSupabase();

    const body = await request.json();
    const { nombre, descripcion, precio, stock, imagen_url } = body;

    const errorValidacion = validarProducto({
      nombre,
      descripcion,
      precio,
      stock,
      imagen_url,
    });

    if (errorValidacion) {
      return errorResponse(errorValidacion, 400);
    }

    const { data, error } = await supabase
      .from("productos")
      .insert({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        stock: Number(stock),
        imagen_url: imagen_url.trim(),
      })
      .select()
      .single();

    if (error) {
      return errorResponse("No se pudo crear el producto", 500);
    }

    return Response.json({
      success: true,
      data,
    });
  } catch (err) {
    return errorResponse("Error al crear producto", 500);
  }
}

export async function PUT(request) {
  try {
    const admin = await getAdminUser(request);

    if (admin.error) {
      return errorResponse(admin.error, admin.status);
    }

    const supabase = createAdminSupabase();

    const body = await request.json();
    const { id, nombre, descripcion, precio, stock, imagen_url } = body;

    if (!id) {
      return errorResponse("Falta el id del producto", 400);
    }

    const errorValidacion = validarProducto({
      nombre,
      descripcion,
      precio,
      stock,
      imagen_url,
    });

    if (errorValidacion) {
      return errorResponse(errorValidacion, 400);
    }

    const { data, error } = await supabase
      .from("productos")
      .update({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        stock: Number(stock),
        imagen_url: imagen_url.trim(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse("No se pudo actualizar el producto", 500);
    }

    return Response.json({
      success: true,
      data,
    });
  } catch (err) {
    return errorResponse("Error al actualizar producto", 500);
  }
}

export async function DELETE(request) {
  try {
    const admin = await getAdminUser(request);

    if (admin.error) {
      return errorResponse(admin.error, admin.status);
    }

    const supabase = createAdminSupabase();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return errorResponse("Falta el id del producto", 400);
    }

    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id);

    if (error) {
      return errorResponse("No se pudo eliminar el producto", 500);
    }

    return Response.json({
      success: true,
    });
  } catch (err) {
    return errorResponse("Error al eliminar producto", 500);
  }
}