const passport = require("passport");
const { Strategy } = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../../models/user.model");

passport.use(
  "signup",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      bcrypt.hash(password, +process.env.BCRYPT_SALT, async (err, hash) => {
        try {
          if (err) throw new Error("Password encryption error");

          const userExists = await User.find({ email });
          if (userExists.length > 0) throw new Error("User already registered");

          const user = await User.create({ email, password: hash });
          done(null, user);
        } catch ({ message }) {
          done(null, false, { message });
        }
      });
    }
  )
);

passport.use(
  "login",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("User not registered");
        }

        if (!user.isValidPassword(password)) {
          throw new Error("Invalid password");
        }

        done(null, user);
      } catch ({ message }) {
        done(null, false, { message });
      }
    }
  )
);
