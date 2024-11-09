document.addEventListener("DOMContentLoaded", function () {
    const rowsPerPage = 2;
    let currentPage = 1;
    const services = Array.from(document.querySelectorAll(".service-card"));
    const totalPages = Math.ceil(services.length / rowsPerPage);

    const pageIndicator = document.getElementById("pageIndicator");
    const firstPageButton = document.getElementById("firstPage");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const lastPageButton = document.getElementById("lastPage");

    function displayPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        services.forEach((service, index) => {
            service.style.display = index >= start && index < end ? "block" : "none";
        });

        currentPage = page;
        updatePaginationControls();
    }

    function updatePaginationControls() {
        pageIndicator.textContent = `Страница ${currentPage} из ${totalPages}`;
        firstPageButton.style.visibility = currentPage === 1 ? "hidden" : "visible";
        prevPageButton.style.visibility = currentPage === 1 ? "hidden" : "visible";
        nextPageButton.style.visibility = currentPage === totalPages ? "hidden" : "visible";
        lastPageButton.style.visibility = currentPage === totalPages ? "hidden" : "visible";
    }

    firstPageButton.addEventListener("click", () => displayPage(1));
    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) displayPage(currentPage - 1);
    });
    nextPageButton.addEventListener("click", () => {
        if (currentPage < totalPages) displayPage(currentPage + 1);
    });
    lastPageButton.addEventListener("click", () => displayPage(totalPages));

    displayPage(currentPage);
});
