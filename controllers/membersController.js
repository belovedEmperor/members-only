const bcrypt = require("bcryptjs");
const passport = require("passport");
const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

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

function signupGet(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/", { message: "You are already logged in." });
  }
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

function loginGet(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/", { message: "You are already logged in." });
  }
  res.render("loginForm");
}

const loginPost = [
  validateLoginInfo,
  async (req, res) => {
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

async function logoutPost(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

module.exports = { signupGet, signupPost, loginGet, loginPost, logoutPost };
