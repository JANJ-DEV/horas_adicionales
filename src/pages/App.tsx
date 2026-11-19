import type { FC } from "react";
import { Navigate } from "react-router";
import {
  MdArrowOutward,
  MdArrowForward,
  MdBarChart,
  MdCalendarMonth,
  MdCheck,
  MdOutlineAccessTime,
  MdOutlineWorkOutline,
  MdTrendingUp,
} from "react-icons/md";
import useAuth from "@/context/hooks/auth.hook";
import { signInWithGoogle } from "@/services/auth.service";
import "./landing.css";

const features = [
  {
    icon: MdOutlineAccessTime,
    number: "01",
    title: "Cada jornada, en orden",
    text: "Registra entradas y salidas y consulta el detalle de tus horas cuando lo necesites.",
  },
  {
    icon: MdOutlineWorkOutline,
    number: "02",
    title: "Un perfil para cada trabajo",
    text: "Separa tus registros por empresa o puesto y configura el ciclo de facturación de cada perfil.",
  },
  {
    icon: MdBarChart,
    number: "03",
    title: "Tus datos, con perspectiva",
    text: "Consulta estadísticas por periodos y visualiza tus horas y sueldo estimado en gráficos.",
  },
];

const App: FC = () => {
  const { isAuthenticated, isAuthResolved } = useAuth();
  if (isAuthResolved && isAuthenticated) return <Navigate to="/records" replace />;

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow">
            <span /> TU TIEMPO, BAJO CONTROL
          </div>
          <h1>
            Cada hora cuenta<span>.</span>
          </h1>
          <p className="landing-lead">
            El trabajo cambia. La claridad sobre tus horas no debería hacerlo.
          </p>
          <p className="landing-description">
            Organiza tus jornadas, perfiles y ciclos de facturación en un solo lugar. Consulta tus
            horas y su estimación económica cuando lo necesites.
          </p>
          <div className="landing-actions">
            <button type="button" className="landing-primary" onClick={() => signInWithGoogle()}>
              Empezar con Google <MdArrowOutward aria-hidden="true" />
            </button>
            <a className="landing-secondary" href="#funcionalidades">
              Descubrir la herramienta <MdArrowForward aria-hidden="true" />
            </a>
          </div>
          <div className="landing-assurance">
            <MdCheck aria-hidden="true" /> Accede con tu cuenta de Google <span /> Diseñado para
            cualquier pantalla
          </div>
        </div>
        <div className="landing-preview" aria-label="Ejemplo ilustrativo de la aplicación">
          <div className="preview-window">
            <div className="preview-top">
              <div className="preview-dots">
                <i />
                <i />
                <i />
              </div>
              <span>VISTA GENERAL</span>
              <span className="preview-demo">EJEMPLO</span>
            </div>
            <div className="preview-body">
              <div className="preview-heading">
                <div>
                  <small>TU ESPACIO DE TRABAJO</small>
                  <h2>Tu tiempo, de un vistazo.</h2>
                </div>
                <div className="preview-icon">
                  <MdTrendingUp />
                </div>
              </div>
              <div className="preview-stats">
                <div>
                  <span>HORAS REGISTRADAS</span>
                  <strong>
                    38<span> h</span>
                  </strong>
                  <small>Este mes</small>
                </div>
                <div>
                  <span>SUELDO ESTIMADO</span>
                  <strong>
                    570<span> €</span>
                  </strong>
                  <small>Según tu perfil</small>
                </div>
              </div>
              <div className="preview-chart">
                <div className="preview-chart-head">
                  <div>
                    <strong>Actividad</strong>
                    <span>Horas por semana</span>
                  </div>
                  <span>ESTE MES</span>
                </div>
                <div className="preview-bars">
                  <i style={{ height: "42%" }} />
                  <i style={{ height: "65%" }} />
                  <i style={{ height: "53%" }} />
                  <i style={{ height: "82%" }} />
                  <i style={{ height: "68%" }} />
                  <i style={{ height: "100%" }} />
                  <i style={{ height: "77%" }} />
                </div>
                <div className="preview-chart-labels">
                  <span>SEM 01</span>
                  <span>SEM 02</span>
                  <span>SEM 03</span>
                  <span>SEM 04</span>
                </div>
              </div>
              <div className="preview-bottom">
                <span>
                  <MdCalendarMonth /> REGISTROS ORGANIZADOS POR PERIODO
                </span>
                <MdArrowOutward />
              </div>
            </div>
          </div>
          <p className="preview-note">Datos de ejemplo con fines ilustrativos.</p>
        </div>
      </section>
      <section id="funcionalidades" className="landing-features">
        <div className="landing-section-heading">
          <div>
            <p className="landing-label">HECHO PARA TU DÍA A DÍA</p>
            <h2>
              Más claridad.
              <br />
              <span>Mejores decisiones.</span>
            </h2>
          </div>
          <p>
            Una forma sencilla de pasar del registro diario a una visión completa de tu actividad
            laboral.
          </p>
        </div>
        <div className="landing-feature-grid">
          {features.map(({ icon: Icon, number, title, text }) => (
            <article className="landing-feature" key={number}>
              <div className="landing-feature-top">
                <Icon aria-hidden="true" />
                <span>{number} / 03</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="landing-bottom">
        <div>
          <p className="landing-label">EMPIEZA HOY</p>
          <h2>
            Tu trabajo merece
            <br />
            una visión más clara.
          </h2>
          <p>Configura tu perfil y empieza a registrar tus jornadas.</p>
        </div>
        <button type="button" className="landing-primary" onClick={() => signInWithGoogle()}>
          Acceder con Google <MdArrowOutward aria-hidden="true" />
        </button>
      </section>
    </div>
  );
};

export default App;
