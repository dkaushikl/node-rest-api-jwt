const express = require('express');
const app = express();

const morgan = require('morgan');

const movies = require('./routes/movies');
const users = require('./routes/users');

const bodyParser = require('body-parser');
const mongoose = require('./config/database'); //database configuration
const jwt = require('jsonwebtoken');
const validateUser = require('./app/middleware/validate-user');
app.set('secretKey', 'nodeRestApi'); // jwt secret token

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.json({ "tutorial": "Build REST API with node.js" });
});

// public route
app.use('/auth', users);

// private route
app.use('/movies', validateUser, movies);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    if (err.status === 404)
        res.status(404).json({ message: "Not found" });
    else
        res.status(500).json({
            message: error.message,
            stack: error.stack
        });
})

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Node server listening on port' + port);
});