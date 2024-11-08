document.addEventListener("DOMContentLoaded", function () {
    const rowsPerPage = 3;
    let currentPage = 1;

    const employeesTable = document.getElementById("employeesTable");
    const rows = Array.from(employeesTable.querySelectorAll("tbody tr"));
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const pageIndicator = document.getElementById("pageIndicator");

    const detailsContainer = document.getElementById('employeeDetails');
    const detailSurname = document.getElementById('detailSurname');
    const detailName = document.getElementById('detailName');
    const detailPatronymic = document.getElementById('detailPatronymic');
    const detailPhone = document.getElementById('detailPhone');
    const detailEmail = document.getElementById('detailEmail');
    const detailSpecialization = document.getElementById('detailSpecialization');

    // Функция для отображения строки на конкретной странице
    function displayPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        rows.forEach((row, index) => {
            row.style.display = index >= start && index < end ? "" : "none";
        });

        currentPage = page;
        updatePaginationControls();
    }

    // Функция для обновления состояния кнопок и индикатора
    function updatePaginationControls() {
        pageIndicator.textContent = `Страница ${currentPage} из ${totalPages}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    // Обработчики для кнопок навигации
    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) displayPage(currentPage - 1);
    });

    nextPageButton.addEventListener("click", () => {
        if (currentPage < totalPages) displayPage(currentPage + 1);
    });

    // Функция для отображения деталей сотрудника
    function displayEmployeeDetails(row) {
        const surname = row.children[0].textContent;
        const name = row.children[1].textContent;
        const patronymic = row.children[2].textContent;
        const phone = row.children[5].textContent;
        const email = row.children[6].textContent;
        const specialization = row.children[4].textContent;

        detailSurname.textContent = surname;
        detailName.textContent = name;
        detailPatronymic.textContent = patronymic;
        detailPhone.textContent = phone;
        detailEmail.textContent = email;
        detailSpecialization.textContent = specialization;

        detailsContainer.style.display = 'block';
    }

    // Добавление обработчика кликов для каждой строки таблицы
    rows.forEach(row => {
        row.addEventListener('click', function () {
            displayEmployeeDetails(row);
        });
    });

    // Отобразить первую страницу при загрузке
    displayPage(currentPage);
});
