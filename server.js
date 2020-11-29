const express = require("express");
const exphbs = require("express-handlebars");
const expressSession = require('express-session');
const expressHandlebars = require('express-handlebars');
const fileUpload = require('express-fileupload');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const app = express();
const port = 3000;
const hostname = "127.0.0.1";
const mongoose = require("mongoose");
const connectMongo = require('connect-mongo');
const bodyParser = require("body-parser");
const methodOverride = require('method-override');

// Database Connect
mongoose.connect("mongodb://127.0.0.1/timurhan", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const mongoStore = connectMongo(expressSession);

// Session
app.use(expressSession({
  secret: 'testotesto',
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({ mongooseConnection: mongoose.connection })
}));


// File Upload Middleware
app.use(fileUpload());

// Static Files CSS-JS-IMG
app.use(express.static("public"));

// Method Override
app.use(methodOverride('_method'));

// Display Middleware  
app.use((req, res, next) => {
  const { userId } = req.session;
  if(userId) {
    res.locals = {
      displayLink: true
    }
  }
  else {
    res.locals = {
      displayLink: false
    }
  }
  next()
});

// Flash Message
app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash
  delete req.session.sessionFlash
  next()
});

app.engine("handlebars", expressHandlebars({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}), exphbs());
app.set("view engine", "handlebars");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const main = require("./routes/main");
const arsa = require("./routes/arsa");
const users = require("./routes/users");
const admin = require("./routes/admin/index")
app.use("/", main);
app.use("/ilanlar", arsa);
app.use("/users", users);
app.use("/admin", admin);

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.send('<div class="contanier" style="font-size:70px;font-family:monospace;text-align:center;">Sayfa Bulunamadı</div><br><div class="contanier" style="font-size:30px;font-family:monospace;text-align:center;color:royalblue;margin-top:650px;">Minor Software</div>');
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// Project Start
app.listen(port, hostname, () => {
  console.log(` Example app listening, http://${hostname}:${port}/`);
});