# Horas Adicionales

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-Private-informational)

Aplicacion web para registrar horas trabajadas por jornada y gestionar perfiles de trabajo por usuario autenticado.

## Resumen

Este proyecto esta construido con React + TypeScript + Vite y utiliza:

- Firebase Authentication para inicio de sesion con Google.
- Cloud Firestore para persistencia de datos por usuario.
- React Router para navegacion y acciones de formularios.
- Tailwind CSS para estilos.
- React Toastify para notificaciones.

## Funcionalidades actuales

- Inicio y cierre de sesion con Google.
- Rutas privadas para records, job-profiles y account.
- Alta y listado de registros de jornada.
- Creacion y listado en tiempo real de perfiles de trabajo.
- CRUD de perfiles de trabajo desde servicios.
- Vista de datos basicos de cuenta autenticada.

## Stack tecnico

- React 19
- TypeScript 5
- Vite 7
- Firebase 12 (Auth + Firestore)
- React Router 7
- Tailwind CSS 4
- React Toastify 11

## Requisitos

- Node.js 20+
- npm 10+
- Proyecto Firebase con Authentication (Google) y Firestore habilitados

## Configuracion de entorno

1. Crear un archivo .env.local en la raiz del proyecto.
2. Copiar las variables desde [.env.example](.env.example).
3. Completar con las credenciales de tu proyecto Firebase.

Variables requeridas:

```env
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_DATABASE_URL=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
```

Nota: en Vite, las variables expuestas al frontend deben empezar por VITE_.

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

La app quedara disponible en la URL que muestre Vite (normalmente http://localhost:5173).

## Scripts disponibles

- npm run dev: inicia servidor de desarrollo.
- npm run build: compila TypeScript y genera build de produccion.
- npm run preview: sirve localmente la build generada.
- npm run lint: ejecuta ESLint.
- npm run lint:fix: ejecuta ESLint con autofix.
- npm run format: aplica Prettier.
- npm run format:check: valida formato con Prettier.
- npm run seed:catalog: pobla catalogos en Firestore.
- npm run seed:utilities: pobla utilidades en Firestore.

## Estructura principal

```text
src/
  apis/                # Configuracion de Firebase
  components/          # Componentes reutilizables de UI
  context/             # Contextos globales y providers
  hooks/               # Hooks de aplicacion
  pages/               # Vistas, modulos y layouts
  routes/              # Definicion de rutas y actions
  services/            # Logica de negocio y acceso a datos
  types/               # Tipos TypeScript
  utils/               # Utilidades compartidas
scripts/               # Scripts de poblado de catalogos
public/                # Recursos estaticos
```

## Documentacion oficial

- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/
- Vite: https://vite.dev/guide/
- Firebase: https://firebase.google.com/docs
- React Router: https://reactrouter.com/home
- Tailwind CSS: https://tailwindcss.com/docs
- React Toastify: https://fkhadra.github.io/react-toastify/introduction/

## Demo

- Demo en vivo: pendiente de publicacion.

## Proximas mejoras sugeridas

- Filtros avanzados por fecha/empresa en registros.
- Tests de servicios y componentes criticos.
- Documentar reglas de seguridad de Firestore por entorno.
- Pipeline CI con checks de lint, format y build.
