const ctx = document.getElementById('arcsinChart').getContext('2d');

// Функция для вычисления разложения в ряд Тейлора для arcsin(x)
function taylorArcsin(x, terms = 10) {
    let sum = 0;
    for (let n = 0; n < terms; n++) {
        const coefficient = (factorial(2 * n) / (Math.pow(4, n) * Math.pow(factorial(n), 2) * (2 * n + 1)));
        sum += coefficient * Math.pow(x, 2 * n + 1);
    }
    return sum;
}

// Факториал
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Данные для построения графиков
const xValues = Array.from({ length: 100 }, (_, i) => -1 + i * 0.02); // x от -1 до 1
const arcsinValues = xValues.map(x => Math.asin(x));
const taylorValues = xValues.map(x => taylorArcsin(x, 5)); // 5 членов разложения Тейлора

// Создаем график с анимацией и аннотациями
const arcsinChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: xValues,
        datasets: [
            {
                label: 'arcsin(x)',
                data: arcsinValues,
                borderColor: 'blue',
                fill: false,
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'Taylor Series of arcsin(x)',
                data: taylorValues,
                borderColor: 'red',
                fill: false,
                tension: 0.4,
                pointRadius: 0
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'linear',
                position: 'center',
                title: {
                    display: true,
                    text: 'x'
                }
            },
            y: {
                position: 'center',
                title: {
                    display: true,
                    text: 'f(x)'
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: (${context.label.toFixed(2)}, ${context.raw.toFixed(4)})`;
                    }
                }
            },
            legend: {
                display: true,
                position: 'top'
            },
            annotation: {
                annotations: {
                    intersectionPoint: {
                        type: 'point',
                        xValue: 0.5, // точка на оси x, где добавляется аннотация
                        yValue: taylorArcsin(0.5, 5), // значение Taylor Series при x = 0.5
                        backgroundColor: 'orange',
                        borderWidth: 2,
                        borderColor: 'orange',
                        radius: 5,
                        label: {
                            content: 'Пересечение при x=0.5',
                            enabled: true,
                            position: 'top'
                        }
                    },
                    guideLine: {
                        type: 'line',
                        scaleID: 'x',
                        value: 0.5,
                        borderColor: 'gray',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        label: {
                            content: 'x = 0.5',
                            enabled: true,
                            position: 'center'
                        }
                    }
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
        }
    }
});
