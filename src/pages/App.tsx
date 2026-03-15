import type { FC } from "react";
import Hero from "@/components/Hero";
import { signInWithGoogle } from "@/services/auth.service";
import { Link } from "react-router";
import useAuth from "@/context/hooks/auth.hook";
import { Navigate } from "react-router";

const App: FC = () => {
  const { isAuthenticated, isAuthResolved } = useAuth();
  if (isAuthResolved && isAuthenticated) return <Navigate to="/records" replace={true} />;

  const guides = [
    {
      title: "Acceso rapido con Google",
      description:
        "Inicia sesion en segundos y empieza a usar tu espacio personal sin formularios largos.",
    },
    {
      title: "Perfiles por puesto o sucursal",
      description:
        "Configura distintos contextos de trabajo para separar tarifas, ramas y puestos con claridad.",
    },
    {
      title: "Resumen de horas y calculos",
      description:
        "Consulta horas trabajadas y una estimacion economica por periodo desde una interfaz simple.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Crea tu cuenta",
      text: "Pulsa en iniciar sesion con Google para acceder a tu espacio de trabajo.",
      action: true,
    },
    {
      step: "02",
      title: "Configura tu perfil laboral",
      text: "Define sucursal, puesto y tarifa estimada antes de registrar una jornada.",
    },
    {
      step: "03",
      title: "Registra y consulta",
      text: "Guarda cada jornada y revisa horas y estimaciones desde movil, tablet o escritorio.",
    },
  ];

  return (
    <div className="flex flex-col gap-4 pb-4 sm:gap-5 lg:gap-7">
      <Hero>
        <span className="section-kicker">Gestion moderna de jornada</span>
        <h2 className="max-w-4xl font-[var(--font-display)] text-4xl font-bold leading-[1.05] text-[var(--text)] sm:text-5xl lg:text-6xl">
          Registra tus horas extra con una experiencia limpia, flexible y pensada para hoy.
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
          Horas Adicionales te permite organizar perfiles de trabajo, registrar jornadas y consultar
          resumenes con una interfaz clara en cualquier pantalla.
        </p>
        <div className="grid w-full gap-3 pt-2 sm:grid-cols-3">
          {guides.map((item) => (
            <article key={item.title} className="app-card px-4 py-4 text-left">
              <h3 className="font-[var(--font-display)] text-base font-bold text-[var(--text)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{item.description}</p>
            </article>
          ))}
        </div>
      </Hero>
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6">
        <article className="app-surface p-5 sm:p-6">
          <p className="section-kicker">Primeros pasos</p>
          <h2 className="mt-4 font-[var(--font-display)] text-2xl font-bold text-[var(--text)] sm:text-3xl">
            Empieza en menos de un minuto
          </h2>
          <div className="mt-4 grid gap-4 lg:mt-5">
            {steps.map((item) => (
              <section key={item.step} className="app-card flex gap-4 px-4 py-4 sm:px-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-soft)] font-[var(--font-display)] text-sm font-bold text-[var(--accent)]">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-[var(--font-display)] text-lg font-bold text-[var(--text)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{item.text}</p>
                  {item.action && (
                    <Link
                      to="#"
                      className="mt-3 inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-bold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        signInWithGoogle();
                      }}
                    >
                      Iniciar sesion con Google
                    </Link>
                  )}
                </div>
              </section>
            ))}
          </div>
        </article>

        <aside className="app-surface p-5 sm:p-6">
          <p className="section-kicker">Beneficios</p>
          <h2 className="mt-4 font-[var(--font-display)] text-2xl font-bold text-[var(--text)]">
            Diseno pensado para el uso diario
          </h2>
          <div className="mt-4 grid gap-4 lg:mt-5">
            <article className="app-card px-4 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                Mobile first
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                La experiencia prioriza pantallas pequenas, pero mantiene una lectura amplia y
                ordenada en escritorio.
              </p>
            </article>
            <article className="app-card px-4 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Claro y oscuro
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Alterna el tema segun tu entorno y conserva una jerarquia visual consistente en toda
                la app.
              </p>
            </article>
            <article className="app-card px-4 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-warm)]">
                Menos ruido, mas foco
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Los fondos, contrastes y tarjetas estan rediseñados para trabajar mejor con datos
                operativos.
              </p>
            </article>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default App;
