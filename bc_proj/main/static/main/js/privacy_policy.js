const readAloudButton = document.getElementById("read-aloud");
const speakerIcon = document.getElementById("speaker-icon");
const speechText = `
    Сбор личной информации. Мы можем собирать следующую информацию: Имя и фамилия, Контактный телефон, Email адрес, Дата рождения.
    Использование информации. Ваши данные могут использоваться следующим образом: Для предоставления медицинских услуг, Для связи с вами и предоставления информации о наших услугах, Для улучшения качества наших услуг.
    Контакты. Если у вас есть какие-либо вопросы или пожелания по поводу нашей политики конфиденциальности, пожалуйста, свяжитесь с нами. Телефон: +375 (29) 614-63-37.
`;

let isSpeaking = false;
let utterance = null;

readAloudButton.addEventListener("click", () => {
    if (!isSpeaking) {
        // Инициализация синтеза речи
        utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = "ru";
        utterance.volume = 1;
        utterance.rate = 2;
        utterance.pitch = 1;

        // Запуск анимации и синтеза речи
        utterance.onstart = () => {
            speakerIcon.classList.add("show");
            isSpeaking = true;
        };

        // Остановка анимации по завершении речи
        utterance.onend = () => {
            speakerIcon.classList.remove("show");
            isSpeaking = false;
        };

        window.speechSynthesis.speak(utterance);
    } else {
        // Остановка речи и анимации, если речь еще продолжается
        window.speechSynthesis.cancel();
        speakerIcon.classList.remove("show");
        isSpeaking = false;
    }
});
