---
name: generate-the-project-readme-md
description: "Generar o rehacer README.md del proyecto con estructura completa y datos reales del repo. USE FOR: crear readme, actualizar readme, documentar proyecto, badges, setup de entorno, scripts, demo, capturas para readme."
---

# Generate Project README

Skill para crear un README claro, util y consistente con el estado real del codigo.

## Objetivo

- Documentar el proyecto para onboarding rapido.
- Evitar desalineacion entre README y configuracion real.
- Mantener una estructura estable y reutilizable.

## Fuentes de verdad obligatorias

Antes de escribir README, leer:

1. `package.json` (scripts, dependencias, versionado).
2. `.env.example` (variables requeridas).
3. Estructura actual de carpetas principales.
4. `README.md` existente (si existe) para preservar contenido util.

No inventar comandos ni versiones que no esten en el proyecto.

## Estructura minima requerida

1. Titulo del proyecto.
2. Badges principales (stack base y estado del proyecto).
3. Resumen corto.
4. Funcionalidades actuales.
5. Stack tecnico (alineado con `package.json`).
6. Requisitos.
7. Configuracion de entorno (`.env.example`).
8. Instalacion y ejecucion.
9. Scripts disponibles (solo existentes).
10. Estructura principal del proyecto.
11. Enlaces a documentacion oficial de tecnologias.
12. Seccion de demo/screenshots (si existe material).

## Flujo recomendado

1. Verificar si `README.md` existe.
2. Si no existe, crearlo con la estructura minima.
3. Si existe, actualizar solo secciones desalineadas.
4. Validar scripts contra `package.json`.
5. Validar variables contra `.env.example`.
6. Confirmar que links y rutas de imagenes sean reales.

## Reglas de calidad

- Usar lenguaje claro y directo.
- Mantener coherencia de nombres de comandos.
- Evitar contenido marketing vacio.
- No exponer secretos ni credenciales.

## Checklist final

- `README.md` existe y abre correctamente en Markdown.
- Los scripts listados existen en `package.json`.
- Las variables de entorno coinciden con `.env.example`.
- Las rutas de screenshots apuntan a archivos reales.
- No hay contradicciones de versiones dentro del README.

## Integracion con screenshots

Si el usuario pide imagenes, usar la skill `capture-project-screenshots` y luego actualizar README con rutas relativas en una seccion visual.