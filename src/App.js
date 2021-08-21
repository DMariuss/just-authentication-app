import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import UserPage from "./pages/UserPage";
import AuthContext from "./store/auth-context";
import { useContext } from "react";

function App() {
  const authContext = useContext(AuthContext);

  //putem gestiona rutele in functie de starea de autentificare *********************** route guarding 🢣 protejarea rutelor din url...

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {!authContext.isLoggedIn && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}
        {/* {authContext.isLoggedIn && (
          <Route path="/profile">
            <UserPage />
          </Route>
        )} // 🢣 varianta mai buna, urmatoarea  🢣 🢣 */}
        <Route path="/profile">
          {authContext.isLoggedIn && <UserPage />}
          {/* daca nu sunt logat, sa ma redirectioneze catre pagina de logare */}
          {!authContext.isLoggedIn && <Redirect to="/auth" />}
        </Route>
        {/* in cazul in care userul intra pe orice alt url-path  */}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
