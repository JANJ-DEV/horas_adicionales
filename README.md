# Horas Adicionales

Aplicación web para registrar horas trabajadas por jornada y gestionar perfiles de trabajo por usuario autenticado.

## Resumen

Este proyecto está construido con **React + TypeScript + Vite** y usa:

- **Firebase Authentication** (inicio de sesión con Google).
- **Cloud Firestore** para persistir datos por usuario.
- **React Router** para navegación y acciones de formularios.
- **Tailwind CSS** para estilos.
- **React Toastify** para notificaciones.

## Funcionalidades actuales

- Inicio de sesión y cierre de sesión con cuenta de Google.
- Protección de rutas privadas (`/records`, `/job-profiles`, `/account`).
- Alta de registros de jornada (empresa, fecha, hora de entrada y salida).
- Listado de registros guardados del usuario.
- Creación y listado en tiempo real de perfiles de trabajo.
- Vista de datos básicos de la cuenta autenticada.

## Stack técnico

- React 19
- TypeScript 5
- Vite 7
- Firebase 12 (Auth + Firestore)
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

## Estructura principal

```text
src/
  apis/                # Configuración de Firebase
  components/          # Componentes reutilizables UI
  context/             # Contextos globales (auth, toast, estado global)
  pages/               # Vistas y layouts por módulo
    account/           # Cuenta de usuario
    jobs_profiles/     # Perfiles de trabajo
    records/           # Registros de horas
    layouts/           # Layouts públicos/privados y estructura común
  routes/              # Definición de rutas y acciones de formularios
  services/            # Acceso a Auth y Firestore
  utils/               # Utilidades compartidas
```

## Modelo de datos (Firestore)

Los datos se guardan por usuario autenticado en:

- `users/{uid}/records`
- `users/{uid}/job_profiles`

Ejemplo de documento en `records`:

```json
{
  "id": "auto-id",
  "nombreEmpresa": "Empresa X",
  "fecha": "2026-03-03",
  "hora_entrada": "08:00",
  "hora_salida": "17:00",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

## Rutas principales

- `/` y `/home`: inicio público.
- `/records`: listado de registros.
- `/records/add`: formulario para nuevo registro.
- `/job-profiles`: listado de perfiles de trabajo.
- `/job-profiles/add`: formulario para nuevo perfil.
- `/account`: información de cuenta.
- `/account/update`: vista de actualización (placeholder).

## Notas de desarrollo

- Alias de importación configurado: `@` → `src`.
- Se usa `babel-plugin-react-compiler` en la configuración de Vite.
- El proyecto compila correctamente con `npm run build`.

## Próximas mejoras sugeridas

- Edición y borrado funcional de perfiles de trabajo (botones ya visibles en UI).
- Filtros por fecha/empresa para registros.
- Tests de servicios y componentes críticos.
- Reglas de seguridad de Firestore documentadas por entorno.
