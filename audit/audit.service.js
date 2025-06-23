var events = require('events');
const audit = require('../model/audit.model');
var emitter = new events.EventEmitter();
var auditEvent = 'audit';
var queries = require('../db/queries');
var dbConnection = require('../db/connection');


emitter.on(auditEvent, function (audit) {
    console.log("Audit Event Emitter - Audit succeess : " + JSON.stringify(audit));
    try {


        values = [audit.auditAction, JSON.stringify(audit.data), audit.status, audit.error, audit.auditBy, audit.auditOn];

        var auditQuery = queries.queryList.AUDIT_QUERY;
        dbConnection.dbQuery(auditQuery, values);

    } catch (error) {
        console.log("Audit Event Emitter - error : " + error)
    } // steps of action - saving to database
});

exports.prepareAudit = function (auditAction, data, error, auditBy, auditOn) {
    let status = 200;
    if (error)
        status = 500;

    var auditObj = new audit.Audit(auditAction, data, status, error, auditBy, auditOn)

    emitter.emit(auditEvent, auditObj);
}

