
// Generate full dataset
export function generateChartData(kpi, currentYear) {
    const years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

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

    if (kpi.displayType === 'qualitative') {
        const actual = kpi.data[currentYear] ? kpi.data[currentYear].actual : null;

        // Map value to segment index: 1->0 (Red), 2->1 (Yellow), 3->2 (Green)
        // If actual is null, show all gray

        let bgColors = ['#e2e8f0', '#e2e8f0', '#e2e8f0'];
        let labelText = 'No Data';

        if (actual !== null) {
            if (actual <= 1.5) { // Below
                bgColors = ['#ef4444', '#e2e8f0', '#e2e8f0'];
                labelText = 'Below Peers';
            } else if (actual <= 2.5) { // Inline
                bgColors = ['#e2e8f0', '#f59e0b', '#e2e8f0'];
                labelText = 'Inline';
            } else { // Above
                bgColors = ['#e2e8f0', '#e2e8f0', '#10b981'];
                labelText = 'Above Peers';
            }
        }

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Below', 'Inline', 'Above'],
                datasets: [{
                    data: [1, 1, 1],
                    backgroundColor: bgColors,
                    borderWidth: 2,
                    borderColor: '#fff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                rotation: -90,
                circumference: 180,
                cutout: '80%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    title: {
                        display: true,
                        text: labelText,
                        position: 'bottom',
                        font: { size: 14, weight: 'bold', family: 'Inter' },
                        padding: { top: -10 } // Move up closer to the gauge
                    }
                }
            },
            plugins: [{
                id: 'gaugeText',
                beforeDraw: function (chart) {
                    const width = chart.width,
                        height = chart.height,
                        ctx = chart.ctx;

                    ctx.restore();
                    const fontSize = (height / 114).toFixed(2);
                    ctx.font = "bold " + fontSize + "em Inter";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "#64748b";

                    const text = actual === 3 ? "Top" : (actual === 2 ? "Mid" : "Low");
                    const textX = Math.round((width - ctx.measureText(text).width) / 2);
                    const textY = height / 1.5;

                    ctx.fillText(text, textX, textY);
                    ctx.save();
                }
            }]
        });
    }

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
