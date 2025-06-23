var queries = require('../db/queries');
var dbConnection = require('../db/connection');
var util = require('../util/generator');
var Logger = require('../services/logger.service');
var auditService = require('../audit/audit.service');
var auditAction = require('../audit/auditAction');
const { error } = require('winston');
const APIError = require('../error/api.error');
const errorStatus = require('../error/error.status');
const errorTypes = require('../error/error.types');

const logger = new Logger('user');




exports.getBookList = async (req, res) => {
    var auditOn = util.dateFormate();
    try {
        var userListQuery = queries.queryList.GET_USER_LIST_QUERY;
        var result = await dbConnection.dbQuery(userListQuery);
        logger.info("return book list ", result.rows);

        auditService.prepareAudit(auditAction.auditActionList.GET_USER_LIST, result.rows, null, "postman", auditOn);

        return res.status(200).send(JSON.stringify(result.rows));
    } catch (err) {
        console.log("Error : " + err)
        let errMessage = 'Failed to get users' + err;
        auditService.prepareAudit(auditAction.auditActionList.GET_USER_LIST, null, JSON.stringify(errMessage), "postman", auditOn);
        return res.status(500).send({ error: 'Failed to get users' });
    }
}


exports.saveUser = async (req, res) => {

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