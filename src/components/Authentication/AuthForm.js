import classes from "./AuthForm.module.css";
import { useState, useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
//folosesc un hook din react-router-dom pt a redirectiona catre o alta pagina in momentul in care ma loghez
import { useHistory } from "react-router-dom";

export const API_KEY = "AIzaSyBHHNgSX1Ld1tFRzQjwAlW5azBCAJDIRG0";

const AuthForm = () => {
  //creez obiectul history
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(true);
  // 🢣 pt validare
  const [formValidity, setFormValidity] = useState({
    email: true,
    password: true,
  });
  //stare pt incarcare
  const [isLoading, setIsLoading] = useState(false);
  // 🢣 pt preluarea valorilor inputurilor
  const emailRef = useRef();
  const passwordRef = useRef();

  //contextul in care am logica de preluare a token-ului  + altele
  const authContext = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    //conditiile de validare
    const emailIsValid = enteredEmail.includes("@");
    const passwordIsValid = enteredPassword.length > 5;

    let formIsValid = emailIsValid && passwordIsValid;

    setFormValidity({ email: emailIsValid, password: passwordIsValid });

    if (!formIsValid) {
      return;
    }

    setIsLoading(true);

    //pt ca la fiecare solicitare se schimba doar url-ul pot crea o variabila si scrie cod cu un singur fetch()
    let url;
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
    })
      .then((response) => {
        //odata ce am primit raspunsul(indiferent de raspuns) modific dezactivez incarcarea
        setIsLoading(false);
        //verific daca am sau nu eroare pe raspuns
        if (response.ok) {
          // daca totul este ok ..continui
          console.log("a intrat pe response.ok");
          return response.json();
        } else {
          //analizez raspunsul si preiau eroarea
          return response.json().then((data) => {
            //gestionez eroarea aici
            let errorMessage = "Authentication failed!"; // 🢣 mesajul implicit
            //verific daca am aceste proprietati
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            //aici pot adauga modalul sau pot afisa eroarea.
            // alert(errorMessage);

            //in cazul acesta arunc eroarea pt a fi prinsa in catch() -> pt ca vreau sa folosesc ramura cealalta
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        //obiectul cu datele corecte 🢣 preiau token-ul;
        authContext.login(data.idToken);
        // 🢣 si redirectionez catre pagina principala
        history.replace("/"); // 🢣.replace pt ca nu vreau sa utiliz. sa fie capabil sa se reintoarca la pagina precedenta cu butonul de back
      })
      .catch((err) => alert(err));
  };

  const emailClasses = `${classes.control} ${
    formValidity.email ? "" : classes.invalid
  }`;
  const passwordClasses = `${classes.control} ${
    formValidity.password ? "" : classes.invalid
  }`;
  return (
    <section className={classes.auth} onSubmit={submitHandler}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form>
        <div className={emailClasses}>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email adress"
            ref={emailRef}
          />
          {!formValidity.email && <p>Please insert a valid email!</p>}
        </div>
        <div className={passwordClasses}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Insert your password"
            ref={passwordRef}
          />
          {!formValidity.password && (
            <p>Please insert a valid password ( >= 6 )!</p>
          )}
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? "Login" : "Create"}</button>}
          {isLoading && <p>Sending Request...</p>}
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
