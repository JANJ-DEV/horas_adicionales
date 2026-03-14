# Horas Adicionales

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/status-active-success)

Aplicacion web para registrar horas trabajadas por jornada, gestionar perfiles de trabajo y centralizar el calculo de jornadas por usuario autenticado.

## Tabla de contenido

- [Resumen](#resumen)
- [Capturas](#capturas)
- [Funcionalidades](#funcionalidades)
- [Stack tecnico](#stack-tecnico)
- [Requisitos](#requisitos)
- [Configuracion de entorno](#configuracion-de-entorno)
- [Instalacion y ejecucion](#instalacion-y-ejecucion)
- [Scripts disponibles](#scripts-disponibles)
- [Testing](#testing)
- [CI](#ci)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Documentacion oficial](#documentacion-oficial)
- [Roadmap corto](#roadmap-corto)

## Resumen

El proyecto esta construido con React + TypeScript + Vite y utiliza Firebase Authentication y Cloud Firestore para gestionar datos por usuario.

Casos de uso principales:

- Registrar jornada por perfil de trabajo.
- Consultar registros historicos.
- Mantener perfiles de trabajo con datos asociados.
- Gestionar estado de sesion y cuenta de usuario.

## Capturas

Capturas con sesion iniciada para mostrar el flujo privado principal de la app.

### Records

![Records auth desktop](public/img/readme/desktop/records-auth-desktop.png)
![Records auth mobile](public/img/readme/mobile/records-auth-mobile.png)

### Job Profiles

![Job profiles auth desktop](public/img/readme/desktop/job-profiles-auth-desktop.png)
![Job profiles auth mobile](public/img/readme/mobile/job-profiles-auth-mobile.png)

### Account

![Account auth desktop](public/img/readme/desktop/account-auth-desktop.png)
![Account auth mobile](public/img/readme/mobile/account-auth-mobile.png)

## Funcionalidades

- Inicio y cierre de sesion con Google.
- Rutas privadas para records, job-profiles y account.
- Alta y listado de registros de jornada.
- Creacion y listado en tiempo real de perfiles de trabajo.
- Operaciones CRUD de perfiles desde capa de servicios.
- Vista de cuenta autenticada y actualizacion de datos basicos.

## Stack tecnico

- React 19
- TypeScript 5
- Vite 7
- Firebase 12 (Auth + Firestore)
- React Router 7
- Tailwind CSS 4
- React Toastify 11
- ESLint 9 + Prettier 3

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Proyecto Firebase con Authentication (Google) y Firestore habilitados

## Configuracion de entorno

1. Crear archivo `.env.local` en la raiz.
2. Copiar plantilla desde [.env.example](.env.example).
3. Completar valores reales de Firebase.

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

Nota: solo variables con prefijo `VITE_` se exponen al cliente en Vite.

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

Servidor local esperado:

- `http://localhost:5173` (o el siguiente puerto libre)

## Scripts disponibles

| Script | Descripcion |
| --- | --- |
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila TypeScript y genera build de produccion |
| `npm run preview` | Sirve la build de produccion localmente |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Ejecuta ESLint con autofix |
| `npm run format` | Formatea con Prettier |
| `npm run format:check` | Verifica formato con Prettier |
| `npm run seed:catalog` | Poblado de catalogos en Firestore |
| `npm run seed:catalog:dry` | Simulacion de poblado de catalogos |
| `npm run seed:utilities` | Poblado de utilidades en Firestore |
| `npm run seed:utilities:dry` | Simulacion de poblado de utilidades |

## Testing

Base actual de testing:

- Vitest como runner.
- Testing Library para componentes React.
- jsdom para entorno de navegador en tests.

Comandos principales:

| Script | Descripcion |
| --- | --- |
| `npm run test` | Ejecuta toda la suite de tests |
| `npm run test -- test/components` | Ejecuta un subconjunto puntual de tests |
| `npm run test:watch` | Mantiene Vitest en modo watch |
| `npm run test:coverage` | Genera reporte de cobertura |

Convenciones del proyecto:

- Todos los tests viven en `test/`.
- La estructura de `test/` replica la estructura principal de `src/`.
- Los archivos siguen la forma `*.test.ts` o `*.test.tsx`.
- El setup compartido se mantiene en `test/setup/`.

Cobertura inicial incorporada:

- Utilidades puras en `test/utils/`.
- Servicios deterministas y con mocks de Firebase en `test/services/`.
- Componentes base de UI y navegacion en `test/components/`.

Buenas practicas aplicadas en este repo:

- Priorizar comportamiento observable sobre detalles internos.
- Evitar dependencias de Firebase real; usar mocks aislados.
- Empezar por servicios, actions y componentes estables antes de formularios complejos o e2e.

## CI

El repositorio incluye pipeline de GitHub Actions en [.github/workflows/ci.yml](.github/workflows/ci.yml).

Eventos cubiertos:

- Pull requests.
- Push a ramas main, develop, feature/*, chore/* y fix/*.

Checks automáticos:

- npm run lint
- npm run build
- npm run test

Recomendación de protección de rama:

- Exigir este workflow en estado exitoso antes de permitir merge a main.
- Activar "Require branches to be up to date" para evitar merge de commits desfasados.

## Estructura del proyecto

```text
src/
  apis/                # Configuracion de Firebase
  components/          # Componentes UI reutilizables
  context/             # Context API, hooks y providers
  hooks/               # Hooks de aplicacion
  json/                # Catalogos estaticos
  pages/               # Modulos de cuenta, records y job profiles
  routes/              # Definicion de rutas y actions
  services/            # Logica de negocio y acceso a datos
  types/               # Tipos TypeScript
  utils/               # Utilidades compartidas
scripts/               # Scripts de poblado de datos
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

## Roadmap corto

- Mejorar filtros de registros por fecha y perfil.
- Incrementar cobertura de tests en servicios y hooks.
- Documentar reglas de seguridad de Firestore por entorno.
- Endurecer reglas de branch protection y checks requeridos en CI.
