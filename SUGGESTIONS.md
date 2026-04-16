# Sugerencias de Mejora - Horas Adicionales

Este documento resume los riesgos y la deuda técnica que conviene priorizar en futuras iteraciones del proyecto.

## Prioridad alta

### 1. Consistencia del modelo de datos en registros

En `records.service.ts` conviven campos actuales como `dateTimeRecord` con lógica heredada que todavía usa `fecha`.

- Unificar el modelo de datos de `records`.
- Eliminar helpers y consultas heredadas que dependan de `fecha`.
- Revisar filtros, reportes y lecturas históricas para evitar comportamientos ambiguos.

**Riesgo:** errores sutiles en filtros por fecha, reportes inconsistentes y mayor dificultad para evolucionar la capa de datos.

### 2. Manejo de errores demasiado permisivo

Varios servicios devuelven `null`, `false` o `[]` cuando ocurre un error real. Eso evita caídas visibles, pero también esconde fallos y dificulta distinguir entre "sin datos" y "falló la operación".

- Revisar servicios que hoy silencian errores con valores por defecto.
- Propagar errores de forma explícita cuando la UI necesite diferenciar estados.
- Mantener `handleAppError` como punto central, pero con respuestas más claras para cada flujo.

**Riesgo:** fallos difíciles de depurar, estados inconsistentes en UI y feedback poco fiable al usuario.

### 3. Resolución de autenticación al arrancar la app

`PrivateLayout` decide el acceso usando `isAuthenticated`, pero no espera explícitamente a `isAuthResolved`.

- Alinear las rutas privadas con el estado `isAuthResolved`.
- Mostrar estado de carga controlado mientras Firebase resuelve la sesión inicial.

**Riesgo:** redirecciones prematuras, parpadeo de pantallas y UX inconsistente en recargas.

## Prioridad media

### 4. Limpieza de deuda histórica y nombres inconsistentes

Hay archivos y símbolos con nombres poco consistentes o con typos, por ejemplo:

- `useBranches.hook..tsx`
- `useDeyailsRecord.tsx`
- `branches.services.ts`
- `jobsPositions.service.tsx`

**Acción sugerida:** renombrar y normalizar convenciones para reducir fricción al navegar y mantener el proyecto.

### 5. Revisión de logs y trazas técnicas en cliente

Todavía hay `console.error` y `console.warn` en flujos de aplicación y utilidades de soporte.

- Revisar qué logs deben seguir existiendo.
- Sustituir logs transitorios por manejo centralizado o feedback de UI cuando corresponda.

**Riesgo:** ruido en depuración, menor claridad operativa y exposición innecesaria de detalles técnicos.

## Prioridad baja

### 6. Optimización de rendimiento y peso de bundle

La estrategia de `manualChunks` ya ayuda, pero todavía hay margen para seguir reduciendo el peso del chunk principal y vigilar suscripciones activas.

- Vigilar crecimiento del bundle principal.
- Revisar puntos de carga diferida si se agregan nuevas pantallas pesadas.
- Confirmar limpieza consistente de suscripciones `onSnapshot`.

## Notas de contexto

- Las reglas actuales de Firestore ya protegen correctamente los datos de usuario bajo `users/{uid}/...`.
- El proyecto ya cuenta con validación base mediante `npm run lint`, `npm run build` y `npm run test`.
- La base de tests y CI es buena; por eso la prioridad ahora no es "agregar estructura", sino reducir deuda técnica en flujos críticos.
