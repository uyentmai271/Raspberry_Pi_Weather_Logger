let dailyChart = null;
let hourlyChart = null;

function updateCharts(data, selectedData) {
    // Destroy existing charts if they exist
    if (dailyChart) dailyChart.destroy();
    if (hourlyChart) hourlyChart.destroy();

    // Prepare data for daily averages
    const dailyData = {
        labels: data.daily.map(d => d.date),
        datasets: []
    };

    // Prepare data for hourly values
    const hourlyData = {
        labels: data.hourly.map(h => h.datetime),
        datasets: []
    };

    // Add temperature daily average if selected
    if (selectedData.includes('temp_daily')) {
        dailyData.datasets.push({
            label: 'Temperature (°C) - Daily Average',
            data: data.daily.map(d => d.temperature),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1
        });
    }

    // Add humidity daily average if selected
    if (selectedData.includes('humidity_daily')) {
        dailyData.datasets.push({
            label: 'Humidity (%) - Daily Average',
            data: data.daily.map(d => d.humidity),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1
        });
    }

    // Add temperature hourly values if selected
    if (selectedData.includes('temp_hourly')) {
        hourlyData.datasets.push({
            label: 'Temperature (°C) - Hourly',
            data: data.hourly.map(h => h.temperature),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1
        });
    }

    // Add humidity hourly values if selected
    if (selectedData.includes('humidity_hourly')) {
        hourlyData.datasets.push({
            label: 'Humidity (%) - Hourly',
            data: data.hourly.map(h => h.humidity),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1
        });
    }

    // Create daily chart if there are daily datasets
    if (dailyData.datasets.length > 0) {
        dailyChart = new Chart(document.getElementById('dailyChart'), {
            type: 'line',
            data: dailyData,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Daily Averages'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // Create hourly chart if there are hourly datasets
    if (hourlyData.datasets.length > 0) {
        hourlyChart = new Chart(document.getElementById('hourlyChart'), {
            type: 'line',
            data: hourlyData,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Hourly Values'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
} 