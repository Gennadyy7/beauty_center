// Базовый класс для книги
class Book {
    constructor(subject, author) {
        this.subject = subject;
        this.author = author;
    }

    // Геттеры и сеттеры
    get subject() {
        return this._subject;
    }

    set subject(value) {
        this._subject = value;
    }

    get author() {
        return this._author;
    }

    set author(value) {
        this._author = value;
    }
}

// Класс-наследник для библиотеки
class SchoolLibrary extends Book {
    constructor() {
        super(); // Вызов конструктора родительского класса
        this.books = [];
    }

    // Метод добавления книги из HTML-формы
    addBookFromForm() {
        const subject = document.getElementById('subject').value;
        const author = document.getElementById('author').value;
        const grade = parseInt(document.getElementById('grade').value, 10);

        // Проверка на корректность ввода класса
        if (isNaN(grade)) {
            alert("Пожалуйста, введите корректное значение для класса.");
            return;
        }

        // Создаем новый объект Book и добавляем его в массив books
        const newBook = new Book(subject, author);
        newBook.grade = grade; // Добавляем свойство grade
        this.books.push(newBook);
    }

    // Метод вывода всех книг на страницу
    displayBooks() {
        const output = document.getElementById('output');
        output.innerHTML = '';
        this.books.forEach(book => {
            output.innerHTML += `Предмет: ${book.subject}, Автор: ${book.author}, Класс: ${book.grade}<br>`;
        });
    }

    // Метод нахождения предмета с наибольшим количеством разных авторов
    findMostPopularSubject(grade) {
        const subjects = {};
        this.books.forEach(book => {
            if (book.grade === grade) {
                if (!subjects[book.subject]) {
                    subjects[book.subject] = new Set();
                }
                subjects[book.subject].add(book.author);
            }
        });

        if (Object.keys(subjects).length === 0) {
            return `Учебники для ${grade} класса отсутствуют.`;
        }

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
    }

    // Метод вывода результата на страницу
    displayMostPopularSubject(grade) {
        const result = this.findMostPopularSubject(grade);
        const output = document.getElementById('output');

        if (result === null) {
            output.innerHTML = `Ошибка: Пожалуйста, введите корректное значение для класса.`;
        } else {
            output.innerHTML = `Предмет с наибольшим количеством учебников для ${grade} класса: ${result}`;
        }
    }
}

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
library.displayBooks(); // Выводим все учебники на страницу

document.getElementById('addBookButton').addEventListener('click', () => {
    library.addBookFromForm();
    library.displayBooks();
});

document.getElementById('findPopularSubjectButton').addEventListener('click', () => {
    const grade = parseInt(document.getElementById('gradeSearch').value, 10);
    library.displayMostPopularSubject(grade);
});
