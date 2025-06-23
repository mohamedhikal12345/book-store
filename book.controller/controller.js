var queries = require('../db/queries');
var dbConnection = require('../db/connection');
var util = require('../util/generator');
var Logger = require('../services/logger.service');
var auditService = require('../audit/audit.service');
var auditAction = require('../audit/auditAction');
const { error } = require('winston');
const APIError = require('../error/api.error');
const logger = new Logger('book.controller');
const errorStatus = require('../error/error.status');
const errorTypes = require('../error/error.types');


exports.getBookList = async (req, res) => {
    var auditOn = util.dateFormate();
    try {
        var bookListQuery = queries.queryList.GET_BOOK_LIST_QUERY;
        var result = await dbConnection.dbQuery(bookListQuery);
        logger.info("return book list ", result.rows);

        auditService.prepareAudit(auditAction.auditActionList.GET_BOOK_LIST, result.rows, null, "postman", auditOn);

        return res.status(200).send(JSON.stringify(result.rows));
    } catch (err) {
        console.log("Error : " + err)
        let errMessage = 'Failed to get books' + err;
        auditService.prepareAudit(auditAction.auditActionList.GET_BOOK_LIST, null, JSON.stringify(errMessage), "postman", auditOn);
        return res.status(500).send({ error: 'Failed to get books' });
    }
}

exports.getBookDetails = async (req, res) => {
    try {

        var bookId = req.params.bookId;
        console.log("bookId: " + bookId);
        if (isNaN(bookId))
            throw new APIError(errorTypes.API_ERROR,
                errorStatus.INTERNAL_SERVER_EROR,
                "invalid BookId , is not a number , bookid value is : " + bookId,
                true);


        var bookdetailsQuery = queries.queryList.GET_BOOK_DETAILS_QUERY;
        var result = await dbConnection.dbQuery(bookdetailsQuery, [bookId]);
        return res.status(200).send(JSON.stringify(result.rows[0]));
    } catch (err) {
        console.log("Error : " + err);

        // if (err.name === errorTypes.SQL_INJECTION_ERROR)
        //sent mail 
        //handlerError( )

        logger.error("failed to get book details", JSON.stringify(err));
        return res.status(500).send({ error: 'Failed to get books details ' });
    }
}



exports.saveBook = async (req, res) => {

    try {

        var createdBy = "admin";
        var createdOn = new Date();
        // req.body
        var title = req.body.title;
        var description = req.body.description;
        var author = req.body.author;
        var puplisher = req.body.puplisher;
        var pages = req.body.pages;
        var storeCode = req.body.storeCode;

        if (!title || !author || !puplisher || !storeCode) {
            return res.status(500).send({ error: 'book title  and author , puplisher, storeCode are required , can not empty' })
        }



        values = [title, description, author, puplisher, pages, storeCode, createdOn, createdBy];

        var saveBookQuery = queries.queryList.SAVE_BOOK_QUERY;
        await dbConnection.dbQuery(saveBookQuery, values);
        return res.status(201).send("Successfully BOOK ADDED");
    } catch (err) {
        console.log("Error : " + err);
        return res.status(500).send({ error: 'Failed to ADD BOOK ' });
    }
}
exports.updateBook = async (req, res) => {

    try {

        var createdBy = "admin";
        var createdOn = new Date();
        // req.body
        var bookId = req.body.bookId;
        var title = req.body.title;
        var description = req.body.description;
        var author = req.body.author;
        var puplisher = req.body.puplisher;
        var pages = req.body.pages;
        var storeCode = req.body.storeCode;

        if (!bookId || !title || !author || !puplisher || !storeCode) {
            return res.status(500).send({ error: ' bookId , book title  and author , puplisher, storeCode are required , can not empty' })
        }



        values = [title, description, author, puplisher, pages, storeCode, createdOn, createdBy, bookId];

        var updateBookQuery = queries.queryList.UPDATE_BOOK_QUERY;
        await dbConnection.dbQuery(updateBookQuery, values);
        return res.status(201).send("Successfully BOOK updated title : " + title);
    } catch (err) {
        console.log("Error : " + err);
        return res.status(500).send({ error: 'Failed to update BOOK title ' + title });
    }
}

exports.deleteBook = async (req, res) => {
    var bookId = req.params.bookId;
    try {
        if (!bookId) {
            return res.status(500).send({ error: 'bookID is not exist' })
        }
        var deleteBookQuery = queries.queryList.DELETE_BOOK_QUERY;
        await dbConnection.dbQuery(deleteBookQuery, [bookId]);

        return res.status(201).send("Successfully BOOK deleted ");
    } catch (err) {
        console.log("Error : " + err);
        return res.status(500).send({ error: 'Failed to delete BOOK id ' + bookId });
    }
}