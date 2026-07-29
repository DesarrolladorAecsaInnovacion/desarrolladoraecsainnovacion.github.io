<?php
// ============================================================
// guardar_resultado.php
// Backend para almacenar resultados del quiz en MySQL
// Soporta archivos de audio (preguntas 2, 6 y 9)
// ============================================================



// --- Directorio para almacenar audios ---
$audioDir = __DIR__ . '/audios';

// --- Headers CORS y JSON ---
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido. Use POST.']);
    exit;
}

// --- Leer datos del FormData ---
$nombre_usuario = trim($_POST['nombre_usuario'] ?? '');
$puntaje        = isset($_POST['puntaje']) ? intval($_POST['puntaje']) : -1;
$porcentaje     = isset($_POST['porcentaje']) ? intval($_POST['porcentaje']) : -1;
$preguntasJSON  = $_POST['preguntas'] ?? '';
$preguntas      = json_decode($preguntasJSON, true);

// --- Validar campos requeridos ---
if ($nombre_usuario === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'El nombre del usuario es obligatorio.']);
    exit;
}

if ($puntaje < 0 || $puntaje > 10) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'El puntaje debe estar entre 0 y 10.']);
    exit;
}

if ($porcentaje < 0 || $porcentaje > 100) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'El porcentaje debe estar entre 0 y 100.']);
    exit;
}

if (!is_array($preguntas) || count($preguntas) !== 10) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Se requieren exactamente 10 resultados de preguntas.']);
    exit;
}

// --- Extraer resultados individuales (p1 a p10) ---
$p = [];
for ($i = 0; $i < 10; $i++) {
    $p[$i] = !empty($preguntas[$i]['isCorrect']) ? 1 : 0;
}

// --- Crear directorio de audios si no existe ---
if (!is_dir($audioDir)) {
    mkdir($audioDir, 0755, true);
}

// --- Procesar archivos de audio (preguntas 2, 6, 9) ---
$audioQuestions = [2, 6, 9];
$audioPaths = ['audio_p2' => null, 'audio_p6' => null, 'audio_p9' => null];

// Generar un identificador único para este envío
$uniqueId = date('Ymd_His') . '_' . bin2hex(random_bytes(4));
$safeNombre = preg_replace('/[^a-zA-Z0-9_-]/', '_', substr($nombre_usuario, 0, 50));

foreach ($audioQuestions as $qId) {
    $fieldName = "audio_p{$qId}";
    if (isset($_FILES[$fieldName]) && $_FILES[$fieldName]['error'] === UPLOAD_ERR_OK) {
        $tmpFile  = $_FILES[$fieldName]['tmp_name'];
        $fileSize = $_FILES[$fieldName]['size'];

        // Validar tamaño máximo (10 MB)
        if ($fileSize > 10 * 1024 * 1024) {
            continue;
        }

        // Validar tipo MIME
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($tmpFile);
        $allowedMimes = ['audio/webm', 'audio/ogg', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'video/webm'];
        if (!in_array($mimeType, $allowedMimes)) {
            continue;
        }

        // Determinar extensión
        $ext = 'webm';
        if (strpos($mimeType, 'ogg') !== false) $ext = 'ogg';
        elseif (strpos($mimeType, 'wav') !== false) $ext = 'wav';
        elseif (strpos($mimeType, 'mpeg') !== false) $ext = 'mp3';

        $fileName = "{$safeNombre}_p{$qId}_{$uniqueId}.{$ext}";
        $destPath = $audioDir . '/' . $fileName;

        if (move_uploaded_file($tmpFile, $destPath)) {
            $audioPaths[$fieldName] = "audios/{$fileName}";
        }
    }
}

// --- Leer textos transcritos opcionales (preguntas 2, 6, 9) ---
$texto_p2 = isset($_POST['texto_p2']) && trim($_POST['texto_p2']) !== '' ? trim($_POST['texto_p2']) : null;
$texto_p6 = isset($_POST['texto_p6']) && trim($_POST['texto_p6']) !== '' ? trim($_POST['texto_p6']) : null;
$texto_p9 = isset($_POST['texto_p9']) && trim($_POST['texto_p9']) !== '' ? trim($_POST['texto_p9']) : null;

// --- Conexión a la base de datos ---
require_once __DIR__ . '/db.php';

// --- Insertar el registro ---
try {
    $sql = "INSERT INTO SPAEvaluacion 
            (nombre_usuario, puntaje, porcentaje, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, audio_p2, audio_p6, audio_p9, texto_p2, texto_p6, texto_p9, detalle_json) 
            VALUES 
            (:nombre_usuario, :puntaje, :porcentaje, :p1, :p2, :p3, :p4, :p5, :p6, :p7, :p8, :p9, :p10, :audio_p2, :audio_p6, :audio_p9, :texto_p2, :texto_p6, :texto_p9, :detalle_json)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nombre_usuario' => $nombre_usuario,
        ':puntaje'        => $puntaje,
        ':porcentaje'     => $porcentaje,
        ':p1'             => $p[0],
        ':p2'             => $p[1],
        ':p3'             => $p[2],
        ':p4'             => $p[3],
        ':p5'             => $p[4],
        ':p6'             => $p[5],
        ':p7'             => $p[6],
        ':p8'             => $p[7],
        ':p9'             => $p[8],
        ':p10'            => $p[9],
        ':audio_p2'       => $audioPaths['audio_p2'],
        ':audio_p6'       => $audioPaths['audio_p6'],
        ':audio_p9'       => $audioPaths['audio_p9'],
        ':texto_p2'       => $texto_p2,
        ':texto_p6'       => $texto_p6,
        ':texto_p9'       => $texto_p9,
        ':detalle_json'   => json_encode($preguntas, JSON_UNESCAPED_UNICODE),
    ]);

    $insertId = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Resultado guardado exitosamente.',
        'id'      => intval($insertId),
        'audios'  => $audioPaths
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al guardar el resultado en la base de datos.', 'Message' => $e->getMessage()]);
    exit;
}
