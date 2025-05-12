#!/bin/bash

# Log file for the cron job
LOG_FILE="/var/log/weather_data_collection.log"

# Get the current timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Run the PHP script and log the output
echo "[$TIMESTAMP] Starting data collection..." >> $LOG_FILE
php /var/www/html/raspberry-pi-weather-logger/scripts/collect_data.php >> $LOG_FILE 2>&1
echo "[$TIMESTAMP] Data collection completed." >> $LOG_FILE 