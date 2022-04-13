const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const userdetail = require("./users");

router.get("/", async (rerquest, response) => {
  if (rerquest.session.user) response.redirect("/private");
  else response.render("login", { message: "You're not logged in" });
});

router.post("/login", async (request, response) => {
  let userdata = await request.body;
  let username = userdata["username"];
    let password = userdata["password"];
    
  let flag = 0;
  let flag1 = false;
  for (let i = 0; i <= userdetail.length - 1; i++) {
    if (userdetail[i].username == username) {
      flag1 = await bcrypt.compareSync(password, userdetail[i].hashedPassword);
      if (flag1 == true) {
        request.session.user = userdetail[i].username;
        response.redirect("/private");
        break;
      } else if (flag1 == false)
        response
          .status(401)
          .render("login", { error: "Invalid Username or Password" });
    } else if (userdetail[i].username !== username) {
      flag = flag + 1;
      if (flag > userdetail.length - 1) break;
    }
  }
  if (flag >= userdetail.length)
    response.status(401).render("login", { error: "Invalid Username or Password" });
});

const loginauthCheck = (request, response, next) => {
  if (request.session.user) next();
  else response.status(403).render("error");
};

router.get("/private", loginauthCheck, async (request, response) => {
  if (request.session.user != undefined) {
    for (let j = 0; j <= userdetail.length - 1; j++) {
      if (request.session.user == userdetail[j].username) {
        response.render("user", {
          _id: userdetail[j]._id,
          username: userdetail[j].username,
          firstName: userdetail[j].firstName,
          lastName: userdetail[j].lastName,
          profession: userdetail[j].profession,
          bio: userdetail[j].bio,
        });
        break;
      }
    }
  } else response.status(403).render("error");
});

router.get("/logout", async (request, response) => {
    request.session.destroy();
    
    response.clearCookie("AuthCookie");
    
  response.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
    
  response.render("logout", { message: "You are logged out!" });
});

module.exports = router;
