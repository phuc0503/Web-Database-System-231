const express = require('express')
const configViewEngine = require('./config/viewEngine');
const session = require('express-session');
const flush = require('connect-flash');
const webRoutes = require('./routes/web');
// const connection = require('./config/database');

const app = express()
const port = 3000

//config req.body to get data from client
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data
app.use(session({
  secret: 'secret',
  cookie: {maxAge: 60000},
  resave: false,
  saveUninitialized: false
}));
app.use(flush());

//config template engine
configViewEngine(app);

//khai bao route
app.use('/', webRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})