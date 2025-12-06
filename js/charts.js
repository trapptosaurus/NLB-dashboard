
// Generate full dataset
export function generateChartData(kpi, currentYear) {
    const years = [2025, 2026, 2027, 2028, 2029, 2030];

    const plans = years.map(y => kpi.data[y] ? kpi.data[y].plan : null);
    const actuals = years.map(y => {
        if (y > currentYear) return null; // Don't show future actuals
        return kpi.data[y] ? kpi.data[y].actual : null;
    });

    return {
        labels: years,
        datasets: [
            {
                label: 'Actual',
                data: actuals,
                borderColor: '#4f46e5', // Primary color
                backgroundColor: '#4f46e5',
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                fill: false,
                spanGaps: true
            },
            {
                label: 'Plan',
                data: plans,
                borderColor: '#94a3b8', // Slate 400 - lighter for plan
                backgroundColor: '#94a3b8',
                borderWidth: 2,
                borderDash: [5, 5], // Dotted line
                tension: 0.1,
                pointRadius: 2,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                fill: false
            }
        ]
    };
}

export function createChart(canvasId, kpi, currentYear) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const chartData = generateChartData(kpi, currentYear);

    return new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        boxWidth: 10,
                        usePointStyle: true,
                        font: {
                            size: 10,
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.parsed.y} ${kpi.unit}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 10
                        },
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 10
                        },
                        color: '#64748b'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}
