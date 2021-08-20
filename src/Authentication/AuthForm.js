import classes from "./AuthForm.module.css";
import { useState } from "react";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input id="email" name="email" placeholder="Email adress" />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            id="password"
            name="password"
            placeholder="Insert your password"
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create"}</button>
          <button
            className={classes.toggle}
            type="button"
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
