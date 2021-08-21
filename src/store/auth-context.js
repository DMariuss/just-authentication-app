import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);

  //nu mai avem nevoie de o alta stare pt a verifica daca utilizatorul este sau nu logat 🢣
  // verificam daca avem sau nu token-ul
  const userIsLoggedIn = !!token; // daca token-ul este gol 🢣 false (practic verific daca am sau nu tokenul)

  //funtie pe o apelez pt a prelua token-ul si a retine starea de logg-in
  const loginHandler = (token) => {
    //preiau token-ul
    setToken(token);
  };
  const logoutHandler = () => {
    //golesc starea ce mentine token-ul
    setToken(null);
    console.log("Successfully logged out!");
  };

  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
