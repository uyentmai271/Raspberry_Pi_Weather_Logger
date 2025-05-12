<?php
header('Content-Type: application/json');

// Database configuration
$db_host = 'localhost';
$db_user = 'root';
$db_pass = 'UyenMai2025';
$db_name = 'weather_data';

// Connect to database
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Set timezone to UTC
$conn->query("SET time_zone = '+00:00'");

// Get form data
$startDate = $_POST['startDate'] . ' 00:00:00';
$endDate = $_POST['endDate'] . ' 23:59:59';
$selectedData = $_POST['dataType'];

// Prepare response array
$response = [
    'daily' => [],
    'hourly' => []
];

// Get daily averages
$dailyQuery = "SELECT 
    DATE(datetime) as date,
    AVG(temperature) as temperature,
    AVG(humidity) as humidity
FROM sensor_readings
WHERE datetime BETWEEN ? AND ?
GROUP BY DATE(datetime)
ORDER BY date";

$stmt = $conn->prepare($dailyQuery);
$stmt->bind_param("ss", $startDate, $endDate);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $response['daily'][] = [
        'date' => $row['date'],
        'temperature' => round($row['temperature'], 2),
        'humidity' => round($row['humidity'], 2)
    ];
}

// Get hourly values
$hourlyQuery = "SELECT 
    datetime,
    temperature,
    humidity
FROM sensor_readings
WHERE datetime BETWEEN ? AND ?
ORDER BY datetime";

$stmt = $conn->prepare($hourlyQuery);
$stmt->bind_param("ss", $startDate, $endDate);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $response['hourly'][] = [
        'datetime' => $row['datetime'],
        'temperature' => round($row['temperature'], 2),
        'humidity' => round($row['humidity'], 2)
    ];
}

$stmt->close();
$conn->close();

echo json_encode($response);
?> 