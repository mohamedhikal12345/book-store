exports.Book = class Book {
    constructor(bookId, title, isban, author, description, publisher, pages) {
        this.bookId = bookId;
        this.title = title;
        this.isban = isban;
        this.author = author;
        this.description = description;
        this.publisher = publisher;
        this.pages = pages;
    }
}
