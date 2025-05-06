import styles from "./css/Settings.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <section className={styles.setting_cont}>
      <h1 className={styles.welcome_text}>Hello {user?.username}!</h1>
      <button
        onClick={async () => {
          await logout();
          navigate("/sign-in");
        }}
        className={styles.logout_button}
      >
        Log out
      </button>
    </section>
  );
};

export default Settings;
