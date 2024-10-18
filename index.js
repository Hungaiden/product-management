const express = require("express");
var path = require('path');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override')
const http = require('http');
const { Server } = require("socket.io");

const app = express();
require('dotenv').config();
const port = process.env.PORT;

const server = http.createServer(app);
const io = new Server(server);

const database = require("./config/database");
database.connect();

const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use(express.static(`${__dirname}/public`)); // Thiết lập thư mục chứa file tĩnh

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.locals.prefixAdmin = "admin";

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Flash
app.use(cookieParser('JKSLSF'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

routeAdmin.index(app);
routeClient.index(app); 

io.on("connection", (socket) => {
  console.log("Có 1 user kết nối!", socket.id);
});


server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});