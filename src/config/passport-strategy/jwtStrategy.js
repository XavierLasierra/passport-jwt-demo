const passport = require("passport");
const JWTstrategy = require("passport-jwt");

passport.use(
  new JWTstrategy.Strategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: JWTstrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
