var express = require("express"),
    SiteRoutes = require('./server/routes/siteRoutes');
var app = express();
app.use(express.logger());

// Configuration

// app conf
// development only : set a NODE_ENV=development env variable on your dev machine
// or run with NODE_ENV=development node app.js
app.configure('development', function () {

    app.set('views', __dirname + '/app');
    app.use('/styles', express.static(__dirname + '/.tmp/styles'));
    app.use(express.static(__dirname + '/app'));

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

    app.engine('html', require('ejs').renderFile);
});

// production only : run with NODE_ENV=production node app.js
app.configure('production', function () {
    app.set('views', __dirname + '/dist');
    app.use(express.static(__dirname + '/dist'));
    app.use(express.bodyParser());
    app.use(app.router);
    app.engine('html', require('ejs').renderFile);
});

var routes = new SiteRoutes();

app.post('/create', routes.create);
app.post('/delete', routes.delete);
app.get('/sites', routes.getSites);


app.get('/', function (request, response) {
    response.render('index.html')
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
