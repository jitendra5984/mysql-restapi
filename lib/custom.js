var connection,
    lastQry,
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
        runQuery: function (req, res) {
            var query = req.params.query;

            lastQry = connection.query(query, function (err, rows) {
                if (err) return functions.sendError(res, err.code, query);
                res.send({
                    result: 'success',
                    json: rows,
                    length: rows.length
                });
            });

        },
        runPostQuery: function(req, res){
            var query = req.body.query;

            lastQry = connection.query(query, function (err, rows) {
                if (err) return functions.sendError(res, err.code, query);
                res.send({
                    result: 'success',
                    json: rows,
                    length: rows.length
                });
            });
        }
    }
};
