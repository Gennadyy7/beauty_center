document.addEventListener("DOMContentLoaded", function () {
    // Находим кнопку премирования и добавляем к ней обработчик события
    const rewardButton = document.getElementById("rewardButton");
    rewardButton.addEventListener("click", function () {
        // Получаем все чекбоксы премируемых сотрудников
        const checkboxes = document.querySelectorAll(".reward-checkbox:checked");
        const surnames = [];

        // Проходимся по каждому чекбоксу и добавляем фамилию сотрудника в массив
        checkboxes.forEach((checkbox) => {
            surnames.push(checkbox.getAttribute("data-name"));
        });

        // Формируем текст премирования
        let rewardText;
        if (surnames.length > 0) {
            rewardText = `Следующие сотрудники были удостоены премии: ${surnames.join(", ")}.`;
        } else {
            rewardText = "Ни один сотрудник не выбран для премирования.";
        }

        // Отображаем текст премирования в div под таблицей
        document.getElementById("rewardOutput").innerText = rewardText;
    });
});