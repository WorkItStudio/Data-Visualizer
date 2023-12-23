let customChart;

function generateChart() {
    try {
        // Get user input
        const categoriesInput = document.getElementById('categoryInput').value;
        const salesInput = document.getElementById('salesInput').value;
        const chartType = document.getElementById('chartType').value;

        // Convert input strings to arrays
        const categories = parseInput(categoriesInput);
        const sales = parseInput(salesInput);

        // Remove previous chart if exists
        destroyChart();

        // Get the canvas element
        const ctx = document.getElementById('customChart').getContext('2d');

        // Generate an array of distinct colors
        const colors = generateDistinctColors(categories.length);

        // Create a custom chart based on user input
        customChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: categories,
                datasets: [{
                    label: 'Custom Chart',
                    data: sales,
                    backgroundColor: colors,
                    borderColor: colors.map(color => `${color}E0`), // Add some transparency to border
                    borderWidth: 1
                }]
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            const dataset = data.datasets[tooltipItem.datasetIndex];
                            const total = dataset.data.reduce((accumulator, currentValue) => accumulator + currentValue);
                            const currentValue = dataset.data[tooltipItem.index];
                            const percentage = ((currentValue / total) * 100).toFixed(2);
                            return `${data.labels[tooltipItem.index]}: ${percentage}%`;
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error generating chart:', error.message);
    }
}

function resetChart() {
    // Clear input fields
    document.getElementById('categoryInput').value = '';
    document.getElementById('salesInput').value = '';

    // Remove previous chart if exists
    destroyChart();
}

function exportData() {
    try {
        // Get user input
        const categoriesInput = document.getElementById('categoryInput').value;
        const salesInput = document.getElementById('salesInput').value;

        // Convert input strings to arrays
        const categories = parseInput(categoriesInput);
        const sales = parseInput(salesInput);

        // Create a CSV string
        const csvContent = generateCSV(categories, sales);

        // Create a Blob with the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Create a download link
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'chart_data.csv';

        // Append the link to the body and trigger the click event
        document.body.appendChild(link);
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting data:', error.message);
    }
}

function destroyChart() {
    // Remove previous chart if exists
    if (customChart) {
        customChart.destroy();
    }
}

function parseInput(inputString) {
    // Parse input strings to arrays
    return inputString.split(',').map(item => item.trim());
}

function generateCSV(categories, sales) {
    // Create a CSV string
    let csvContent = 'Category,Sale\n';
    for (let i = 0; i < categories.length; i++) {
        csvContent += `${categories[i]},${sales[i]}\n`;
    }
    return csvContent;
}

// Function to generate an array of distinct colors
function generateDistinctColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(getRandomColor());
    }
    return colors;
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
