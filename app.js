var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var session = require('express-session')

var app = express()
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/login", (req, res, next) => {
    console.log("\n", req.path);
    req.session.isAuthenticated = true;
    console.log("session: \n", req.session);
    res.send("Login Success.")
})

app.get("/test", ((req, res, next) => {
    if (req.session && req.session.isAuthenticated){
        res.send("It is good")
    } else {
        res.send("Have not logged in yet!")
    }
}))

app.get("/logout", (req, res, next) => {
    console.log("\n", req.path);
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send({errorMessage: 'Unable to log out'})
            } else {
                res.status(200).send({ message: 'Logout successful'})
            }
        });
    } else {
        res.send("Already logout")
    }
})

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log("-------------------------------------\n")
    console.log(`Server is listening on port ${PORT}`);
    console.log("-------------------------------------\n")
});

module.exports = app;
