# Plan de Implementación de Testing

## Objetivo

Implementar una base de testing incremental para el proyecto sin romper funcionalidad existente ni bloquear el ritmo de desarrollo.

## Alcance

- Crear infraestructura minima de tests.
- Validar integracion con el flujo actual (lint/build).
- Incorporar primeros tests de alto valor y bajo riesgo.
- Documentar decisiones, riesgos y avance por fases.

## Rama de trabajo

- Rama dedicada: `chore/testing-foundation`
- Regla: no mezclar cambios funcionales ajenos al testing en esta rama.

## Principios de ejecucion

1. Incremental y reversible.
2. Commits pequenos por fase.
3. Validacion continua en cada bloque.
4. Cero cambios destructivos sobre historial.

## Fases del plan

### Fase 0: Baseline y preparacion

Objetivo:

- Confirmar estado limpio de main y abrir rama dedicada.

Salida esperada:

- Rama creada y documento de plan inicial versionado.

Estado:

- Completado.

### Fase 1: Infraestructura minima de testing

Objetivo:

- Instalar y configurar herramientas base (Vitest + Testing Library + jsdom).

Tareas:

1. Instalar dependencias de test.
2. Crear configuracion de Vitest.
3. Crear setup global para tests.
4. Agregar scripts en `package.json`:
   - `test`
   - `test:watch`
   - `test:coverage` (opcional inicial)
5. Crear 1 test de humo para verificar funcionamiento.

Validacion:

- `npm run lint`
- `npm run build`
- `npm run test`

Riesgos:

- Conflictos de configuracion con Vite/TS.
- Falsos fallos por entorno DOM incompleto.

Mitigacion:

- Configuracion minima y test de humo aislado.

Estado:

- Completado.

### Fase 2: Tests de utilidades y logica pura

Objetivo:

- Cubrir funciones con mayor estabilidad y menor costo de mantenimiento.

Tareas:

1. Priorizar `src/utils` y funciones puras de servicios.
2. Agregar tests de casos normales y edge cases.
3. Evitar dependencias de Firebase real.

Validacion:

- `npm run test`
- `npm run lint`

Riesgos:

- Tests acoplados a implementacion interna.

Mitigacion:

- Testear comportamiento observable, no detalles internos.

Estado:

- Completado.

### Fase 3: Componentes UI clave

Objetivo:

- Validar componentes representativos y estados principales.

Tareas:

1. Seleccionar componentes criticos y estables.
2. Mockear contextos/minimos necesarios.
3. Probar render, interaccion basica y estados vacio/carga.

Validacion:

- `npm run test`
- `npm run lint`
- `npm run build`

Riesgos:

- Exceso de mocks dificiles de mantener.

Mitigacion:

- Empezar por componentes de presentacion y poca dependencia.

Estado:

- Completado.

### Fase 4: Consolidacion y documentacion final

Objetivo:

- Cerrar la rama con una base de testing sostenible.

Tareas:

1. Ajustar README con seccion de tests.
2. Documentar comandos y buenas practicas.
3. Definir backlog de cobertura futura.

Validacion:

- Flujo completo verde: lint + build + test.

Estado:

- Completado.

## Criterio de no rotura

En cada fase debe cumplirse:

1. La app compila (`npm run build`).
2. No se degrada calidad de lint (`npm run lint`).
3. Los tests nuevos pasan de forma reproducible (`npm run test`).

Si una fase falla:

- Revertir solo ese bloque en la rama.
- Corregir y relanzar validaciones.

## Politica de tests en este proyecto

- La ausencia de tests no bloquea tareas funcionales.
- Los tests se introducen de forma incremental por riesgo/valor.
- Prioridad inicial: logica critica y utilidades.

## Registro de avances

| Fecha | Fase | Cambio | Resultado | Observaciones |
| --- | --- | --- | --- | --- |
| 2026-03-13 | Fase 0 | Rama creada + plan inicial | OK | Base lista para arrancar Fase 1 |
| 2026-03-13 | Fase 1 | Setup Vitest + jsdom + scripts de test + setup global | OK | Validado con lint, build y test |
| 2026-03-13 | Fase 2 | Tests de logica en `src/utils/index.test.ts` (8 casos) | OK | Cobertura inicial de funciones puras |
| 2026-03-13 | Fase 2 | Tests de logica en `src/services/error.service.test.ts` (4 casos) | OK | Manejo de FirebaseError, Error y error desconocido |
| 2026-03-13 | Fase 2 | Migracion de tests a `test/` con estructura espejo de `src/` | OK | Vitest actualizado: include y setup en `test/` |
| 2026-03-13 | Fase 2 | Tests de logica en `test/services/populate.service.test.ts` (6 casos) | OK | Validaciones de estructura y persistencia con mocks de Firestore |
| 2026-03-13 | Fase 2 | Tests de logica en `test/services/branches.services.test.ts` (3 casos) | OK | Verificacion de toasts y retornos en funciones deterministas |
| 2026-03-13 | Fase 3 | Piloto de componente en `test/components/Btn.test.tsx` (5 casos) | OK | Render, interaccion y estado disabled |
| 2026-03-13 | Fase 3 | Segundo piloto en `test/components/Loading.test.tsx` (3 casos) | OK | Variantes visuales y prop size |
| 2026-03-13 | Fase 3 | Tercer piloto en `test/components/CurrentUser.test.tsx` (5 casos) | OK | Contexto mockeado, login/logout y cierre de menu por click externo |
| 2026-03-14 | Fase 3 | Componente de navegacion en `test/components/MainMenu.test.tsx` (5 casos) | OK | Render condicional por auth, navegacion y cierre de menu dentro/fuera de nav |
| 2026-03-14 | Fase 4 | README actualizado con seccion de testing y convenciones | OK | Comandos, estructura en `test/` y buenas practicas documentadas |
| 2026-03-14 | Fase 4 | Backlog priorizado de cobertura futura definido por riesgo | OK | Priorizacion centrada en actions, servicios con Firestore/Auth y rutas |
| 2026-03-14 | Fase 4 | Tests en `test/routes/actions/records.actions.test.ts` (6 casos) | OK | Validaciones de utilidades, sesion y payload del flujo principal de registros |
| 2026-03-14 | Fase 4 | Tests en `test/routes/actions/jobs.actions.test.ts` (6 casos) | OK | Alta de perfil y actualizacion de cuenta con/sin upload y manejo de error |
| 2026-03-14 | Fase 4 | Tests en `test/services/records.service.test.ts` (8 casos) | OK | Suscripcion, guardado, lectura puntual y mutaciones con mocks de Firestore |
| 2026-03-14 | Fase 4 | Tests en `test/services/jobsProfile.service.test.ts` (6 casos) | OK | CRUD y suscripcion de perfiles con usuario autenticado mockeado |
| 2026-03-14 | Fase 4 | Tests en `test/services/auth.service.test.ts` (5 casos) | OK | Login Google, logout, updateAccount y escucha de auth state |
| 2026-03-14 | Fase 4 | Tests en `test/routes/router.test.tsx` (4 casos) | OK | Composicion de routers, actions enlazadas y fallback 404 |
| 2026-03-14 | Fase 4 | Tests en `test/context/providers/GlobalProvider.test.tsx` (2 casos) | OK | Estado y acciones de menus globales |
| 2026-03-14 | Fase 4 | Tests en `test/context/providers/UtilitiesProvider.test.tsx` (2 casos) | OK | Suscripcion, estado derivado y mutaciones locales de catalogo |
| 2026-03-14 | Fase 4 | Tests en `test/context/providers/AuthProvider.test.tsx` (2 casos) | OK | Sync de auth state, login y logout con toasts |
| 2026-03-14 | Fase 4 | Tests en `test/hooks/useFilterBranches.test.tsx` (2 casos) | OK | Seleccion de rama/puesto y resolucion de datos derivados |
| 2026-03-14 | Fase 4 | Tests en `test/pages/records/AddNewRecord.test.tsx` (3 casos) | OK | Carga inicial, utilidades dinamicas y feedback del fetcher |
| 2026-03-14 | Fase 4 | Tests en `test/pages/jobs_profiles/CreateJobProfile.test.tsx` (2 casos) | OK | Render base, seleccion de rama y estado del submit |
| 2026-03-14 | Fase 4 | Tests en `test/pages/records/DetailsRecord.test.tsx` (2 casos) | OK | Empty state, contexto de perfil y utilidades mapeadas |
| 2026-03-14 | Fase 4 | Tests en `test/pages/jobs_profiles/JobProfileDetails.test.tsx` (3 casos) | OK | ID invalido, carga de detalle y manejo de perfil inexistente |

## Decisiones tecnicas

- Se usara rama dedicada para aislar riesgos.
- Se evitara introducir e2e en la fase inicial.
- Se prioriza mantener velocidad de desarrollo sin bloquear por cobertura.

## Backlog priorizado de cobertura futura

### Prioridad 1

1. `src/routes/actions/records.actions.ts`
   - Motivo: concentra validaciones de formulario, autenticacion, utilidades dinamicas y persistencia del flujo principal de negocio.
   - Casos objetivo: faltantes requeridos, utilidades invalidas, conversion numerica, usuario no autenticado y payload final enviado a `saveRecord`.
2. `src/routes/actions/jobs.actions.ts`
   - Motivo: maneja alta de perfiles y actualizacion de cuenta, incluyendo upload opcional y toasts de error/exito.
   - Casos objetivo: validacion de campos, flujo con/sin foto, error en upload y error en `updateAccount`.
3. `src/services/records.service.ts`
   - Motivo: concentra lectura/escritura de registros y suscripciones a Firestore, con alto impacto si hay regresiones.
   - Casos objetivo: guardado sin usuario, mapeo de snapshots, error en `onSnapshot`, `getRecordById` inexistente y operaciones `update/delete`.

### Prioridad 2

1. `src/services/jobsProfile.service.ts`
   - Motivo: CRUD y suscripcion de perfiles de trabajo con dependencia directa de usuario autenticado.
   - Casos objetivo: save/update/delete, ausencia de usuario, `getJobProfileById` sin documento y callback de suscripcion.
2. `src/services/auth.service.ts`
   - Motivo: encapsula integracion con Firebase Auth y actualizacion del documento de usuario.
   - Casos objetivo: wrapper de `signInWithPopup`, `signOut`, `authStateChanged` y `updateAccount` con/ sin usuario autenticado.
3. Configuracion de rutas en `src/routes/*.tsx`
   - Motivo: la navegacion privada/publica define acceso a vistas criticas y pagina 404.
   - Casos objetivo: composicion de rutas, paths esperados y presencia de fallback `*`.

### Prioridad 3

1. Hooks y providers con logica derivada en `src/context` y `src/hooks`
   - Motivo: hoy sostienen estado transversal y pueden ganar valor de test cuando el flujo privado crezca.
2. Componentes de formularios complejos en `src/pages/records` y `src/pages/jobs_profiles`
   - Motivo: alta combinatoria de estados; conviene abordarlos despues de cubrir actions/servicios para reducir mocks fragiles.

## Proximo paso

- Fase de estabilizacion recomendada: pipeline CI para `lint + build + test` y luego evaluar cobertura e2e puntual por flujo critico.
