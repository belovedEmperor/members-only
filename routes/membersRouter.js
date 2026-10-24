const { Router } = require("express");
const membersRouter = Router();
const membersController = require("../controllers/membersController");

membersRouter.get("/signup", membersController.signupGet);
membersRouter.post("/signup", membersController.signupPost);
membersRouter.get("/login", membersController.loginGet);
membersRouter.post("/login", membersController.loginPost);

module.exports = membersRouter;
