# Sugerencias de Mejora - Horas Adicionales

Este documento resume las recomendaciones para fortalecer la arquitectura, seguridad y funcionalidad del proyecto.

## 1. Tipado de Catálogos Estáticos

Actualmente, los archivos `branches.json` y `jobsPositions.json` se importan directamente. Se recomienda:

- Crear interfaces de TypeScript que definan la estructura de estos objetos.
- Utilizar estas interfaces en los componentes de formulario para asegurar que los IDs y nombres sean consistentes.

## 2. Seguridad en Firestore

Dado que la estructura de datos es `users/{uid}/...`, es vital configurar las reglas de seguridad en Firebase:

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 3. Funcionalidades Pendientes (CRUD)

- **Perfiles de Trabajo:** Implementar la llamada a `deleteJobProfile` y `updateJobProfile` en la interfaz de usuario.
- **Registros:** Añadir filtros de búsqueda por rango de fechas y por nombre de empresa para facilitar la navegación cuando el volumen de datos crezca.

## 4. Gestión de Errores

- Integrar de forma sistemática el `handleAppError` de `error.service.ts` en todos los bloques `catch` de las páginas para que el usuario reciba feedback amigable en lugar de errores técnicos en la consola.

## 5. Optimización de Rendimiento

- Aunque ya se usa el compilador de React 19, se recomienda vigilar las suscripciones de `onSnapshot` en `subscribeToJobProfiles` para asegurar que siempre se ejecute la función de limpieza (`unsubscribe`) al desmontar componentes.
