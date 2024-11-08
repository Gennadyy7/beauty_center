document.addEventListener("DOMContentLoaded", function () {
    const rowsPerPage = 3;
    let currentPage = 1;
    let sortColumn = null;
    let sortAscending = true;

    const employeesTable = document.getElementById("employeesTable");
    const rows = Array.from(employeesTable.querySelectorAll("tbody tr"));
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const pageIndicator = document.getElementById("pageIndicator");

    const detailsContainer = document.getElementById("employeeDetails");
    const detailSurname = document.getElementById("detailSurname");
    const detailName = document.getElementById("detailName");
    const detailPatronymic = document.getElementById("detailPatronymic");
    const detailPhone = document.getElementById("detailPhone");
    const detailEmail = document.getElementById("detailEmail");
    const detailSpecialization = document.getElementById("detailSpecialization");
    const closeDetailsButton = document.getElementById("closeDetailsButton");

    function displayPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        rows.forEach((row, index) => {
            row.style.display = index >= start && index < end ? "" : "none";
        });

        currentPage = page;
        updatePaginationControls();
    }

    function updatePaginationControls() {
        pageIndicator.textContent = `Страница ${currentPage} из ${totalPages}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) displayPage(currentPage - 1);
    });

    nextPageButton.addEventListener("click", () => {
        if (currentPage < totalPages) displayPage(currentPage + 1);
    });

    function displayEmployeeDetails(row) {
        detailSurname.textContent = row.children[0].textContent;
        detailName.textContent = row.children[1].textContent;
        detailPatronymic.textContent = row.children[2].textContent;
        detailPhone.textContent = row.children[5].textContent;
        detailEmail.textContent = row.children[6].textContent;
        detailSpecialization.textContent = row.children[4].textContent;

        detailsContainer.style.display = "block";
    }

    rows.forEach((row) => {
        row.addEventListener("click", function () {
            displayEmployeeDetails(row);
        });
    });

    closeDetailsButton.addEventListener("click", () => {
        detailsContainer.style.display = "none";
    });

    // Функция для сортировки строк таблицы
    function sortTable(columnIndex, ascending) {
        rows.sort((a, b) => {
            const aText = a.children[columnIndex].textContent.trim();
            const bText = b.children[columnIndex].textContent.trim();
            // console.log(aText, bText);

            res = ascending ? aText.localeCompare(bText) : bText.localeCompare(aText)
            // console.log(res);
            return res;
        });

        // Переставляем строки в таблице
        rows.forEach((row) => employeesTable.querySelector("tbody").appendChild(row));

        displayPage(currentPage);
    }

    // Обработчики для заголовков столбцов
    employeesTable.querySelectorAll("th[data-sortable='true']").forEach((header, index) => {
        header.addEventListener("click", () => {
            const isCurrentColumn = sortColumn === index;
            sortAscending = isCurrentColumn ? !sortAscending : true;
            sortColumn = index;
            console.log(index, sortAscending)
            sortTable(index >= 3 ? index + 1 : index, sortAscending);

            // Обновляем отображение направления сортировки
            employeesTable.querySelectorAll(".sort-direction").forEach((el) => {
                el.textContent = "";
            });
            header.querySelector(".sort-direction").textContent = sortAscending ? "▲" : "▼";
        });
    });

    displayPage(currentPage);
});
