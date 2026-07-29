# Walkthrough — Almacenamiento de resultados del quiz en MySQL

## Archivos creados / modificados

### 1. [crear_tabla.sql](file:///opt/lampp/htdocs/repositorios/desarrolladoraecsainnovacion.github.io/audienciasEntrenamiento/sql/crear_tabla.sql) — `[NEW]`

Script SQL que:
- Crea la base de datos `audiencias_db` si no existe.
- Crea la tabla `quiz_resultados` con columnas para nombre, puntaje, porcentaje, resultado individual de cada pregunta (`p1`–`p10`), un campo `JSON` con el detalle completo, y timestamp automático.

---

### 2. [guardar_resultado.php](file:///opt/lampp/htdocs/repositorios/desarrolladoraecsainnovacion.github.io/audienciasEntrenamiento/guardar_resultado.php) — `[NEW]`

Backend PHP que:
- Conecta a MySQL vía **PDO** con prepared statements (previene SQL injection).
- Recibe un `POST` con `Content-Type: application/json`.
- Valida que el nombre no esté vacío, puntaje sea 0-10, porcentaje 0-100, y que haya exactamente 10 preguntas.
- Ejecuta un `INSERT` preparado en la tabla `quiz_resultados`.
- Retorna JSON `{ success: true/false }`.

> Credenciales por defecto: `localhost` / `root` / `""` / `audiencias_db`. Modificar las variables al inicio del archivo si difieren.

---

### 3. [index.php](file:///opt/lampp/htdocs/repositorios/desarrolladoraecsainnovacion.github.io/audienciasEntrenamiento/index.php) — `[MODIFY]` (líneas ~2108-2142)

Se agregó al final de `submitQuiz()` un bloque `fetch()` que:
- Toma el nombre del input `#script-name` (o `"Anónimo"` si está vacío).
- Construye el payload: `{ nombre_usuario, puntaje, porcentaje, preguntas }`.
- Envía `POST` a `guardar_resultado.php`.
- Muestra `showModal()` con mensaje de éxito o error.

---

## Pasos para activar

1. **Ejecutar el SQL** en phpMyAdmin o consola MySQL:
   ```bash
   mysql -u root < /opt/lampp/htdocs/repositorios/desarrolladoraecsainnovacion.github.io/audienciasEntrenamiento/sql/crear_tabla.sql
   ```

2. **Verificar credenciales** en [guardar_resultado.php](file:///opt/lampp/htdocs/repositorios/desarrolladoraecsainnovacion.github.io/audienciasEntrenamiento/guardar_resultado.php) (líneas 8-11).

3. **Probar**: Completar el quiz y presionar "Evaluar desempeño". Debería aparecer un modal confirmando que el resultado fue guardado.
