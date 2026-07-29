<?php
// ============================================================
// db.php
// Conexión unificada y centralizada a la base de datos MySQL
// ============================================================

$db_host = $_SERVER["BD_URL_AECSA_TEST"];
$db_user = $_SERVER["BD_USER_AECSA_TEST"];
$db_pass = $_SERVER["BD_PASS_AECSA_TEST"];
$db_name = $_SERVER["BD_NAME_AECSA_TEST"];

try {
    $pdo = new PDO(
        "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
        $db_user,
        $db_pass,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error'   => 'Error de conexión a la base de datos.',
        'Message' => $e->getMessage(),
    ]);
    exit;
}
