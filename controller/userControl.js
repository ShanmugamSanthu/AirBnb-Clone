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

  let result = null;
  try {
    result = await userAccount.findOne({ userEmail });
  } catch (error) {
    console.log(error);
    const newErr = new ExpressError("", 500);
    next(newErr);
    return;
  }

  if (result) {
    const newErr = new ExpressError("", 200);
    return next(newErr);
  } else {
    try {
      await userAccount.register(data, password);

      res.status(201).json("Account created successfully");
    } catch (err) {
      console.log(err);
      const newError = new ExpressError("", 409);
      next(newError);
    }
  }
};

// session destroy account logout
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      const newErr = new ExpressError("", 500);
      return next(newErr);
    }
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        const newErr = new ExpressError("", 500);
        return next(newErr);
      }
      res.redirect("/user/loginpage");
    });
  });
};
