---
name: clean-proyect
description: "Ejecutar limpieza tecnica antes de subir cambios: lint, format, verificacion, limpieza de logs/comentarios de depuracion y build final. USE FOR: cleaner, limpiar proyecto, pasar linter, pasar prettier, preparar para GitHub, limpieza pre-commit."
---

# Clean Proyect

Workflow estandar para dejar el repo en estado listo para commit y PR.

## Objetivo

- Ejecutar limpieza automatica y validacion final.
- Reducir errores de estilo/compilacion antes de subir cambios.
- Evitar que queden logs o codigo comentado de depuracion.

## Cuándo usar esta skill

- Antes de commit o push.
- Antes de abrir PR.
- Cuando se pida "pasa el cleaner" o equivalente.

## Prerrequisitos

1. Dependencias instaladas (`npm install`).
2. Estar en la raiz del repositorio.

## Secuencia obligatoria

1. `npm run lint:fix`
2. `npm run format`
3. `npm run lint`
4. `npm run format:check`
5. `npm run build`

## Limpieza de depuracion (despues de secuencia)

Buscar en `src/`:

- `console.log`
- `console.table`
- `debugger`
- comentarios temporales (`TODO/FIXME/HACK` no planeados)

### Comando recomendado (si hay `rg`)

`rg -n "console\\.log|console\\.table|debugger" src`

### Fallback Windows PowerShell (si no hay `rg`)

`Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx,*.js,*.jsx | Select-String -Pattern 'console\\.log|console\\.table|debugger' -CaseSensitive:$false`

## Criterio de exito

- Todos los comandos de la secuencia terminan con codigo 0.
- No hay errores de lint.
- No hay errores de build.
- No quedan trazas de depuracion no justificadas.

## Manejo de errores

1. Si falla `lint:fix`, correr `npm run lint` y corregir errores manuales.
2. Si falla `format:check`, correr de nuevo `npm run format`.
3. Si falla build, corregir errores de TypeScript/Vite y repetir secuencia.
4. No hacer cambios destructivos en git (sin reset hard) para "limpiar".

## Resultado esperado

- Repo consistente para commit.
- Cambios acotados a limpieza/estilo/compilacion.
- Estado final validado con evidencia de comandos.
