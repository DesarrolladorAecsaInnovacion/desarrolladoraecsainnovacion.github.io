<?php
// ============================================================
// obtener_evaluaciones.php
// Retorna la lista de evaluaciones (datos básicos)
// ============================================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido.']);
    exit;
}

require_once __DIR__ . '/db.php';

try {
    $sql = "SELECT id, nombre_usuario, puntaje, porcentaje, fecha_registro 
            FROM SPAEvaluacion 
            ORDER BY fecha_registro DESC";

    $stmt = $pdo->query($sql);
    $evaluaciones = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data'    => $evaluaciones,
        'total'   => count($evaluaciones),
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al consultar evaluaciones.', 'Message' => $e->getMessage()]);
    exit;
}
