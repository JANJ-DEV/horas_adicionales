import type { FC } from "react";
import styles from "@/assets/css/index.module.css";
import Hero from "@/components/Hero";
import { signInWithGoogle } from "@/services/auth.service";
import { Link } from "react-router";
import useAuth from "@/context/hooks/auth.hook";
import { Navigate } from "react-router";

const App: FC = () => {
  const { isAuthenticated, isAuthResolved } = useAuth();
  if (isAuthResolved && isAuthenticated) return <Navigate to="/records" replace={true} />;

  return (
    <div>
      <Hero>
        <p
          className={`text-2xl md:text-3xl md:max-w-4xl font-black text-yellow-300 p-4 ${styles.upperCase}`}
        >
          Bienvenido a Horas Adicionales. Aquí puedes registrar tus jornadas, organizar tus perfiles
          de trabajo y consultar tu información de forma rápida.
        </p>
      </Hero>
      {/* Informacion de crear cuenta */}
      <div>
        <section className="flex flex-col gap-4 bg-slate-800/50 p-4 rounded">
          <h2 className="text-2xl font-bold text-info">¿Cómo crear una cuenta?</h2>
          <p className="text-lg text-gray-300">
            Para crear una cuenta en Horas Adicionales, simplemente haz clic{" "}
            <Link
              to="#"
              className="underline text-green-300"
              onClick={(e) => {
                e.stopPropagation();
                signInWithGoogle();
              }}
            >
              Crear Cuenta
            </Link>{" "}
            y completa el formulario de registro con tu información personal. Asegúrate de
            proporcionar un correo electrónico válido y una contraseña segura para proteger tu
            cuenta.
          </p>
          <p className="text-lg text-gray-300">
            Una vez que hayas creado tu cuenta, podrás iniciar sesión y comenzar a registrar tus
            jornadas laborales adicionales. Además, tendrás acceso a todas las funcionalidades de la
            aplicación para organizar tus perfiles de trabajo y consultar tu información de forma
            rápida y sencilla.
          </p>
        </section>
      </div>
      {/* Antes de registrar jornada , hay que crear un perfil de trabajo, elegir la rama, puesto etc.. */}
      <div>
        <section className="flex flex-col gap-4 bg-slate-800/50 p-4 rounded">
          <h2 className="text-2xl font-bold text-info">¿Cómo crear un perfil de trabajo?</h2>
          <p className="text-lg text-gray-300">
            Para crear un perfil de trabajo en Horas Adicionales, simplemente haz clic en el botón
            "Crear Perfil" y completa el formulario con los detalles de tu perfil laboral. Puedes
            agregar información como el nombre del perfil, la rama o área de trabajo, el puesto que
            desempeñas y cualquier comentario adicional que desees incluir.
          </p>
          <p className="text-lg text-gray-300">
            Una vez que hayas creado tu perfil de trabajo, podrás asociar tus registros de jornadas
            adicionales a ese perfil. Esto te permitirá organizar tus registros según tus diferentes
            roles o proyectos, y consultar tu información de forma rápida y sencilla desde tu
            perfil.
          </p>
        </section>
      </div>
      {/* Informacion de registro de horas adicionales*/}
      <div>
        <section className="flex flex-col gap-4 bg-slate-800/50 p-4 rounded">
          <h2 className="text-2xl font-bold text-info">¿Cómo registrar horas adicionales?</h2>
          <p className="text-lg text-gray-300">
            Para registrar horas adicionales en Horas Adicionales, simplemente haz clic en el botón
            "Registrar Jornada" y completa el formulario con los detalles de tu jornada laboral
            adicional. Puedes agregar información como la fecha, la cantidad de horas trabajadas, el
            perfil de trabajo asociado y cualquier comentario adicional que desees incluir.
          </p>
          <p className="text-lg text-gray-300">
            Una vez que hayas registrado tus horas adicionales, podrás consultar tu información de
            forma rápida y sencilla desde tu perfil de trabajo. Además, podrás organizar tus
            registros según tus diferentes roles o proyectos para tener un mejor control de tus
            horas adicionales.
          </p>
        </section>
      </div>
    </div>
  );
};

export default App;
