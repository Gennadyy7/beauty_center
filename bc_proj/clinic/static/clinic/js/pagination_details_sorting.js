document.addEventListener("DOMContentLoaded", function () {
    const rowsPerPage = 3;
    let currentPage = 1;
    let sortColumn = null;
    let sortAscending = true;
    let filteredRows = [];

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

    const searchField = document.getElementById("searchField");
    const searchButton = document.getElementById("searchButton");

    filteredRows = rows;

    function displayPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        console.log('start-end:', start, end);

        rows.forEach((row, index) => {
            row.style.display = "none";
        });

        filteredRows.forEach((row, index) => {
            console.log('style-display строки:', row.style.display);
            console.log(index, index >= start && index < end ? "" : "none")
            row.style.display = index >= start && index < end ? "" : "none";
            console.log('style-display строки:', row.style.display);
            console.log('Обработка строки завершена');
        });

        currentPage = page;
        updatePaginationControls();
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
        pageIndicator.textContent = `Страница ${currentPage} из ${totalPages}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    function applyFilter() {
        const query = searchField.value.trim().toLowerCase();
        console.warn('запрос:', query);

        if (query === "") {
            filteredRows = rows;  // Сброс фильтрации
        } else {
            // Фильтруем строки, оставляя только те, которые содержат запрос
            filteredRows = rows.filter(row => row.textContent.toLowerCase().includes(query));
        }

        currentPage = 1;  // Сброс на первую страницу
        console.log(filteredRows);
        console.log('sortColumn:', sortColumn);
        if (false) {
            sortTable(sortColumn, sortAscending);  // Сортировка отфильтрованных данных
        } else {
            displayPage(currentPage);  // Обновление отображения страницы
        }
    }

    searchButton.addEventListener("click", applyFilter);

    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) displayPage(currentPage - 1);
    });

    nextPageButton.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
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

        console.warn('Отсортированный массив:', rows);
        console.warn('Детки таблицы:', employeesTable.querySelector("tbody").rows);

        // Переставляем строки в таблице
        rows.forEach((row) => employeesTable.querySelector("tbody").appendChild(row));

        console.warn('Детки таблицы:', employeesTable.querySelector("tbody").rows);

        // displayPage(currentPage);
        applyFilter();
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

    console.log('almost done');
    displayPage(currentPage);
});
