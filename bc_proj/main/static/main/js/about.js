const molecules = document.querySelectorAll(".s");
const container = document.getElementById("molecules_container");

// Функция для изменения масштаба молекул и добавления теплового движения на основе прокрутки
function scaleAndMoveMoleculesOnScroll() {
    const scrollPosition = window.scrollY;

    molecules.forEach((molecule, index) => {
        // Устанавливаем уникальную частоту для каждого элемента
        const frequency = 0.001 + Math.sin(index + 3.19) * 0.003;

        // Чередуем направление масштабирования
        const direction = index % 2 === 0 ? 1 : -1;
        const baseScale = direction === 1 ? 1 : 2;

        // Вычисляем масштаб
        const scaleValue = baseScale + direction * Math.abs(Math.sin(scrollPosition * frequency));

        // Вычисляем смещение для теплового движения
        const offsetX = Math.sin(scrollPosition * frequency * 7) * 7; // амплитуда 5px
        const offsetY = Math.cos(scrollPosition * frequency * 7) * 7;

        // Применяем масштаб и смещение
        molecule.style.transform = `scale(${scaleValue}) translate(${offsetX}px, ${offsetY}px)`;
        molecule.style.filter =  `blur(${scaleValue}px)`;
    });
}

scaleAndMoveMoleculesOnScroll();

// Запускаем обработчик при прокрутке страницы
window.addEventListener('scroll', scaleAndMoveMoleculesOnScroll);
