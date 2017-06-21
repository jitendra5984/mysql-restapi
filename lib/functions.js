
module.exports.sendError = function(res, err, lastQry) {
    console.error(err);
    // also log last executed query, for easier debugging
    console.error(lastQry.sql);
    res.statusCode = 500;
    res.send({
        result: 'error',
        err:    err
    });
}
