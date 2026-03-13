---
name: clean-proyect
description: "Pasar los scripts para la limpieza de codigo antes de subir a GitHub. Pasar el linter, format y arreglar errores de compilacion. Eliminar codigo comentado, logs y archivos innecesarios, finalizando con el buidl de producción para verificar que no hay errores."
---

# Horas Adicionales

Aplicación web para registrar horas trabajadas por jornada y gestionar perfiles de trabajo por usuario autenticado.

## Stack técnico

- React 19
- TypeScript 5
- Vite 7
- Vite 6
- Firebase 11 (Auth + Firestore)
- React Router 7
- Tailwind CSS 4

## Requisitos

- Node.js 20+ recomendado
- npm 10+
- Proyecto de Firebase con Authentication (Google) y Firestore habilitados

## Configuración de entorno

1. Crea un archivo `.env.local` en la raíz del proyecto.
2. Añade las variables de tu app de Firebase:

```env
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_DATABASE_URL=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
```

> Nota: todas las variables del frontend deben comenzar por `VITE_` para que Vite las exponga en `import.meta.env`.

## Instalación y ejecución

```bash
npm install
npm run dev
```

La app quedará disponible en la URL local que muestre Vite (normalmente `http://localhost:5173`).

## Scripts disponibles

- `npm run dev`: inicia servidor de desarrollo.
- `npm run build`: compila TypeScript y genera build de producción.
- `npm run preview`: sirve localmente la build generada.
- `npm run lint`: ejecuta ESLint.
