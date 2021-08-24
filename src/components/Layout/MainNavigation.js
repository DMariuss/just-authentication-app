import classes from "./MainNavigation.module.css";
import { Link } from "react-router-dom";
// import AuthContext from "../../store/auth-context_clear";
import AuthContext from "../../store/auth-context";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

const Navigation = (props) => {
  //folosesc propr. din context pt a gestiona ceea ce afisam 🢣 afisare conditionata
  const authContext = useContext(AuthContext);
  const history = useHistory();

  const onLogoutHandler = () => {
    authContext.logout();
    //optional: 🢣 redirectionez userul catre o alta pagina (de ex, ma aflu pe pag cu profilul si ma deloghez)
    history.replace("/"); // dar aplic alta metoda pt ca vreau sa protejez accesarea nedorita a altor url-paths.
    // **ultima modificare, pot folosi si
    // 🢣 metoda este simpla 🢣 randez rutele in mod conditionat 🢣 App.js
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!authContext.isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {authContext.isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {authContext.isLoggedIn && (
            <li>
              <button onClick={onLogoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
