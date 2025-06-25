var queries = require('../db/queries');
var dbConnection = require('../db/connection');
var util = require('../util/generator');
var validationUtil = require('../util/validation')
var Logger = require('../services/logger.service');
var auditService = require('../audit/audit.service');
var auditAction = require('../audit/auditAction');
const { error } = require('winston');
const APIError = require('../error/api.error');
const logger = new Logger('book.controller');
const errorStatus = require('../error/error.status');
const errorTypes = require('../error/error.types');
const bcrypt = require('bcrypt');


exports.getUserList = async (req, res) => {
    var auditOn = util.dateFormate();
    try {
        var userListQuery = queries.queryList.GET_USER_LIST_QUERY;
        var result = await dbConnection.dbQuery(userListQuery);
        logger.info("return user list ", result.rows);

        auditService.prepareAudit(auditAction.auditActionList.GET_USER_LIST, result.rows, null, "postman", auditOn);

        return res.status(200).send(JSON.stringify(result.rows));
    } catch (err) {
        console.log("Error : " + err)
        let errMessage = 'Failed to get user' + err;
        auditService.prepareAudit(auditAction.auditActionList.GET_USER_LIST, null, JSON.stringify(errMessage), "postman", auditOn);
        return res.status(500).send({ error: 'Failed to get users' });
    }
}
exports.saveUser = async (req, res) => {

    try {

        var createdBy = "admin";
        var createdOn = new Date();
        // req.body
        var username = req.body.username;
         
        var password = req.body.password;
        var email = req.body.email;
        var fullName = req.body.fullName;
        var userTypeCode = req.body.userTypeCode;
        var groups = req.body.groups;
        if (!username || !password || !email || !fullName || !userTypeCode ||!groups) {
            return res.status(500).send({ error: 'User username,password,email,fullName,userTypeCode, groups are required , can not empty' })
        }
        /**
         *  validation 
         * 1- !  user and mail exist
         * 2- is mail 
         * 3- validate password strength
         * 
         * 
         */
     var isUserExistsQuery  = queries.queryList.IS_USER_EXISTS_QUERY;
        var checkEmail =await dbConnection.dbQuery(isUserExistsQuery, [username , email]);
        console.log("checkEmail :" + JSON.stringify(checkEmail));
        if(checkEmail.rows[0].count != "0")
        {
        return res.status(500).send({ error: 'User already exists' })

        }

    if(!validationUtil.isValidEmail(email)){
                    return res.status(500).send({ error: 'Email is not Valid' })

    }
    if(!validationUtil.isValidPassowrd(password)){
                    return res.status(500).send({ error: 'Password is not Valid' })
    }

    var hashedPassword = await bcrypt.hash(password , 10);
        values = [username, hashedPassword, email, userTypeCode,fullName , createdOn ,createdBy];

        var saveUserQuery = queries.queryList.SAVE_USER_QUERY;
        await dbConnection.dbQuery(saveUserQuery, values);
        return res.status(201).send("Successfully User ADDED");
    } catch (err) {
        console.log("Error : " + err);
        return res.status(500).send({ error: 'Failed to ADD User ' });
    }
}