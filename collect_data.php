<?php
// Database configuration
$db_host = 'localhost';
$db_user = 'root';
$db_pass = 'UyenMai2025';
$db_name = 'weather_data';

// Connect to database
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set timezone to UTC
$conn->query("SET time_zone = '+00:00'");

// Function to read DHT sensor data
function readDHT($pin) {
    // Using Adafruit DHT library
    $result = shell_exec("python3 -c 'import adafruit_dht; import board; dht = adafruit_dht.DHT11(board.D4); print(f\"{dht.temperature} {dht.humidity}\")'");
    $data = explode(" ", trim($result));
    
    if (count($data) == 2) {
        return array(
            'temperature' => floatval($data[0]),
            'humidity' => floatval($data[1])
        );
    } else {
        // If reading fails, return null values
        return array(
            'temperature' => null,
            'humidity' => null
        );
    }
}

// Read sensor data
$sensor_data = readDHT(4); // Using GPIO4 (board.D4)

// Only insert data if we got valid readings
if ($sensor_data['temperature'] !== null && $sensor_data['humidity'] !== null) {
    // Prepare and execute the SQL statement
    $stmt = $conn->prepare("INSERT IGNORE INTO sensor_readings (temperature, humidity) VALUES (?, ?)");
    $stmt->bind_param("dd", $sensor_data['temperature'], $sensor_data['humidity']);

    if ($stmt->execute()) {
        echo "Data collected and stored successfully\n";
    } else {
        echo "Error storing data: " . $stmt->error . "\n";
    }

    $stmt->close();
} else {
    echo "Error reading sensor data\n";
}

$conn->close();
?> 