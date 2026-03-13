---
name: capture-project-screenshots
description: "Generar screenshots o gifs del proyecto para README o documentacion. USE FOR: screenshot, screenshots, capturas, imagenes del proyecto, gif demo, actualizar README con imagenes, evidencia visual de UI."
---

# Capture Project Screenshots

Skill para generar evidencia visual del proyecto (imagenes y opcionalmente gifs) de forma consistente y reutilizable.

## Objetivo

- Capturar pantallas clave de la app para README y documentacion tecnica.
- Guardar archivos en rutas estables para evitar links rotos.
- Mantener convenciones de nombre para facilitar mantenimiento.

## Cuándo usar esta skill

Usar cuando el usuario pida:

- Crear screenshots del proyecto.
- Actualizar README con imagenes de la app.
- Generar material visual para PR, demo o documentacion.
- Capturar vistas desktop y mobile.

## Prerrequisitos

1. Dependencias instaladas (npm install).
2. App ejecutandose en local (normalmente npm run dev).
3. Rutas o vistas objetivo definidas por el usuario.
4. Si hay autenticacion, tener cuenta de prueba o flujo de acceso habilitado.

## Estandar de salida

- Carpeta destino recomendada: public/img/readme/
- Subcarpetas opcionales:
  - public/img/readme/desktop/
  - public/img/readme/mobile/
  - public/img/readme/gif/

## Convencion de nombres

Usar nombres en kebab-case con sufijo por viewport:

- home-desktop.png
- home-mobile.png
- records-list-desktop.png
- records-list-mobile.png
- job-profiles-desktop.png

Si se captura una secuencia, agregar indice:

- add-record-step-1-desktop.png
- add-record-step-2-desktop.png

## Flujo recomendado

1. Validar rutas a capturar con el usuario.
2. Levantar app local si no esta activa.
3. Capturar por cada ruta en desktop y mobile.
4. Revisar calidad visual y recortar si hace falta.
5. Guardar archivos en public/img/readme.
6. Actualizar README con rutas relativas.
7. Verificar que las imagenes se renderizan en Markdown.

## Viewports sugeridos

- Desktop: 1440x900
- Mobile: 390x844

## Checklist de calidad

- Sin datos sensibles (tokens, email real, secretos).
- Sin overlays de debug o errores de consola visibles.
- Estados utiles para el usuario (empty, loading, success) cuando aplique.
- Peso razonable por imagen para no inflar el repo.

## Integracion con README

Agregar una seccion visual con imagenes y texto breve por pantalla.

Ejemplo de estructura:

- Vista principal
- Listado de registros
- Detalle o formulario
- Perfiles de trabajo

## Notas operativas

- No requiere MCP para capturas basicas.
- Se puede usar automatizacion con Playwright para repetir capturas de forma confiable.
- Si no hay automatizacion disponible, capturar manualmente y seguir la misma convencion de nombres.
