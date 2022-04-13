const routes = require("./session");

const appConstruct = app => {
  app.use("/", routes);

  app.use("/logout", routes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "404" });
  });
};

module.exports = appConstruct;
