class Slider {
    constructor(options) {
        // Настройки слайдера
        this.loop = 'loop' in options ? options.loop : true;
        this.navs = 'navs' in options ? options.navs : true;
        this.pags = 'pags' in options ? options.pags : true;
        this.auto = 'auto' in options ? options.auto : true;
        this.stopMouseHover = 'stopMouseHover' in options ? options.stopMouseHover : true;
        this.delay = 'delay' in options ? options.delay : 5;


        // Переменные состояния
        this.currentSlide = 0;
        this.autoSlideInterval = null;

        // Получение элементов слайдера
        this.slides = document.querySelectorAll(".slide");
        this.slideIndexDisplay = document.querySelector(".slide-index");
        this.captionDisplay = document.querySelector(".caption");
        this.dots = document.querySelectorAll(".dot");
        this.prevButton = document.querySelector(".prev");
        this.nextButton = document.querySelector(".next");

        // Инициализация слайдера
        this.init();
    }

    init() {
        this.showSlide(this.currentSlide);
        if (this.auto) this.startAutoSlide();

        // Обработчики событий
        if (this.stopMouseHover && this.auto) {
            document.querySelector(".banner-container").addEventListener("mouseenter", () => this.stopAutoSlide());
            document.querySelector(".banner-container").addEventListener("mouseleave", () => this.startAutoSlide());
        }

        if (this.navs) {
            this.prevButton.style.display = "block";
            this.nextButton.style.display = "block";
            this.prevButton.addEventListener("click", () => this.changeSlide(-1));
            this.nextButton.addEventListener("click", () => this.changeSlide(1));
        } else {
            this.prevButton.style.display = "none";
            this.nextButton.style.display = "none";
        }

        if (this.pags) {
            this.dots.forEach((dot, index) => {
                dot.addEventListener("click", () => {
                    this.currentSlide = index;
                    this.showSlide(this.currentSlide);
                });
            });
        } else {
            this.dots.forEach(dot => dot.style.display = "none");
        }
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
            if (this.pags) this.dots[i].classList.toggle("active", i === index);
        });
        this.slideIndexDisplay.textContent = `${index + 1}/${this.slides.length}`;

        // Обновляем текст подписи
        this.captionDisplay.textContent = this.slides[index].getAttribute("data-caption");
    }

    changeSlide(offset) {
        this.currentSlide += offset;
        if (this.loop) {
            this.currentSlide = (this.currentSlide + this.slides.length) % this.slides.length;
        } else {
            this.currentSlide = Math.min(Math.max(this.currentSlide, 0), this.slides.length - 1);
        }
        this.showSlide(this.currentSlide);
    }

    startAutoSlide() {
        this.stopAutoSlide(); // Сначала очищаем таймер, если он уже установлен
        if (this.auto) {
            this.autoSlideInterval = setInterval(() => {
                this.changeSlide(1);
            }, this.delay * 1000);
        }
    }

    stopAutoSlide() {
        clearInterval(this.autoSlideInterval);
    }
}

const defaultDelay = 5;
const appliedDelay = localStorage.getItem('sliderDelay') ? parseInt(localStorage.getItem('sliderDelay'), 10) : defaultDelay;

// Инициализация слайдера с параметрами
const slider = new Slider({
    loop: true,
    navs: true,
    pags: true,
    auto: true,
    stopMouseHover: true,
    delay: appliedDelay
});

// Получение элементов
const delayInput = document.getElementById("delay-input");
const applyDelayButton = document.getElementById("apply-delay");

if (delayInput) {
    delayInput.value = appliedDelay;

    // Обработчик для кнопки "Применить"
    applyDelayButton.addEventListener("click", () => {
        const newDelay = parseInt(delayInput.value, 10);
        if (newDelay > 0) {
            localStorage.setItem('sliderDelay', newDelay);
            slider.delay = newDelay; // обновляем задержку в секундах
            slider.startAutoSlide(); // перезапускаем авто-слайд с новой задержкой
        }
    });
}
