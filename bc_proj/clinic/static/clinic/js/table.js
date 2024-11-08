document.addEventListener("DOMContentLoaded", function () {
    const rowsPerPage = 3;
    let currentPage = 1;

    const employeesTable = document.getElementById("employeesTable");
    const rows = Array.from(employeesTable.querySelectorAll("tbody tr"));
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const pageIndicator = document.getElementById("pageIndicator");

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

    // Отобразить первую страницу при загрузке
    displayPage(currentPage);
});
