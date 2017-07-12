// BASE SETUP
// =============================================================================

// call the packages we need
var bodyParser      = require('body-parser');
var multer          = require('multer');
var cors            = require('cors');

module.exports = function(app, dbconfig) {

    if(!app) throw new Error('Please provide express to this module');

    var options = dbconfig.options;
    var connection = dbconfig.connection;
    var corsOptions = dbconfig.corsOptions;

    //Parse Options
    options = options || {};
    options.uploadDestination = options.uploadDestination || __dirname + '/uploads/';   //Where to save the uploaded files
    options.maxFileSize = options.maxFileSize || -1;                                    //Max filesize for uploads in bytes
    options.apiURL = options.apiURL || 'api';                                          //Url Prefix for API
    options.paramPrefix = options.paramPrefix || '_';                                   //Prefix for special params (eg. order or fields).

    app.use(cors(corsOptions));

    app.use(bodyParser.json());
    app.use(bodyParser.raw());
    app.use(bodyParser.urlencoded({ extended: false }) );
    app.use(multer({dest: options.uploadDestination }));

    var ensureAuthenticated = function(req,res,next) {
        next();
    };

    var api = require('./lib/api.js')(connection,{
        maxFileSize:options.maxFileSize,
        paramPrefix:options.paramPrefix
    });

    //Set actual routes
    app.get('/' + options.apiURL + '/crud' + '/:table', ensureAuthenticated, api.findAll);
    app.get('/' + options.apiURL + '/crud' + '/:table/:id', ensureAuthenticated, api.findById);
    app.post('/' + options.apiURL + '/crud' + '/:table', ensureAuthenticated, api.addElement);
    app.put('/' + options.apiURL + '/crud' + '/:table/:id', ensureAuthenticated, api.updateElement);
    app.delete('/' + options.apiURL + '/crud' + '/:table/:id', ensureAuthenticated, api.deleteElement);

    var customAPI = require('./lib/custom.js')(connection);

    app.get('/' + options.apiURL + '/custom' + '/:query', ensureAuthenticated, customAPI.runQuery);
    app.post('/' + options.apiURL + '/custom', ensureAuthenticated, customAPI.runPostQuery);

    var checkAPI = require('./lib/check.js')(connection);

    app.post('/' + options.apiURL + '/check/:table', ensureAuthenticated, checkAPI.checkQuery);

    //Export API
    return {
        setAuth:function(fnc) {
            ensureAuthenticated = fnc;
        }
    }
};