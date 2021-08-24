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
  const tokenData = retrieveStorageData();
  //situatia este ca atunci cand ma loghez, functia aceasta se executa din nou(pt ca se executa reevaluarea codului) ..dar nu apuca sa preia valorile din
  // localStorage(DE CE? PT CA ... vezi in LOGIN explicatia)  🢣 idToken= null la login 🢣 conform acestei logici
  console.log("tokenData: ", tokenData);
  console.log("reevaluation of this ");
  let id_token;
  if (tokenData) {
    id_token = tokenData.idToken;
    //ar trebui sa temporizez delogarea automata 🢣 pt ca nu vreau sa reimprospatez token-ul acum ...
    //nu pot asta aici, asa ca o sa folosesc useEffect() pt efectele secundare ale dependentelor.
  }

  const [token, setToken] = useState(id_token); // 🢣 daca nu exista va fi null

  //nu mai avem nevoie de o alta stare pt a verifica daca utilizatorul este sau nu logat 🢣
  // verificam daca avem sau nu token-ul
  const userIsLoggedIn = !!token; // daca token-ul este gol 🢣 false (practic verific daca am sau nu tokenul)

  const logoutHandler = useCallback(() => {
    //golesc starea ce mentine token-ul
    setToken(null);
    console.log("Successfully logged out!");
    // localStorage.removeItem("id_token");
    // localStorage.removeItem("exp_date");
    localStorageModifier({ type: "remove", payload: ["id_token", "exp_date"] });

    if (loginTimer) {
      clearTimeout(loginTimer);
    }
  }, []);

  //funtie pe o apelez pt a prelua token-ul si a retine starea de logg-in
  const loginHandler = (token, expirationDate) => {
    //preiau token-ul
    setToken(token); // --continuare de mai sus--  pt ca am setat starea inainte de declaratiile de mai jos
    // localStorage.setItem("id_token", token);
    // localStorage.setItem("exp_date", expirationDate);
    localStorageModifier({
      type: "set",
      payload: { id_token: token, exp_date: expirationDate },
    });
    //daca mut setToken(token) aici, atunci se schimba lucrurile ...se va executa functia de retrieveStorageData care va prelua aceste date din storage(deci nu
    //  va mai fi null => se va executa if-ul din useEffect... asa ca momentan il las tot cum era pus)

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
  //   }
  // }, []);

  //cand reincarc pagina vreau sa inchid vechiul timer
  useEffect(() => {
    console.log("in UseEffect");
    if (tokenData) {
      console.log("in UseEffect tokenDATA");

      loginTimer = setTimeout(logoutHandler, tokenData.remainingTime);
    }
  }, [tokenData, logoutHandler]);
  // 🢣 se va intra pe acest useEffect() de fiecare data pt ca tokenData este definit de fiecare data cand se reevalueaza componenta.

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
