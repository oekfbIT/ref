// styling
import styles from "./styles.module.scss";

// components
import { Helmet } from "react-helmet";
import Spring from "@components/Spring";
import Logo from "@components/Logo";

// hooks
import { useThemeProvider } from "@contexts/themeContext";

const AuthLayout = ({ title, children }) => {
  const { theme, fontScale, direction } = useThemeProvider();

  console.log("Theme settings:", { theme, fontScale, direction });

  return (
    <>
      <Helmet>
        <title>{title} | Österreichischer Kleinfeld Fußball Bund</title>
      </Helmet>
      <div className={styles.container}>
        <Spring className={`${styles.form} card card-padded`} type="slideUp">
          {children}
        </Spring>
        <div
          className={`${styles.cover} ${
            theme === "light" ? styles.light : styles.dark
          }`}
        >
          <div className={styles.cover_logo}>
            <Logo size="xl" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
