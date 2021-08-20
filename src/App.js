import "./App.css";
import { Switch, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import UserPage from "./Pages/UserPage";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/auth">
          <AuthPage />
        </Route>
        <Route path="/profile">
          <UserPage />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
