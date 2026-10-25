const bcrypt = require("bcryptjs");
const passport = require("passport");
const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

const redirectIfAuth = (req, res, next) =>
  req.isAuthenticated() ? res.redirect("/") : next();
const redirectIfNotAuth = (req, res, next) =>
  req.isAuthenticated() ? next() : res.redirect("/");

const emptyErr = "must not be empty.";
const alphaErr = "must be alphabetical.";
const whitespaceErr = "must not contain whitespace.";
const passwordLengthErr = "must be between or equal to 8 and 25 characters.";

const whitespaceValidator = (value) => {
  return value.includes(" ") ? false : true;
};

const validateLoginInfo = [
  body("email").trim().notEmpty().withMessage(`Email ${emptyErr}`),
  body("email")
    .custom(whitespaceValidator)
    .withMessage(`Email ${whitespaceErr}`),
  body("email").trim().isEmail().withMessage(`Email must be valid.`),
  body("password").trim().notEmpty().withMessage(`Password ${emptyErr}`),
  body("password")
    .isLength({ min: 8, max: 25 })
    .withMessage(`Password ${passwordLengthErr}`),
  body("password")
    .custom(whitespaceValidator)
    .withMessage(`Password ${whitespaceErr}`),
  body("password")
    .isStrongPassword({ minLowercase: 1, minUppercase: 1 })
    .withMessage(
      `Password must have at least 1 lowercase and 1 uppercase letter.`,
    ),
  body("password")
    .isStrongPassword({ minNumbers: 1 })
    .withMessage(`Password must have at least 1 number.`),
  body("password")
    .isStrongPassword({ minSymbols: 1 })
    .withMessage(`Password must have at least 1 symbol.`),
];

const validateSignupInfo = [
  ...validateLoginInfo,
  body("firstName").trim().notEmpty().withMessage(`First name ${emptyErr}`),
  body("firstName").trim().isAlpha().withMessage(`First name ${alphaErr}`),
  body("lastName").trim().notEmpty().withMessage(`Last name ${emptyErr}`),
  body("lastName").trim().isAlpha().withMessage(`Last name ${alphaErr}`),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage(`Password confirmation ${emptyErr}`),
  body("confirmPassword")
    .custom(whitespaceValidator)
    .withMessage(`Password confirmation ${whitespaceErr}`),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`Password confirmation ${whitespaceErr}`),
];

function signupGet(req, res, next) {
  res.render("signupForm");
}

const signupPost = [
  validateSignupInfo,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signupForm", {
        errors: errors.array(),
      });
    }

    try {
      const { firstName, lastName, email, password } = matchedData(req);
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.insertUser(firstName, lastName, email, hashedPassword);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];

function loginGet(req, res, next) {
  res.render("loginForm");
}

const loginPost = [
  validateLoginInfo,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("loginForm", {
        errors: errors.array(),
      });
    }

    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureMessage: true,
    })(req, res);
  },
];

function logoutGet(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

function secretGet(req, res, next) {
  res.render("secretForm");
}

async function secretPost(req, res, next) {
  if (req.body.secretCode === process.env.MEMBER_SECRET) {
    await db.updateUserToMember(req.user.id);
    next();
  } else if (req.body.secretCode === process.env.ADMIN_SECRET) {
    await db.updateUserToAdmin(req.user.id);
    next();
  }

  res.redirect("/");
}

async function messagesGet(req, res) {
  let messages = await db.getAllMessages();
  for (const message of messages) {
    const user = await db.getUser(message.user_id);
    message.name = `${user.first_name} ${user.last_name}`;
  }
  res.render("home", { messages });
}

async function newMessageGet(req, res, next) {
  res.render("newMessageForm");
}

const validateMessage = [
  body("title").trim().notEmpty().withMessage(`Email ${emptyErr}`),
  body("text").trim().notEmpty().withMessage(`Email ${emptyErr}`),
];

const newMessagePost = [
  validateMessage,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newMessageForm", {
        errors: errors.array(),
      });
    }

    try {
      const { title, text } = matchedData(req);
      await db.insertMessage(title, text, req.user.id);
      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];

async function deleteMessagePost(req, res) {
  if (req.user.membership_status === "admin") {
    await db.deleteMessage(req.params.id);
  }
  res.redirect("/");
}

module.exports = {
  redirectIfAuth,
  redirectIfNotAuth,
  signupGet,
  signupPost,
  loginGet,
  loginPost,
  logoutGet,
  secretGet,
  secretPost,
  messagesGet,
  newMessageGet,
  newMessagePost,
  deleteMessagePost,
};
