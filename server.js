console.log("<npm start> should be called to start the server.")
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var fs = require('fs');
var app = express();
var config = require('./config/config.js');
// Catch errors
// sessionStore.on('error', function (error) {
//     assert.ifError(error);
//     assert.ok(false);
// });
// ===============================================================

app.use(express.static('public'))
app.use('/uploads', express.static('public'))

const mongooseOption = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

mongoose.connect(config.dbUrl, mongooseOption, function (err) {
    if (err) {
        console.log("********************************!!! WARNING plzzz !!!*********************************");
        console.log("                          Cannot connect to Database");
        console.log("             Please Start database first than restarting this server.");
        console.log("**************************************************************************************");
        console.log(err)
    } else {
        console.log("======================== DB is CONNECTED =========================")
        let mailer = require('./app/service/mailer.js')
        mailer.triggerOAuth()
    }
});

app.use(logger('dev')); // log every request to the console
app.use(bodyParser.json({
    limit: '1000mb',
    parameterLimit: 300000
}));
app.use(bodyParser.urlencoded({
    limit: '1000mb',
    extended: true,
    parameterLimit: 300000
}));
app.use(bodyParser.raw({ limit: '1000mb' }));
app.use(bodyParser.text({ limit: '1000mb' }));

// ROUTES FOR OUR API
// =============================================================================
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// app.use('/api', require('./app/route/developmentAPI.js'));
// app.use('/api', require('./app/route/thesisAPI.js'));

//partial API
app.use('/api', require('./app/route/newsAPI.js'));
app.use('/api', require('./app/route/contactAPI.js'));
app.use('/api/auth', require('./app/route/authAPI.js'));
app.use('/api', require('./app/service/fileUpload.js'));

// Error handler
app.use(function (err, req, res, next) {
    let code = err.code || 500
    let message = err.message || "Internal server error"
    res.status(code).json({ code, message });
});

// START THE SERVER
// =============================================================================

var http = require('http');
let port = process.env.PORT || 5713;
var https = require('https');

if (!config.httpsMode) {
    port = process.env.PORT || config.httpport;
    var httpServer = http.createServer(app);

    httpServer.listen(port, function () {
        console.log(`=========== HTTP Server started @port ${port} successfully ==========`)
    })
}
else {
    port = process.env.PORT || config.httpsport;
    var httpsServer = https.createServer({
        key: fs.readFileSync('./config/privkey.pem'),
        cert: fs.readFileSync('./config/cert.pem')
    }, app)

    httpsServer.listen(port, function () {
        console.log(`========== HTTPS Server started @port ${port} successfully ==========`)
    })
}
