import type { FC } from "react"

const App: FC = () => {
  return (
    <section className={` flex flex-col items-center justify-center gap-4 text-center`}>
       <h1 className="text-4xl md:text-7xl font-bold p-4">Inicio</h1>
      <p className="max-w-2xl text-2xl  md:text-3xl p-4">
        Bienvenido a Horas Adicionales. Aquí puedes registrar tus jornadas,
        organizar tus perfiles de trabajo y consultar tu información de formaº
        rápida.
       </p>
    </section>
  )
}

export default App
