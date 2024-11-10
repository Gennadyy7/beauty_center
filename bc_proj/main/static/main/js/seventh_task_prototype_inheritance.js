// Базовый класс для книги
function Book(subject, author) {
    this.subject = subject;
    this.author = author;
}

// Геттеры и сеттеры
Book.prototype.getSubject = function() {
    return this.subject;
};

Book.prototype.setSubject = function(subject) {
    this.subject = subject;
};

Book.prototype.getAuthor = function() {
    return this.author;
};

Book.prototype.setAuthor = function(author) {
    this.author = author;
};

// Класс-наследник для библиотеки
function SchoolLibrary() {
    this.books = [];
}

// Наследуем от базового класса Book
SchoolLibrary.prototype = Object.create(Book.prototype);

// Метод добавления книги из HTML-формы
SchoolLibrary.prototype.addBookFromForm = function() {
    const subject = document.getElementById('subject').value;
    const author = document.getElementById('author').value;
    const grade = parseInt(document.getElementById('grade').value, 10);
    const newBook = { subject, author, grade };
    this.books.push(newBook);
};

// Метод вывода всех книг на страницу
SchoolLibrary.prototype.displayBooks = function() {
    const output = document.getElementById('output');
    output.innerHTML = '';
    this.books.forEach(book => {
        output.innerHTML += `Предмет: ${book.subject}, Автор: ${book.author}, Класс: ${book.grade}<br>`;
    });
};

// Метод нахождения предмета с наибольшим количеством разных авторов
SchoolLibrary.prototype.findMostPopularSubject = function(grade) {
    const subjects = {};
    this.books.forEach(book => {
        if (book.grade === grade) {
            if (!subjects[book.subject]) {
                subjects[book.subject] = new Set();
            }
            subjects[book.subject].add(book.author);
        }
    });

    let mostPopularSubject = '';
    let maxAuthors = 0;

    for (let subject in subjects) {
        const authorCount = subjects[subject].size;
        if (authorCount > maxAuthors) {
            maxAuthors = authorCount;
            mostPopularSubject = subject;
        }
    }

    return mostPopularSubject;
};

// Метод вывода результата на страницу с проверкой на корректный ввод
SchoolLibrary.prototype.displayMostPopularSubject = function(grade) {
    if (isNaN(grade)) {
        document.getElementById('output').innerHTML = 'Пожалуйста, введите корректное значение для класса.';
        return;
    }

    const result = this.findMostPopularSubject(grade);
    const output = document.getElementById('output');
    if (result) {
        output.innerHTML = `Предмет с наибольшим количеством учебников для ${grade} класса: ${result}`;
    } else {
        output.innerHTML = `Для класса ${grade} учебников не найдено.`;
    }
};

const books = [
    { subject: "Физика", author: "Иванов", grade: 7 },
    { subject: "Физика", author: "Петров", grade: 7 },
    { subject: "Физика", author: "Сидоров", grade: 8 },
    { subject: "Физика", author: "Иванов", grade: 8 },
    { subject: "Физика", author: "Козлов", grade: 9 },
    { subject: "Физика", author: "Смирнов", grade: 9 },
    { subject: "Физика", author: "Попов", grade: 10 },

    { subject: "Математика", author: "Николаев", grade: 7 },
    { subject: "Математика", author: "Михайлов", grade: 7 },
    { subject: "Математика", author: "Николаев", grade: 8 },
    { subject: "Математика", author: "Васильев", grade: 8 },
    { subject: "Математика", author: "Алексеев", grade: 9 },
    { subject: "Математика", author: "Андреев", grade: 10 },
    { subject: "Математика", author: "Петров", grade: 11 },
    { subject: "Математика", author: "Иванова", grade: 11 },

    { subject: "Химия", author: "Романова", grade: 8 },
    { subject: "Химия", author: "Белова", grade: 8 },
    { subject: "Химия", author: "Зайцев", grade: 9 },
    { subject: "Химия", author: "Романова", grade: 9 },
    { subject: "Химия", author: "Никифорова", grade: 10 },
    { subject: "Химия", author: "Иванова", grade: 10 },
    { subject: "Химия", author: "Кузнецов", grade: 11 },

    { subject: "Биология", author: "Соколова", grade: 7 },
    { subject: "Биология", author: "Попов", grade: 7 },
    { subject: "Биология", author: "Смирнов", grade: 8 },
    { subject: "Биология", author: "Петров", grade: 8 },
    { subject: "Биология", author: "Романов", grade: 9 },
    { subject: "Биология", author: "Сидоров", grade: 10 },

    { subject: "Литература", author: "Толстой", grade: 7 },
    { subject: "Литература", author: "Достоевский", grade: 7 },
    { subject: "Литература", author: "Гоголь", grade: 8 },
    { subject: "Литература", author: "Лермонтов", grade: 8 },
    { subject: "Литература", author: "Пушкин", grade: 9 },
    { subject: "Литература", author: "Грибоедов", grade: 10 },

    { subject: "История", author: "Романов", grade: 7 },
    { subject: "История", author: "Карамзин", grade: 8 },
    { subject: "История", author: "Соловьев", grade: 8 },
    { subject: "История", author: "Ключевский", grade: 9 },
    { subject: "История", author: "Карамзин", grade: 10 },
    { subject: "История", author: "Платонов", grade: 11 }
];

// Пример использования
const library = new SchoolLibrary();
library.books = books; // Заполняем библиотеку тестовыми данными
console.log(library.books);
library.displayBooks(); // Выводим все учебники на страницу
document.getElementById('addBookButton').addEventListener('click', () => {
    library.addBookFromForm();
    library.displayBooks();
});
document.getElementById('findPopularSubjectButton').addEventListener('click', () => {
    const grade = parseInt(document.getElementById('gradeSearch').value, 10);
    library.displayMostPopularSubject(grade);
});
