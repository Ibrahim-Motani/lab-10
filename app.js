const session = require("express-session");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(async (request, response, next) => {
  let auth;

    if (request.session.user !== "")
        auth = "Authenticated User";
  else 
    auth = "Non-Authenticated User";
  
  console.log(new Date().toUTCString(), request.method, request.originalUrl, auth);
  next();
});

configRoutes(app);
app.listen(3000, () => {
  console.log(
    "Local server started on http://localhost:3000"
  );
});
