import { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "./css/Login.module.css";
import logo from "../assets/NAME.png";
const Login = () => {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User changed:", user);
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <section className={styles.login_cont}>
      <p className={styles.welcome_text}>Welcome back!</p>
      <p className={styles.subtitle}>We're so excited to see you again!</p>
      {errors.length > 0 && (
        <ul className={styles.errors}>
          {errors.map((error, index) => (
            <li key={index}>* {error}</li>
          ))}
        </ul>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setErrors([]);
          console.log("Attempting login...");
          const errorMessage = await login(email, password);
          console.log("Login finished:", errorMessage);

          if (errorMessage) {
            setErrors([errorMessage]);
          } else {
            navigate("/");
          }
        }}
        className={styles.login_form}
      >
        <label htmlFor="email">
          email address <span className={styles.required}>*</span>
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          name="email"
          className={styles.input}
        />
        <label htmlFor="password">
          password <span className={styles.required}>*</span>
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          name="password"
          className={styles.input}
        />
        <button className={styles.button}>login</button>
        <p className={styles.redirect}>
          Need an account?{" "}
          <Link className={styles.redirect_text} to="/register">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
