import Modal from "../UI_General/Modal";
import classes from "./ErrorModal.module.css";

const ErrorModal = (props) => {
  // mentiuni **
  // ⇨ transmit mai departe eroarea pt a intarzia doar componenta ModalOverlay si nu intregul Modal.
  return (
    <Modal onClick={props.onClearError} error={props.error}>
      <h3 className={classes["error-title"]}>Something unexpected happened</h3>
      <p className={classes["error-text"]}>{props.error.message}</p>
      <button onClick={props.onClearError} className={classes["error-button"]}>
        Close
      </button>
    </Modal>
  );
};

export default ErrorModal;
