document.addEventListener("DOMContentLoaded", () => {
    const addEmployeeButton = document.getElementById("addEmployeeButton");
    const addEmployeeForm = document.getElementById("addEmployeeForm");
    const employeeForm = document.getElementById("employeeForm");
    const phoneInput = document.getElementById("phone");
    const urlInput = document.getElementById("url");
    const nameInput = document.getElementById("name");
    const surnameInput = document.getElementById("surname");
    const patronymicInput = document.getElementById("patronymic");
    const specializationSelect = document.getElementById("specialisation");
    const photoInput = document.getElementById("photo");
    const emailInput = document.getElementById("email");
    const phoneError = document.getElementById("phoneError");
    const urlError = document.getElementById("urlError");
    const addToTableButton = document.getElementById("addToTableButton");

    // Show/hide the add employee form
    addEmployeeButton.addEventListener("click", () => {
        addEmployeeForm.style.display = addEmployeeForm.style.display === "none" ? "block" : "none";
    });

    // Validate URL
    function validateURL(url) {
        const urlPattern = /^(https?:\/\/).+\.(php|html)$/;
        return urlPattern.test(url);
    }

    // Validate phone number
    function validatePhone(phone) {
        const phonePattern = /^(8|(\+375))\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
        return phonePattern.test(phone);
    }

    // Check URL validity on input
    urlInput.addEventListener("input", () => {
        const isValid = validateURL(urlInput.value);
        updateInputState(urlInput, urlError, isValid, "Некорректный URL. Он должен начинаться с http:// или https:// и заканчиваться на .php или .html");
        toggleSubmitButton();
    });

    // Check phone validity on input
    phoneInput.addEventListener("input", () => {
        const isValid = validatePhone(phoneInput.value);
        updateInputState(phoneInput, phoneError, isValid, "Некорректный номер телефона. Пример: 80291112233, +375 (29) 111-22-33");
        toggleSubmitButton();
    });

    // Check if required text inputs and select are filled
    [nameInput, surnameInput, patronymicInput, emailInput, specializationSelect, photoInput].forEach(input => {
        input.addEventListener("input", toggleSubmitButton);
    });

    // Update input state with error message
    function updateInputState(inputElement, errorElement, isValid, errorMessage) {
        inputElement.classList.toggle("invalid-input", !isValid);
        inputElement.style.backgroundColor = isValid ? "" : "#ffcccc";
        errorElement.textContent = isValid ? "" : errorMessage;
    }

    // Enable/disable submit button based on validation
    function toggleSubmitButton() {
        const isFormValid =
            validateURL(urlInput.value) &&
            validatePhone(phoneInput.value) &&
            nameInput.value.trim() &&
            surnameInput.value.trim() &&
            patronymicInput.value.trim() &&
            emailInput.value.trim() &&
            specializationSelect.value &&
            photoInput.files.length > 0;

        addToTableButton.disabled = !isFormValid;
    }

    employeeForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Предотвращаем отправку формы по умолчанию

        // Спрашиваем пользователя о подтверждении отправки формы
        const userConfirmed = confirm("Вы уверены, что хотите отправить форму?");

        if (userConfirmed) {
            // Программно отправляем данные формы
            employeeForm.submit();

            // После отправки данных сбрасываем поля формы и скрываем её
            employeeForm.reset();
            toggleSubmitButton(); // Отключить кнопку снова
            addEmployeeForm.style.display = "none";
        }
        // Если пользователь не согласился, форма остаётся открытой и данные сохраняются
    });
});
