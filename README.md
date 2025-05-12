# Raspberry Pi Weather Logger

A full-stack weather logging and visualization system using a Raspberry Pi and DHT11 sensor.

## System Overview

This system consists of three main components:
1. **Data Collection**: A DHT11 sensor connected to a Raspberry Pi collects temperature and humidity data every hour
2. **Data Storage**: Collected data is stored in a MariaDB database
3. **Web Interface**: A web-based dashboard displays the data through interactive charts

### Key Features
- Automatic hourly data collection via cron job
- Real-time temperature and humidity monitoring
- Interactive data visualization with Chart.js
- Support for viewing up to 7 days of historical data

## Prerequisites

- Raspberry Pi
- DHT11 sensor
- MariaDB server
- PHP 7.4 or higher
- Web server (Apache/Nginx)

## Setup Instructions

### Raspberry Pi Setup
1. Install required packages:
   ```bash
   sudo apt-get update
   sudo apt-get install apache2 mariadb-server php php-mysql php-curl
   ```

2. Install Python packages for DHT sensor:
   ```bash
   sudo apt install python3-dev python3-pip -y
   sudo apt install python3-pip python3-setuptools python3-wheel
   sudo pip3 install --break-system-packages adafruit-circuitpython-dht
   ```

3. Test DHT sensor installation:
   ```bash
   python3 -c "import adafruit_dht; print('Adafruit DHT installed successfully')"
   ```

### Hardware Setup
1. Connect the DHT11 sensor to Raspberry Pi:
   - VCC to 3.3V
   - GND to GND
   - DATA to GPIO4 (board.D4)

### Database Setup
1. Set up MariaDB:
   ```bash
   sudo mysql_secure_installation
   ```

2. Create database:
   ```sql
   CREATE DATABASE weather_data;
   ```

3. Import the database schema:
   ```bash
   mysql -u root -p weather_data < database/weather_data.sql
   ```

### Web Application Setup
1. Configure the PHP scripts:
   - Update database credentials in `scripts/collect_data.php` and `scripts/query_data.php`
   - Update the GPIO pin number in `scripts/collect_data.php` if using a different pin

2. Set up the cron job:
   ```bash
   sudo crontab -e
   ```
   Add the following line:
   ```
   0 * * * * /var/www/html/raspberry-pi-weather-logger/cronjobs/data_collection_cron.sh
   ```

3. Set proper permissions:
   ```bash
   sudo chown -R umai:www-data /var/www/html/raspberry-pi-weather-logger
   sudo find /var/www/html/raspberry-pi-weather-logger -type d -exec chmod 775 {} \;
   sudo find /var/www/html/raspberry-pi-weather-logger -type f -exec chmod 664 {} \;
   sudo chmod 775 /var/www/html/raspberry-pi-weather-logger/cronjobs/data_collection_cron.sh
   ```

## Running and Testing the Application

### Testing Data Collection
1. Test the sensor reading:
   ```bash
   php /var/www/html/raspberry-pi-weather-logger/scripts/collect_data.php
   ```
   Expected output: "Data collected and stored successfully"

2. Verify data in database:
   ```bash
   mysql -u root -p
   USE weather_data;
   SELECT * FROM sensor_readings;
   ```

### Testing the Web Interface
1. Access the web interface:
   - Open a web browser
   - Navigate to `http://10.0.0.243/raspberry-pi-weather-logger`

2. Test the visualizations:
   - Select a date range (up to 7 days)
   - Choose data types to display:
     - Temperature - Daily Average
     - Temperature - Hourly Values
     - Humidity - Daily Average
     - Humidity - Hourly Values
   - Click "Generate Charts"
   - Verify that charts appear and are interactive
   - Test different date ranges and data combinations

### Monitoring the System
1. Check data collection logs:
   ```bash
   sudo tail -f /var/log/weather_data_collection.log
   ```

2. Monitor PHP errors:
   ```bash
   sudo tail -f /var/log/apache2/error.log
   ```

## System Explanation

### Data Collection Process
1. The DHT11 sensor reads temperature and humidity data
2. A PHP script processes the sensor data
3. Data is validated and stored in the MariaDB database
4. The cron job runs every hour to collect new readings

### Data Visualization
1. Users can select a date range (up to 7 days)
2. Choose between temperature and humidity data
3. View either daily averages or hourly values
4. Interactive charts update based on user selection

### Security Features
- Database credentials are properly configured
- File permissions are set for security
- Input validation on the web interface
- Prepared SQL statements to prevent injection

## File Structure

```
raspberry-pi-weather-logger/
├── assets/
│   ├── charts.js
│   └── validate.js
├── css/
│   └── style.css
├── database/
│   └── weather_data.sql
├── scripts/
│   ├── collect_data.php
│   └── query_data.php
├── cronjobs/
│   └── data_collection_cron.sh
└── index.html
```

## Troubleshooting

1. Check the cron job log:
   ```bash
   sudo tail -f /var/log/weather_data_collection.log
   ```

2. Verify database connection:
   ```bash
   mysql -u root -p
   ```

3. Check PHP error log:
   ```bash
   sudo tail -f /var/log/apache2/error.log
   ```
