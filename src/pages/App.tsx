import type { FC } from "react";
import styles from "@/assets/css/index.module.css";
import Hero from "@/components/Hero";

const App: FC = () => {
  return (
    <Hero>
      <p
        className={`text-3xl md:text-5xl md:max-w-2xl font-black text-green-300 px-4 ${styles.upperCase}`}
      >
        Bienvenido a Horas Adicionales. Aquí puedes registrar tus jornadas, organizar tus perfiles
        de trabajo y consultar tu información de forma rápida.
      </p>
    </Hero>
  );
};

export default App;
