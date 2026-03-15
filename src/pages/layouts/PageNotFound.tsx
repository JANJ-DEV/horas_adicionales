const PageNotFound = () => {
  return (
    <section className="app-surface flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 overflow-hidden px-6 text-center">
      <p className="section-kicker">Ruta no encontrada</p>
      <span className="font-[var(--font-display)] text-4xl font-bold text-[var(--danger)] md:text-7xl">
        404 Not Found
      </span>
      <p className="max-w-lg text-sm leading-6 text-[var(--text-muted)]">
        La pagina que buscas no existe o ya no esta disponible en esta version de la aplicacion.
      </p>
    </section>
  );
};

export default PageNotFound;
