const { Router } = require("express");
const membersRouter = Router();
const membersController = require("../controllers/membersController");

membersRouter.get("/", membersController.messagesGet);
membersRouter.get(
  "/signup",
  membersController.redirectIfAuth,
  membersController.signupGet,
);
membersRouter.post("/signup", membersController.signupPost);
membersRouter.get(
  "/login",
  membersController.redirectIfAuth,
  membersController.loginGet,
);
membersRouter.post("/login", membersController.loginPost);
membersRouter.get("/logout", membersController.logoutGet);
membersRouter.get(
  "/secret",
  membersController.redirectIfNotAuth,
  membersController.secretGet,
);
membersRouter.post("/secret", membersController.secretPost);
membersRouter.get(
  "/new",
  membersController.redirectIfNotAuth,
  membersController.newMessageGet,
);
membersRouter.post("/new", membersController.newMessagePost);
membersRouter.post("/message/:id/delete", membersController.deleteMessagePost);

module.exports = membersRouter;
