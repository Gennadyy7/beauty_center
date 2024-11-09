document.addEventListener('DOMContentLoaded', () => {
    const toggleSettings = document.getElementById('toggle-settings');
    const settingsPanel = document.getElementById('settings-panel');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const textColorPicker = document.getElementById('text-color-picker');
    const bgColorPicker = document.getElementById('bg-color-picker');
    const articleDetail = document.querySelector('.article-detail');
    const paragraph = document.querySelector('.article-detail p');

    // Сбрасываем флажок и скрываем панель настроек при загрузке страницы
    toggleSettings.checked = false;
    settingsPanel.style.display = 'none';

    // Показать или скрыть панель настроек при переключении чекбокса
    toggleSettings.addEventListener('change', () => {
        settingsPanel.style.display = toggleSettings.checked ? 'block' : 'none';
    });

    // Обработчик для изменения размера шрифта
    fontSizeSlider.addEventListener('input', () => {
        paragraph.style.fontSize = fontSizeSlider.value + 'px';
    });

    // Обработчик для изменения цвета текста
    textColorPicker.addEventListener('input', () => {
        paragraph.style.color = textColorPicker.value;
        console.log(paragraph.style.color);
    });

    // Обработчик для изменения цвета фона
    bgColorPicker.addEventListener('input', () => {
        articleDetail.style.backgroundColor = bgColorPicker.value;
        console.log(articleDetail.style.backgroundColor);
    });
});
