import classes from "./StartingPage.module.css";

const StartingPage = () => {
  return (
    <section className={classes.homepage}>
      <h1 className={classes.title}>Welcome to the Home Page!</h1>
      <p className={classes.description}>
        This is a new challenge. Implementing an authentication page with React
        and Firebase.
      </p>
    </section>
  );
};

export default StartingPage;
