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

// Рекурсивная функция для вычисления факториала
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Генерация значений x от -1 до 1 с шагом 0.02
const xValues = Array.from({ length: 100 }, (_, i) => -1 + i * 0.02);

// Вычисление значений arcsin(x) для каждого x в xValues
const arcsinValues = xValues.map(x => Math.asin(x));

// Вычисление значений разложения Тейлора arcsin(x) с 5 членами для каждого x в xValues
const taylorValues = xValues.map(x => taylorArcsin(x, 5));

// Создание и настройка графика
const arcsinChart = new Chart(ctx, {
    type: 'line', // Задаем тип графика "линия"
    data: {
        labels: xValues, // Значения на оси x
        datasets: [
            {
                label: 'arcsin(x)', // Название первого графика
                data: arcsinValues, // Значения arcsin(x) на графике
                borderColor: 'blue', // Цвет линии
                fill: false, // Отключаем заливку под линией
                tension: 0.4, // Сглаживание линии
                pointRadius: 0 // Радиус точек (точки не отображаются)
            },
            {
                label: 'Taylor Series of arcsin(x)', // Название второго графика
                data: taylorValues, // Значения разложения Тейлора на графике
                borderColor: 'red', // Цвет линии
                fill: false, // Отключаем заливку под линией
                tension: 0.4, // Сглаживание линии
                pointRadius: 0 // Радиус точек (точки не отображаются)
            }
        ]
    },
    options: {
        responsive: true, // Адаптивность графика под размеры окна
        scales: {
            x: {
                type: 'linear', // Линейная шкала на оси x
                position: 'center', // Позиция оси x
                title: {
                    display: true,
                    text: 'x' // Подпись оси x
                }
            },
            y: {
                position: 'center', // Позиция оси y
                title: {
                    display: true,
                    text: 'f(x)' // Подпись оси y
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    // Формат вывода значений в подсказке при наведении на точки графика
                    label: function(context) {
                        return `${context.dataset.label}: (${context.label.toFixed(2)}, ${context.raw.toFixed(4)})`;
                    }
                }
            },
            legend: {
                display: true, // Отображение легенды (обозначений графиков)
                position: 'top' // Позиция легенды сверху
            },
            annotation: {
                // Аннотации на графике
                annotations: {
                    intersectionPoint: {
                        type: 'point', // Тип аннотации - точка
                        xValue: 0.5, // Положение по оси x для аннотации
                        yValue: taylorArcsin(0.5, 5), // Значение y для аннотации
                        backgroundColor: 'orange', // Цвет точки аннотации
                        borderWidth: 2, // Толщина границы аннотации
                        borderColor: 'orange', // Цвет границы аннотации
                        radius: 5, // Радиус точки аннотации
                        label: {
                            content: 'Пересечение при x=0.5', // Текст аннотации
                            enabled: true, // Включение отображения текста
                            position: 'top' // Позиция текста над точкой
                        }
                    },
                    guideLine: {
                        type: 'line', // Тип аннотации - линия
                        scaleID: 'x', // Линия будет проходить по оси x
                        value: 0.5, // Значение x, где будет нарисована линия
                        borderColor: 'gray', // Цвет линии
                        borderWidth: 1, // Толщина линии
                        borderDash: [5, 5], // Стиль линии (пунктирная линия)
                        label: {
                            content: 'x = 0.5', // Текст вдоль линии
                            enabled: true, // Включение отображения текста
                            position: 'center' // Позиция текста в центре линии
                        }
                    }
                }
            }
        },
        animation: {
            duration: 2000, // Длительность анимации в миллисекундах
            easing: 'easeInOutQuart' // Тип анимации
        }
    }
});

// Обработчик для кнопки сохранения графика
document.getElementById('saveChartButton').addEventListener('click', function () {
    const image = arcsinChart.toBase64Image(); // Получаем изображение графика
    const link = document.createElement('a');
    link.href = image;
    link.download = 'arcsin_chart.png'; // Название файла
    link.click();
});
