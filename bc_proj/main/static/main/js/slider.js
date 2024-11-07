class Slider {
    constructor(options) {
        // Настройки слайдера
        this.loop = options.loop || true;
        this.navs = options.navs || true;
        this.pags = options.pags || true;
        this.auto = options.auto || true;
        this.stopMouseHover = options.stopMouseHover || true;
        this.delay = options.delay || 5;

        // Переменные состояния
        this.currentSlide = 0;
        this.autoSlideInterval = null;

        // Получение элементов слайдера
        this.slides = document.querySelectorAll(".slide");
        this.slideIndexDisplay = document.querySelector(".slide-index");
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

// Инициализация слайдера с параметрами
const slider = new Slider({
    loop: true,
    navs: true,
    pags: true,
    auto: true,
    stopMouseHover: true,
    delay: 5
});
