document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('dataForm');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const checkboxes = document.querySelectorAll('input[name="dataType"]');
    const submitBtn = document.getElementById('submitBtn');

    // Set max date to today
    const today = new Date().toISOString().split('T')[0];
    startDate.max = today;
    endDate.max = today;

    // Set min date to 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    startDate.min = sevenDaysAgo.toISOString().split('T')[0];
    endDate.min = sevenDaysAgo.toISOString().split('T')[0];

    function validateForm() {
        // Check if dates are valid
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        const dateRangeValid = start <= end && 
                             (end - start) / (1000 * 60 * 60 * 24) <= 7;

        // Check if at least one checkbox is selected
        const checkboxSelected = Array.from(checkboxes).some(cb => cb.checked);

        // Enable/disable submit button
        submitBtn.disabled = !(dateRangeValid && checkboxSelected);
    }

    // Add event listeners
    startDate.addEventListener('change', validateForm);
    endDate.addEventListener('change', validateForm);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateForm);
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const selectedData = Array.from(formData.getAll('dataType'));
        
        // Call the PHP script to get data
        fetch('scripts/query_data.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Update charts with the received data
            updateCharts(data, selectedData);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching data. Please try again.');
        });
    });
}); 