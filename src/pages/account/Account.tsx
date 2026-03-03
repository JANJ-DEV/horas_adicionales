import useAuth from "@/context/hooks/auth.hook";
import type { User } from "firebase/auth";
import type { FC } from "react";

const Account: FC = () => {
  const { currentUser } = useAuth();
  const user = currentUser as User;
  return (
    <section id={user.uid} className="flex items-center flex-col gap-2 mt-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <img src={user.photoURL as string} alt={user.displayName as string} width={128} height={128} className={`touch w-56 h-56 rounded-full border-8 ${user.emailVerified ? "border-green-500" : "border-red-500"}`} />
        <h1 className="text-4xl font-black text-orange-300">{user.displayName}</h1>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-bold text-blue-300">{user.email}</p>
        <p className="text-lg font-bold">{user.phoneNumber}</p>
        <div className="flex">
          <div className="flex flex-col gap-2">
            <strong className="font-bold text-yellow-300">Creado</strong>
            <p className="text-xs font-bold">{user.metadata.creationTime}</p>
          </div>
          <div className="flex flex-col gap-2"> 
            <strong className="font-bold text-violet-300">Última sesión</strong>
            <p className="text-xs font-bold">{user.metadata.lastSignInTime}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
