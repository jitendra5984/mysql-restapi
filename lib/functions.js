
/**
 * Send the edited element to the requester
 * @param table
 * @param res
 * @param id
 * @param field
 */

module.exports.sendSuccessAnswer = function (table, res, id, field) {
    if(typeof field === "undefined") {
        if(id === 0) {
            //Just assume that everything went okay. It looks like a non numeric primary key.
            res.send({
                result: 'success',
                table: table
            });
            return;
        } else {
            field = "id";
        }
    }
    finalQuery = connection.query('SELECT * FROM ?? WHERE ?? = ?', [table, field, id] , function (err, rows) {
        if (err) {
            this.sendError(res, err.code)
        } else {
            res.send({
                result: 'success',
                json: rows,
                table: table
            });
        }
    });
}

/**
 * check if object is undefined or empty
 * @param obj
 * @returns {boolean}
 */

module.exports.undefOrEmpty = function (obj) {
    return !!(typeof obj === 'undefined' || obj === null || obj === undefined || obj === '');
}

/**
 * Check roughly if the provided value is sufficient for the database field
 * @param req
 * @param dbField
 * @returns {*}
 */

module.exports.checkIfSentvaluesAreSufficient = function (req,dbField) {
    if(dbField.Default == 'FILE') {
        //For 'File' fields just return the link ot the file
        if(req.files.hasOwnProperty(dbField.Field)) {

            var file = req.files[dbField.Field].hasOwnProperty('name') ? req.files[dbField.Field] : req.files[dbField.Field][0];

            if(settings.maxFileSize !== -1 && file.size > settings.maxFileSize) {
                return false;
            }

            return file.name;

        } else {
            return false;
        }
    } else {
        if (req.body[dbField.Field] === null || typeof req.body[dbField.Field] == "undefined") {
            return dbField.Null == "YES" ? null : false;
        }
        //Normle Werte
        if((dbField.Type.indexOf("int") != -1 || dbField.Type.indexOf("float") != -1 || dbField.Type.indexOf("double") != -1 )) {
            return !isNaN(req.body[dbField.Field]) ? req.body[dbField.Field] : false;
        } else if(typeof req.body[dbField.Field] === 'string') {
            return this.escape(req.body[dbField.Field]);
        }
        return false;
    }
}


module.exports.sendError = function(res, err, finalQuery) {
    console.error(err);
    // also log last executed query, for easier debugging
    console.error(finalQuery.sql);
    res.statusCode = 500;
    res.send({
        result: 'error',
        err:    err
    });
}


/**
 * Credits to Paul d'Aoust @ http://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly
 * @param str
 * @returns {string}
 */

module.exports.escape = function(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
            case "%":
                return "%";
        }
    });
}


/**
 * Get primary key, or if specified
 * @param columns
 * @param field
 * @returns {*}
 */

module.exports.findPrim = function(columns,field) {

    var primary_keys = columns.filter(function (r) {return r.Key === 'PRI';});

    //for multiple primary keys, just take the first
    if(primary_keys.length > 0) {
        return primary_keys[0].Field;
    }

    //If the provided field is a string, we might have a chance
    if(typeof field === "string") {
        if(this.checkIfFieldsExist(field,columns)) {
            return this.escape(field);
        }
    }

    //FALLBACK
    return "id";
}


/**
 * Search in DB if the field(s) exist
 * @param fieldStr
 * @param rows
 * @returns {boolean}
 */

module.exports.checkIfFieldsExist = function (fieldStr,rows) {

    var ret = true;

    if(fieldStr.search(',') > -1 ) {
        var fieldArr = fieldStr.split(',');
        fieldArr.forEach(function (field) {
            if(ret) {
                if(rows.filter(function (r) {return r.Field === field;}).length == 0) {
                    ret = false;
                }
            }
        });
    } else {
        if(rows.filter(function (r) {return r.Field === fieldStr;}).length == 0) {
            ret = false;
        }
    }

    return ret;
}
