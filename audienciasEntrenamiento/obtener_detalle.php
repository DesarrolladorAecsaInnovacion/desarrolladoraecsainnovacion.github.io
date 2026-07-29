<?php
// ============================================================
// obtener_detalle.php
// Retorna el detalle completo de una evaluación específica
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido.']);
    exit;
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'ID de evaluación inválido.']);
    exit;
}

require_once __DIR__ . '/db.php';

try {
    $sql = "SELECT * FROM SPAEvaluacion WHERE id = :id LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $id]);
    $evaluacion = $stmt->fetch();

    if (!$evaluacion) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Evaluación no encontrada.']);
        exit;
    }

    // Verificar existencia real de los archivos de audio
    $audioFields = ['audio_p2', 'audio_p6', 'audio_p9'];
    foreach ($audioFields as $field) {
        if (!empty($evaluacion[$field])) {
            $filePath = __DIR__ . '/' . $evaluacion[$field];
            $evaluacion[$field . '_exists'] = file_exists($filePath);
        } else {
            $evaluacion[$field . '_exists'] = false;
        }
    }

    // Decodificar detalle_json si existe
    if (!empty($evaluacion['detalle_json'])) {
        $evaluacion['detalle'] = json_decode($evaluacion['detalle_json'], true);
    } else {
        $evaluacion['detalle'] = [];
    }

    echo json_encode([
        'success' => true,
        'data'    => $evaluacion,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al consultar el detalle.', 'Message' => $e->getMessage()]);
    exit;
}
