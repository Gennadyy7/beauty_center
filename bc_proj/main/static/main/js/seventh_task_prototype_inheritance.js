// Базовый класс для книги
function OrdinaryBook(topic, author) {
    this.topic = topic;
    this.author = author;
}

// Геттеры и сеттеры
OrdinaryBook.prototype.getTopic = function() {
    return this.topic;
};

OrdinaryBook.prototype.setTopic = function(topic) {
    this.topic = topic;
};

OrdinaryBook.prototype.getAuthor = function() {
    return this.author;
};

OrdinaryBook.prototype.setAuthor = function(author) {
    this.author = author;
};

OrdinaryBook.prototype.displayInfo = function() {
    return `Тема книги: ${this.topic}, Автор: ${this.author}<br>`;
};

// Класс-наследник
function SchoolBook(topic, author, grade) {
    OrdinaryBook.call(this, topic, author);
    this.grade = grade;
}

SchoolBook.prototype = Object.create(OrdinaryBook.prototype);
SchoolBook.prototype.constructor = SchoolBook; // Устанавливаем правильный конструктор

SchoolBook.prototype.getGrade = function() {
    return this.grade;
};

SchoolBook.prototype.setGrade = function(grade) {
    this.grade = grade;
};

SchoolBook.prototype.displayInfo = function() {
    return `${this.topic}, ${this.author}, ${this.grade}<br>`;
};

// Метод добавления учебника из HTML-формы с проверкой на корректность ввода
SchoolBook.addFromForm = function(books) {
    const subject = document.getElementById('subject').value;
    const author = document.getElementById('author').value;
    const grade = parseInt(document.getElementById('grade').value, 10);

    // Проверка на пустые поля и некорректное значение grade
    if (!subject || !author || isNaN(grade)) {
        alert("Пожалуйста, заполните все поля корректно.");
        return;
    }

    const newSchoolBook = new SchoolBook(subject, author, grade);
    books.push(newSchoolBook);
};


// Метод вывода всех учебников на страницу
SchoolBook.displayBooks = function(books) {
    const output = document.getElementById('output');
    output.innerHTML = '';
    books.forEach(book => {
        output.innerHTML += book.displayInfo();
    });
};

// Метод нахождения предмета с наибольшим количеством разных авторов
SchoolBook.findMostPopularSubject = function(books, grade) {
    const subjects = {};
    books.forEach(book => {
        if (book.getGrade() === grade) {
            if (!subjects[book.getTopic()]) {
                subjects[book.getTopic()] = new Set();
            }
            subjects[book.getTopic()].add(book.getAuthor());
        }
    });

    let mostPopularSubject = '';
    let maxAuthors = 0;

    for (let subject in subjects) {
        console.log(subjects[subject]);
        const authorCount = subjects[subject].size;
        if (authorCount > maxAuthors) {
            maxAuthors = authorCount;
            mostPopularSubject = subject;
        }
    }

    return mostPopularSubject;
};

// Метод вывода результата на страницу с проверкой на корректный ввод
SchoolBook.displayMostPopularSubject = function(books, grade) {
    console.log(isNaN(grade));
    if (isNaN(grade)) {
        document.getElementById('output').innerHTML = 'Пожалуйста, введите корректное значение для класса.';
        return;
    }
    const result = SchoolBook.findMostPopularSubject(books, grade);
    const output = document.getElementById('output');
    if (result) {
        output.innerHTML = `Предмет с наибольшим количеством учебников для ${grade} класса: ${result}`;
    } else {
        output.innerHTML = `Для класса ${grade} учебников не найдено.`;
    }
};

// Пример использования
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
].map(book => new SchoolBook(book.subject, book.author, book.grade));
SchoolBook.displayBooks(books);


document.getElementById('addBookButton').addEventListener('click', () => {
    SchoolBook.addFromForm(books);
    SchoolBook.displayBooks(books);
});
document.getElementById('findPopularSubjectButton').addEventListener('click', () => {
    const grade = parseInt(document.getElementById('gradeSearch').value, 10);
    console.log(grade);
    SchoolBook.displayMostPopularSubject(books, grade);
});
