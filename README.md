# Oliberta

<p align="center">
  <b>Tienda online de velas artesanales</b><br>
  Diseño cálido, catálogo dinámico, carrito, autenticación, panel admin y pagos con Mercado Pago Sandbox.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-JS-61dafb?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Mercado_Pago-Sandbox-00b1ea?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel" />
</p>

---

## Demo

- Deploy público: [https://progra-web-five.vercel.app](https://progra-web-five.vercel.app)
- Repositorio: [https://github.com/slespiau/progra-web](https://github.com/slespiau/progra-web)

---

## Descripción

Oliberta es una aplicación web full stack desarrollada con Next.js, Supabase y Mercado Pago.  
Simula una tienda online de velas artesanales, donde los usuarios pueden registrarse, iniciar sesión, explorar productos, agregarlos al carrito, generar órdenes y realizar pagos en entorno sandbox.

---

## Tecnologías utilizadas

- Next.js
- React
- JavaScript
- CSS
- Supabase
- Mercado Pago
- Vercel
- Git y GitHub

---

## Funcionalidades principales

- Landing page responsive
- Navegación por rutas con Next.js
- Catálogo dinámico de productos
- Carrito compartido entre páginas
- Registro e inicio de sesión
- Historial de órdenes por usuario
- Footer con navegación, ubicación y datos de contacto
- Integración con Supabase para persistencia
- Checkout con Mercado Pago Sandbox
- Webhook para actualizar el estado del pago
- Panel de administración para gestionar productos
- Deploy público en Vercel

---

## Estructura del proyecto

```bash
progra web
├── oliberta-next
│   ├── app
│   │   ├── admin
│   │   ├── api
│   │   ├── auth
│   │   ├── carrito
│   │   ├── checkout
│   │   ├── contacto
│   │   ├── nosotros
│   │   ├── ordenes
│   │   ├── pago-completado
│   │   ├── pago-fallido
│   │   ├── pago-pendiente
│   │   ├── productos
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components
│   ├── context
│   ├── data
│   ├── lib
│   ├── public
│   └── package.json
└── oliberta-vanilla
```
---

## Organización principal

- `app/`: rutas y páginas de la aplicación
- `app/api/`: API Routes para productos, carrito, órdenes, auth, contacto, admin y pagos
- `components/`: componentes reutilizables de interfaz
- `context/`: contexto global del carrito
- `lib/`: configuración de Supabase y Mercado Pago
- `public/`: imágenes y recursos estáticos

---

## Roles de usuario

- `cliente`: puede navegar, comprar y consultar sus órdenes
- `admin`: puede acceder al panel de administración y gestionar productos

---

## Base de datos

El proyecto utiliza Supabase con tablas para:

- `usuarios`
- `productos`
- `carrito`
- `ordenes`
- `orden_items`

---

## Flujo de compra

1. El usuario agrega productos al carrito.
2. Genera una orden.
3. Accede al checkout.
4. Realiza el pago con Mercado Pago Sandbox.
5. El webhook actualiza el estado de la orden.

---

## Credenciales de prueba

### Usuario administrador

- Email: `admin@oliberta.com`
- Contraseña: `usuarioadmin`

### Usuario cliente

- Se puede crear directamente desde la aplicación en `/auth/register`

### Mercado Pago Sandbox

- El proyecto usa integración de prueba con Mercado Pago Sandbox.
- Para validar el pago, deben usarse cuentas de prueba y tarjetas de prueba generadas en Mercado Pago Developers.

---

## Pruebas realizadas

- Registro e inicio de sesión
- Navegación entre rutas
- Alta de productos al carrito
- Actualización de cantidades y eliminación de productos
- Generación de órdenes
- Pago en entorno sandbox con Mercado Pago
- Actualización automática del estado de pago
- CRUD de productos desde panel admin
- Verificación responsive en desktop y mobile
- Deploy y preview funcionando con GitHub + Vercel

---

## Deploy

La aplicación fue desplegada en Vercel con integración continua desde GitHub.

---

## Objetivo del proyecto

Este trabajo fue desarrollado como proyecto integrador de Programación Web, aplicando conceptos de frontend, backend, base de datos, autenticación, despliegue y pasarela de pagos.

---

## Autora

**Sofía Lespiau**
