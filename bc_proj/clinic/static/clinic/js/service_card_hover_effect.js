document.addEventListener("DOMContentLoaded", function () {
    // Находим все элементы с классом service-card
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach(card => {
        // Добавляем обработчик для эффекта наклона при наведении мыши
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2; // Горизонтальное положение курсора относительно центра карточки
            const y = e.clientY - rect.top - rect.height / 2; // Вертикальное положение курсора относительно центра карточки

            // Устанавливаем вращение карточки по X и Y в зависимости от положения курсора
            card.style.transform = `rotateY(${x / 20}deg) rotateX(${-y / 20}deg)`;
            card.style.transition = "transform 0.1s ease";
        });

        // Убираем эффект при уходе курсора с карточки
        card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateY(0deg) rotateX(0deg)";
            card.style.transition = "transform 0.3s ease";
        });
    });
});
