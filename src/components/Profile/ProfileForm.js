import classes from "./ProfileForm.module.css";
import { useRef, useState, useContext } from "react";
import AuthContext from "../../store/auth-context";
// import AuthContext from "../../store/auth-context_clear";
import { API_KEY } from "../Authentication/AuthForm";

const ProfileForm = () => {
  const authContext = useContext(AuthContext);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const newPasswordRef = useRef();

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const newPassword = newPasswordRef.current.value;
    const newPasswordIsValid = newPassword.length > 5;

    if (!newPasswordIsValid) {
      setPasswordIsValid(newPasswordIsValid);
      return;
    }

    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: authContext.token,
          password: newPassword,
          returnSecureToken: false,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            let errorMessage = "Request failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        //presupun ca am avut succes
        console.log("Successfully changed the password", data);
      })
      .catch((err) => alert(err));
  };

  const passInputClasses = `${classes.control} ${
    passwordIsValid ? "" : classes.invalid
  }`;

  return (
    <form className={classes.form} onSubmit={onSubmitHandler}>
      <div className={passInputClasses}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          name="new-password"
          placeholder="Insert a new password"
          ref={newPasswordRef}
        />
        {!passwordIsValid && <p>Please enter a valid password ( >= 6 )</p>}
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
