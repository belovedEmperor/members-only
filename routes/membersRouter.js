const { Router } = require("express");
const membersRouter = Router();
const membersController = require("../controllers/membersController");

membersRouter.get("/", membersController.messagesGet);
membersRouter.get(
  "/signup",
  membersController.redirectIfAuth,
  membersController.signupGet,
);
membersRouter.post(
  "/signup",
  membersController.redirectIfAuth,
  membersController.signupPost,
);
membersRouter.get(
  "/login",
  membersController.redirectIfAuth,
  membersController.loginGet,
);
membersRouter.post(
  "/login",
  membersController.redirectIfAuth,
  membersController.loginPost,
);
membersRouter.get(
  "/logout",
  membersController.redirectIfAuth,
  membersController.logoutGet,
);
membersRouter.get(
  "/secret",
  membersController.redirectIfNotAuth,
  membersController.secretGet,
);
membersRouter.post(
  "/secret",
  membersController.redirectIfNotAuth,
  membersController.secretPost,
);
membersRouter.get(
  "/new",
  membersController.redirectIfNotAuth,
  membersController.newMessageGet,
);
membersRouter.post(
  "/new",
  membersController.redirectIfNotAuth,
  membersController.newMessagePost,
);
membersRouter.post(
  "/message/:id/delete",
  membersController.redirectIfNotAuth,
  membersController.deleteMessagePost,
);

module.exports = membersRouter;
