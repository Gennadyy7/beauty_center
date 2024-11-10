document.addEventListener("DOMContentLoaded", function () {
    // Находим поле даты рождения
    const birthdateField = document.querySelector("#id_birth_date");

    // Добавляем обработчик события "blur", чтобы реагировать на уход фокуса
    birthdateField.addEventListener("blur", function () {
        // Получаем значение даты
        const birthdateValue = birthdateField.value;

        // Проверяем, введена ли дата
        if (birthdateValue) {
            const birthdate = new Date(birthdateValue);

            // Проверяем, что дата введена корректно
            if (isNaN(birthdate.getTime())) {
                alert("Пожалуйста, введите корректную дату рождения.");
                return;
            }

            // Получаем текущую дату и рассчитываем возраст
            const today = new Date();
            let age = today.getFullYear() - birthdate.getFullYear();
            const monthDiff = today.getMonth() - birthdate.getMonth();
            const dayDiff = today.getDate() - birthdate.getDate();

            // Уточняем возраст, если день рождения ещё не прошёл в этом году
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
            }

            // Определяем день недели для даты рождения
            const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
            const birthDayOfWeek = daysOfWeek[birthdate.getDay()];

            // Проверяем, является ли пользователь совершеннолетним
            if (age >= 18) {
                alert(`Хорошо! Вы совершеннолетний. День недели, в который вы родились: ${birthDayOfWeek}.`);
            } else {
                alert(`Вы несовершеннолетний. Пожалуйста, позовите родителей для регистрации и получения разрешения на использование сайта.`);
            }
        }
    });
});