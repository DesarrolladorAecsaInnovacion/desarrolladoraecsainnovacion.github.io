-- ============================================================
-- Tabla: quiz_resultados
-- Base de datos: audiencias_db
-- Descripción: Almacena los resultados del examen interactivo
--              de audiencia inicial (10 preguntas).
-- ============================================================

CREATE DATABASE IF NOT EXISTS audiencias_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE audiencias_db;

CREATE TABLE IF NOT EXISTS SPAEvaluacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario INT NOT NULL COMMENT 'ID del usuario (FK a usuarios.id)',
    puntaje TINYINT UNSIGNED NOT NULL COMMENT 'Nota obtenida (0-10)',
    porcentaje TINYINT UNSIGNED NOT NULL COMMENT 'Porcentaje (0-100)',
    p1 TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Pregunta 1 - Conciliación (V/F)',
    p2 TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Pregunta 2 - Presentación (Audio)',
    p3 TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Pregunta 3 - Excepciones previas (Caso)',
    p4 TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Pregunta 4 - Interrogatorio (Ahorcado)',
    p5 TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Pregunta 5 - Control legalidad (Texto)',
    p6 TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Pregunta 6 - Impugnación (Audio)',
    p7 TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Pregunta 7 - Fijación litigio (Clasificar)',
    p8 TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Pregunta 8 - Decreto pruebas (MCQ)',
    p9 TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Pregunta 9 - Apelación parcial (Audio)',
    p10 TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Pregunta 10 - Secuencia CGP (Ordenar)',
    audio_p2 VARCHAR(500) NULL COMMENT 'Ruta del audio grabado - Pregunta 2',
    audio_p6 VARCHAR(500) NULL COMMENT 'Ruta del audio grabado - Pregunta 6',
    audio_p9 VARCHAR(500) NULL COMMENT 'Ruta del audio grabado - Pregunta 9',
    texto_p2 TEXT NULL COMMENT 'Texto respuesta - Pregunta 2',
    texto_p6 TEXT NULL COMMENT 'Texto respuesta - Pregunta 6',
    texto_p9 TEXT NULL COMMENT 'Texto respuesta - Pregunta 9',
    detalle_json JSON NULL COMMENT 'Arreglo completo de resultados por pregunta',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora del registro',
    CONSTRAINT fk_spaevaluacion_usuario FOREIGN KEY (nombre_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
