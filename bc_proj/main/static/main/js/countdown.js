document.addEventListener("DOMContentLoaded", function() {
    const timerElement = document.getElementById("countdown-timer");
    const countdownTime = 60 * 60 * 1000; // 1 час в миллисекундах
    let endTime = localStorage.getItem("countdownEndTime");

    if (!endTime) {
        // Установим конечное время, если его еще нет в localStorage
        endTime = Date.now() + countdownTime;
        localStorage.setItem("countdownEndTime", endTime);
    }

    // Функция обновления таймера
    function updateTimer() {
        const now = Date.now();
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
            // Таймер завершен
            timerElement.textContent = "Время истекло!";
            localStorage.removeItem("countdownEndTime");
        } else {
            // Вычисляем часы, минуты и секунды
            const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
            const seconds = Math.floor((timeLeft / 1000) % 60);

            // Отображаем таймер в формате чч:мм:сс
            timerElement.textContent = `Осталось ни много ни мало ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Запускаем обновление таймера каждую секунду
    setInterval(updateTimer, 1000);
    updateTimer(); // Первоначальный вызов для отображения сразу
});
