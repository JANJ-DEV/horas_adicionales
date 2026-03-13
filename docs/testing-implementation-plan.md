# Plan de Implementacion de Testing

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

- En progreso.

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

- Pendiente.

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

- Pendiente.

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

## Decisiones tecnicas

- Se usara rama dedicada para aislar riesgos.
- Se evitara introducir e2e en la fase inicial.
- Se prioriza mantener velocidad de desarrollo sin bloquear por cobertura.

## Proximo paso

- Continuar Fase 2 con logica pura adicional en servicios/utilidades sin dependencias externas.
