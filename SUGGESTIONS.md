# Sugerencias de mejora - Horas Adicionales

Revisión de la documentación y del código local: 18 de noviembre de 2026. Las prioridades son propuestas, no indican que haya trabajo en curso.

## Prioridad alta

### Migración de fechas de registros

El modelo actual usa `dateTimeRecord`. `records.service.ts` todavía admite el campo heredado `fecha` y, al leer un documento, intenta migrarlo en segundo plano. Las consultas con rango de fechas filtran por `dateTimeRecord`, por lo que un documento que solo tenga `fecha` podría no aparecer en esas consultas y, por tanto, no migrarse mediante esa lectura.

- Comprobar el alcance de los datos heredados y definir cómo completar y verificar la migración.
- Revisar las consultas y pruebas con registros antiguos antes de retirar la compatibilidad.

### Consistencia en el manejo de errores

Varios servicios ya propagan errores, pero algunos flujos aún usan valores de retorno para comunicar fallos. Por ejemplo, `deleteRecord` devuelve `false` ante un error, y la actualización de tarifas devuelve `0` cuando no hay usuario autenticado.

- Revisar los contratos de los servicios y sus consumidores para distinguir errores de resultados vacíos o ausentes.
- Mantener el tratamiento centralizado y ofrecer feedback adecuado en la interfaz.

## Prioridad media

### Pruebas de integración y seguridad

- Evaluar pruebas de extremo a extremo para los flujos críticos y pruebas de reglas con el emulador de Firestore.
- Documentar el despliegue y la validación de reglas e índices por entorno. Las reglas versionadas permiten lectura pública de catálogos y restringen los datos de `users/{userId}` al usuario autenticado correspondiente; esto no verifica la configuración desplegada.
- Revisar en GitHub la protección de ramas y los checks obligatorios. El workflow de CI está versionado, pero su configuración efectiva no se puede deducir del repositorio local.

### Logs y rendimiento

- Revisar los mensajes de consola, incluidos los de migración y errores, y decidir cuáles conservar.
- Vigilar el tamaño del bundle y la limpieza de las suscripciones cuando crezca la aplicación.

## Elementos ya abordados

- `PrivateLayout` espera a `isAuthResolved` y muestra carga antes de decidir el acceso.
- Los archivos con nombres inconsistentes mencionados anteriormente fueron renombrados.
- Existen filtros de registros por fecha, perfil, rama, puesto, tarifa y horas, además de selección de periodo.
- El repositorio incluye CI para lint, compilación y pruebas. Consultar [README.md](README.md) para su uso.
