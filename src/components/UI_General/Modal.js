import ReactDOM from "react-dom";
import classes from "./Modal.module.css";
import { Transition } from "react-transition-group";

//creez fundalul ce poate fi clickable
const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClick}></div>;
};

//creez corpul modalului
const ModalOverlay = (props) => {
  //in functie de ce parametru al starii am, imi adauga clasele acestea.
  const overlayClasses = [
    classes.modal,
    props.show === "entering"
      ? classes["modal-open"]
      : props.show === "exiting"
      ? classes["modal-close"]
      : null,
  ];
  return (
    //   ar mai fi fost o varianta sa infasor tot ce am aici cu Transition ...
    <div className={overlayClasses.join(" ")}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

//creez modalul complet ce va muta elementele in locul selectat
const Modal = (props) => {
  const loginModal = document.getElementById("overlays");
  return (
    <>
      {ReactDOM.createPortal(
        props.error.hasError && <Backdrop onClick={props.onClick} />,
        loginModal
      )}
      {ReactDOM.createPortal(
        <Transition
          in={props.error.hasError} // 🢢 valoare booleana pt a aplica sau nu aceste proprietati
          timeout={300} // 🢢 temporizator (ex: duratia de la entering -> entered, exiting -> exited)
          mountOnEnter // 🢢 monteaza componenta
          unmountOnExit // 🢢 demonteaza componenta
        >
          {(
            state // 🢢 variabila de stare ce are 4 proprietati: entering, entered, exiting, exited
          ) => <ModalOverlay show={state}>{props.children}</ModalOverlay>}
        </Transition>,
        loginModal
      )}
    </>
  );
};

export default Modal;
