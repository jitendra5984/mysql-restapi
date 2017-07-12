var connection,
    finalQuery,
    mysql = require('mysql');
    functions = require('./functions.js');
;

module.exports = function(connection_) {

    //Parse params
    if (!connection_) throw new Error('No connection specified!');
    else connection = connection_;


    //Export API
    return {
        /**
         * find single entry by selector (default is primary key)
         * @param req
         * @param res
         */
        checkQuery: function(req, res){
            var queryTable;
            queryTable = functions.escape(req.params.table);

            finalQuery = connection.query('SHOW COLUMNS FROM ??', queryTable, function (err, rows) {
                if (err) return functions.sendError(res, "Table does not exist", finalQuery);

                var fieldnames, fieldvalues, fieldquerystring;
                var fieldquery = [];
                fieldnames = Object.keys(req.body);
                fieldvalues = Object.values(req.body);
                
                if(typeof req.body !== "undefined" && typeof req.body == "object" && fieldnames.length>0){
                //if(fieldnames.length>0){
                    if (functions.checkIfFieldsExist(fieldnames.join(","), rows)==false) {
                        return functions.sendError(res, "Failed to fetch all fields specified in fields", finalQuery);
                    }

                    for(var i=0; i<fieldnames.length; i++){
                        fieldquery[i]="`" + fieldnames[i] + "`='" + fieldvalues[i] + "'";
                    }
                    fieldquerystring = fieldquery.join(" AND ");

                    finalQuery = connection.query('SELECT * FROM ?? WHERE ' + fieldquerystring, queryTable, function (err, rows){
                        if (err) return functions.sendError(res, err.code, finalQuery);
                        var querystatus = false;
                        if (rows.length>0){
                            querystatus = true;
                        }

                        res.send({
                            result: 'success',
                            json: querystatus,
                            length: rows.length
                        });
                    });
                }
                else {
                    return functions.sendError(res, "fields are not defined in correct format", finalQuery);
                }
            });
        }
    }
};
