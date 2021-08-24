import React, { useState, useEffect, useCallback } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationDate) => {
  const currentTime = new Date().getTime();
  const futureTime = new Date(expirationDate).getTime();
  const remainingDuration = futureTime - currentTime;

  return remainingDuration;
};

//functie personalizata ce-mi gestioneaza datele din local storage
const localStorageModifier = (config) => {
  switch (config.type.toUpperCase()) {
    case "SET":
      for (let key in config.payload) {
        localStorage.setItem(key, config.payload[key]);
      }
      break;
    case "REMOVE":
      for (let key of config.payload) {
        localStorage.removeItem(key);
      }
      break;
    default:
      console.log("something wrong in LSModifier");
  }
};

//functie ce preia datele din local storage
const retrieveStorageData = () => {
  console.log("in retrieveStorageData ");
  const idToken = localStorage.getItem("id_token");
  const expirationDate = localStorage.getItem("exp_date");

  const remainingTime = calculateRemainingTime(expirationDate);

  //am aici alta logica ce face acelasi lucru ca si logoutHandler, doar ca eu practic re-initializez datele in cazul in care timpul de expirare este mai mic de 10min
  if (remainingTime < 10 * 60 * 1000) {
    localStorageModifier({ type: "remove", payload: ["id_token", "exp_date"] });
    console.log("remaining time was lower than 10 mins");
    return null;
  }
  return {
    idToken,
    remainingTime,
  };
};

//definesc var ce preia id-ul timerului globala
let loginTimer;

export const AuthContextProvider = (props) => {
  //   const initialToken = localStorage.getItem("id_token"); //combinata cu varianta cealalta din useEFfect
  const [token, setToken] = useState(null); // 🢣 daca nu exista va fi null

  //nu mai avem nevoie de o alta stare pt a verifica daca utilizatorul este sau nu logat 🢣
  // verificam daca avem sau nu token-ul
  const userIsLoggedIn = !!token; // daca token-ul este gol 🢣 false (practic verific daca am sau nu tokenul)

  const logoutHandler = useCallback(() => {
    console.log("Successfully logged out!");
    localStorageModifier({ type: "remove", payload: ["id_token", "exp_date"] });
    //golesc starea ce mentine token-ul
    setToken(null);

    if (loginTimer) {
      clearTimeout(loginTimer);
    }
  }, []);

  //funtie pe o apelez pt a prelua token-ul si a retine starea de logg-in
  const loginHandler = (token, expirationDate) => {
    localStorageModifier({
      type: "set",
      payload: { id_token: token, exp_date: expirationDate },
    });
    //preiau token-ul
    setToken(token);

    const remainingTime = calculateRemainingTime(expirationDate);

    loginTimer = setTimeout(logoutHandler, remainingTime);
    // * mentiune 🢣 cand reincarc pagina acest API nu se mai executa 🢣 dispare
  };

  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  // 🢣 o alta varianta este mai sus: inainte de toate preiau token-ul din localStorage.
  // useEffect(() => {
  //   const id_token = localStorage.getItem("id_token");
  //   if (id_token !== "") {
  //     setToken(id_token);
  //   } ⇧  o varianta initiala  🢣 🢣 🢣 🢣 🢣 poate fi pusa intr-o functie externa si verificata (cum am facut mai sus)
  // }, []);

  //cand reincarc pagina vreau sa inchid vechiul timer
  useEffect(() => {
    const tokenData = retrieveStorageData();
    if (tokenData) {
      setToken(tokenData.idToken);
      loginTimer = setTimeout(logoutHandler, tokenData.remainingTime);
    }

    // console.log("in useEffect again");
    // if (token) {
    //   console.log("a intrat pe token useEffect");
    //   const expirationDate = localStorage.getItem("exp_date");
    //   let remainingTime = calculateRemainingTime(expirationDate);

    //   if (remainingTime < 10 * 60 * 1000) {
    //     remainingTime = 0;
    //   }
    //   loginTimer = setTimeout(logoutHandler, remainingTime);
    // }   ⇧ ⇧ ⇧ varianta care depinde de token-ul din stare si care se evalueaza la orice modificare -este mai greoaie

    return () => clearTimeout(loginTimer);
  }, [logoutHandler]);
  // 🢣 se va intra pe acest useEffect() de fiecare data pt ca tokenData este definit de fiecare data cand se reevalueaza componenta.

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
