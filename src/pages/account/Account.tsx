import useAuth from "@/context/hooks/auth.hook";
import type { User } from "firebase/auth";
import type { FC } from "react";

const Account: FC = () => {
  const { currentUser } = useAuth();
  const user = currentUser as User;
  return (
    <section
      id={user.uid}
      className="app-surface mx-auto mt-2 flex w-full max-w-3xl flex-col items-center gap-6 p-5 text-center sm:p-8"
    >
      <div className="flex flex-col items-center gap-4">
        <p className="section-kicker">Mi cuenta</p>
        <img
          src={user.photoURL as string}
          alt={user.displayName as string}
          width={128}
          height={128}
          className={`touch h-40 w-40 rounded-full border-8 object-cover sm:h-56 sm:w-56 ${user.emailVerified ? "border-[var(--success)]" : "border-[var(--danger)]"}`}
        />
        <h1 className="font-[var(--font-display)] text-3xl font-black text-[var(--text)] sm:text-4xl">
          {user.displayName}
        </h1>
      </div>
      <div className="grid w-full gap-4 sm:grid-cols-2">
        <article className="app-card p-4">
          <strong className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            Email
          </strong>
          <p className="mt-2 break-all text-base font-semibold text-[var(--text)]">{user.email}</p>
        </article>
        <article className="app-card p-4">
          <strong className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-warm)]">
            Telefono
          </strong>
          <p className="mt-2 text-base font-semibold text-[var(--text)]">
            {user.phoneNumber || "No disponible"}
          </p>
        </article>
        <article className="app-card p-4 text-left">
          <strong className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            Creado
          </strong>
          <p className="mt-2 text-sm font-semibold text-[var(--text-muted)]">
            {user.metadata.creationTime}
          </p>
        </article>
        <article className="app-card p-4 text-left">
          <strong className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
            Ultima sesion
          </strong>
          <p className="mt-2 text-sm font-semibold text-[var(--text-muted)]">
            {user.metadata.lastSignInTime}
          </p>
        </article>
      </div>
    </section>
  );
};

export default Account;
