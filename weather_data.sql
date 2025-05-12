-- Create the weather_data database
CREATE DATABASE IF NOT EXISTS weather_data;
USE weather_data;

-- Create the sensor_readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    temperature DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    UNIQUE KEY unique_reading (datetime)
);

-- Create indexes for better query performance
CREATE INDEX idx_datetime ON sensor_readings(datetime); 
