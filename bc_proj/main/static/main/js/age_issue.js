function checkAge() {
    // Проверяем, был ли уже успешно пройден опрос
    if (sessionStorage.getItem("ageVerified")) {
        return; // Если да, выходим из функции
    }

    // Запрашиваем дату рождения
    const birthdateInput = prompt("Пожалуйста, введите вашу дату рождения (в формате ДД-ММ-ГГГГ):");

    // Проверяем формат даты
    const datePattern = /^\d{2}-\d{2}-\d{4}$/;
    if (!datePattern.test(birthdateInput)) {
        alert("Неверный формат. Введите дату в формате ДД-ММ-ГГГГ.");
        return;
    }

    // Извлекаем день, месяц и год из строки
    const [day, month, year] = birthdateInput.split("-").map(Number);

    // Проверяем допустимость дня, месяца и года
    if (month < 1 || month > 12) {
        alert("Некорректный месяц. Введите дату в формате ДД-ММ-ГГГГ.");
        return;
    }
    if (day < 1 || day > 31) {
        alert("Некорректный день. Введите дату в формате ДД-ММ-ГГГГ.");
        return;
    }
    if (year < 1900 || year > new Date().getFullYear()) {
        alert("Некорректный год. Введите дату в формате ДД-ММ-ГГГГ.");
        return;
    }

    // Создаем объект даты (месяц в JavaScript начинается с 0, поэтому month - 1)
    const birthdate = new Date(year, month - 1, day);

    // Проверяем корректность даты с учетом месяцев (например, 30 февраля)
    if (birthdate.getDate() !== day || birthdate.getMonth() !== month - 1 || birthdate.getFullYear() !== year) {
        alert("Некорректная дата. Попробуйте снова.");
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

    // Проверка на совершеннолетие
    if (age >= 18) {
        alert(`Вы совершеннолетний. День недели вашего рождения: ${birthDayOfWeek}.`);
        sessionStorage.setItem("ageVerified", "true"); // Устанавливаем флаг успешной проверки возраста
    } else {
        alert(`Вы несовершеннолетний. Пожалуйста, позовите родителей для регистрации и разрешения на использование сайта.`);
    }
}

// Запускаем функцию с задержкой после загрузки страницы
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(checkAge, 3000); // Задержка в 3 секунды
});
