---
name: pre-change-planning-guardrails
description: "Obligar plan previo antes de modificar archivos, pedir aprobacion explicita y aplicar convenciones de arquitectura/escalabilidad. USE FOR: plan antes de cambios, no editar sin aprobar, convenciones de componentes, escalabilidad, criterios para crear componentes, decision sobre tests."
---

# Pre-Change Planning Guardrails

Skill para controlar el flujo de trabajo antes de editar codigo y mantener consistencia tecnica del proyecto.

## Objetivo

- Evitar cambios sin alineacion previa con el usuario.
- Forzar un plan claro antes de tocar archivos.
- Mantener convenciones de arquitectura para escalabilidad.
- Incluir criterio pragmatico sobre testing aunque hoy no exista suite formal.

## Regla principal

Antes de editar cualquier archivo, el agente debe:

1. Analizar contexto y requerimiento completo.
2. Presentar un plan breve y concreto.
3. Esperar aprobacion explicita del usuario.

Solo se puede omitir esta espera si el usuario pide de forma explicita ejecutar directamente (por ejemplo: "adelante", "hazlo ya", "ejecuta sin plan", "aplica cambios ahora").

## Plantilla de plan obligatorio

Responder siempre con este formato antes de editar:

1. Objetivo del cambio.
2. Archivos a tocar.
3. Riesgos y regresiones posibles.
4. Validacion (lint/build/flujo manual).
5. Criterio de termino.
6. Pregunta final de aprobacion.

## Convenciones de arquitectura

Antes de crear codigo nuevo, revisar si existe reutilizacion posible en:

- `src/components`
- `src/hooks`
- `src/services`
- `src/context`
- `src/utils`

Preferir extension/refactor de piezas existentes antes de crear nuevas.

## Criterios para crear un componente nuevo

Crear componente nuevo solo si se cumple al menos una condicion:

1. Se reutilizara en 2 o mas vistas/flows.
2. Reduce complejidad de un componente actual demasiado grande.
3. Separa una responsabilidad clara de UI o logica visual.

Si no se cumple, mantenerlo local al modulo.

## Criterios de escalabilidad

- Evitar componentes monoliticos.
- Evitar duplicacion de logica entre paginas.
- Centralizar acceso a datos en servicios.
- Mantener tipos compartidos en `src/types`.
- No mezclar logica de negocio compleja dentro de componentes de presentacion.

## Patrones base para este proyecto

- UI reusable en `src/components`.
- Estado global en providers/context cuando aplique.
- Logica de datos en `src/services`.
- Enrutado y actions en `src/routes`.
- Hooks para encapsular logica repetida.

## Convencion obligatoria de tests

Todos los tests deben centralizarse en el directorio raiz `test/`.

Reglas:

1. No crear tests nuevos dentro de `src/`.
2. Organizar `test/` replicando la estructura de `src/`.
3. Cada caso de uso debe vivir en su carpeta equivalente.

Ejemplos de mapeo:

- `src/utils/index.ts` -> `test/utils/index.test.ts`
- `src/services/error.service.ts` -> `test/services/error.service.test.ts`
- `src/routes/actions/jobs.actions.ts` -> `test/routes/actions/jobs.actions.test.ts`

Convencion de nombres:

- Archivos: `*.test.ts` o `*.test.tsx`.
- Un archivo de test por modulo o caso de uso principal.
- Tests de setup global en `test/setup/`.

Regla de migracion:

- Si existen tests en `src/`, se debe planificar su migracion progresiva a `test/` sin mezclar refactors funcionales en el mismo commit.

## Politica de tests (estado actual del repo)

Actualmente no hay suite de tests consolidada, por lo que:

1. No bloquear cambios por ausencia de tests.
2. Validar siempre con lint y build.
3. Proponer tests como mejora incremental, no como requisito absoluto.
4. Mantener estandar de ubicacion: tests centralizados en `test/` con estructura espejo de `src/`.

Cuando conviene proponer tests ahora:

- Cambios en calculos criticos.
- Validaciones de formularios.
- Servicios con riesgo de regresion.

Recomendacion pragmatica:

- Empezar por 2-3 tests de humo en utilidades/servicios clave.
- Dejar setup minimo primero (Vitest + Testing Library) solo si el usuario lo aprueba.

## Regla de comunicacion

- Explicar que se va a cambiar antes de cambiarlo.
- Pedir confirmacion clara.
- Despues de implementar, reportar que se hizo y como se valido.

## Criterio de salida

- Existe plan aprobado antes de editar.
- Cambios alineados con convenciones del proyecto.
- Validacion ejecutada y reportada.
- Siguientes pasos sugeridos solo si aportan valor.
