// Настройки слайдера
const loop = true;             // Позволяет слайдеру зацикливаться
const navs = true;             // Отображение кнопок "вперед"/"назад"
const pags = true;             // Отображение пагинации
const auto = true;             // Автоматическое переключение слайдов
const stopMouseHover = true;   // Остановка авто-прокрутки при наведении мыши
const delay = 5;               // Задержка в секундах между слайдами при auto

// Переменные для слайдера
let currentSlide = 0;
let autoSlideInterval;

// Получение элементов слайдера
const slides = document.querySelectorAll(".slide");
const slideIndexDisplay = document.querySelector(".slide-index");
const dots = document.querySelectorAll(".dot");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

// Функция отображения текущего слайда
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
        if (pags) dots[i].classList.toggle("active", i === index); // обновляем пагинацию, если включена
    });
    slideIndexDisplay.textContent = `${index + 1}/${slides.length}`;
}

// Функция для перехода к следующему или предыдущему слайду
function changeSlide(offset) {
    currentSlide += offset;
    if (loop) {
        currentSlide = (currentSlide + slides.length) % slides.length;
    } else {
        currentSlide = Math.min(Math.max(currentSlide, 0), slides.length - 1);
    }
    showSlide(currentSlide);
}

// Автоматическое переключение слайдов
function startAutoSlide() {
    if (auto) {
        autoSlideInterval = setInterval(() => {
            changeSlide(1);
        }, delay * 1000);
    }
}

// Остановка авто-прокрутки
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// События для управления мышью (для stopMouseHover)
if (stopMouseHover && auto) {
    document.querySelector(".banner-container").addEventListener("mouseenter", stopAutoSlide);
    document.querySelector(".banner-container").addEventListener("mouseleave", startAutoSlide);
}

// Обработчики для кнопок "вперед" и "назад" (если navs включены)
if (navs) {
    prevButton.style.display = "block";
    nextButton.style.display = "block";
    prevButton.addEventListener("click", () => changeSlide(-1));
    nextButton.addEventListener("click", () => changeSlide(1));
} else {
    prevButton.style.display = "none";
    nextButton.style.display = "none";
}

// Установка событий для пагинации
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Показ/скрытие пагинации
if (!pags) {
    dots.forEach(dot => dot.style.display = "none");
}

// Запуск слайдера
showSlide(currentSlide);
startAutoSlide();
