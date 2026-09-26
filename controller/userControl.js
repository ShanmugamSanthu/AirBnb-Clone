import ExpressError from "../error.js";
import userAccount from "../config_DB/models/userAccountSchema.js";

//login page render
export const loginForm = (req, res) => {
  const error = req.flash("error");
  res.render("login");
};

//signup page render
export const signUpForm = (req, res) => {
  res.render("signup");
};

//signup form
export const signUp = async (req, res, next) => {
  const { username, password, userEmail } = req.body;
  const data = { username, userEmail };
  const result = await userAccount.findOne({ userEmail });
  if (result) {
    const newErr = new ExpressError(
      "Email id exists login with the same id or signup with new email",
      400,
    );
    return next(newErr);
  } else {
    try {
      await userAccount.register(data, password);
      req.flash(
        "success",
        "Account created successfully login with same credentials",
      );
      res.redirect("/user/loginpage");
    } catch (err) {
      console.log(err);
      const newError = new ExpressError(
        "Username already taken try a different name",
        400,
      );
      next(newError);
    }
  }
};

// session destroy account logout
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      const newErr = new ExpressError("unable to logout", 500);
      return next(newErr);
    }
    req.session.destroy((err) => {
      if (err) {
        const newErr = new ExpressError("unable to logout", 500);
        return next(newErr);
      }
    });
    res.redirect("/user/loginpage");
  });
};
