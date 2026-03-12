import useAuth from "@/context/hooks/auth.hook";
import { useEffect, useState, type FC } from "react";
import { useFetcher } from "react-router";

const UpdateAccount: FC = () => {
  const { currentUser } = useAuth();
  const formAction = useFetcher();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  if (!currentUser) {
    return <p>No hay un usuario autenticado</p>;
  }

  return (
    <section className="flex flex-col gap-4 mt-8">
      <h1 className="text-4xl font-black text-dark">Actualizar cuenta</h1>
      <formAction.Form method="put" className="flex flex-col gap-4">
        <label htmlFor="displayName" className="flex flex-col gap-2">
          <small className="font-bold text-orange-300">Nombre de usuario</small>
          <input
            type="text"
            id="displayName"
            name="displayName"
            placeholder="Nombre de usuario"
            defaultValue={currentUser.displayName as string}
          />
        </label>
        <label htmlFor="uploadPhoto" className="flex gap-4 items-center">
          <img
            id="preview"
            src={
              previewUrl
                ? previewUrl
                : (formAction.data?.photoURL as string)
                  ? formAction.data?.photoURL
                  : (currentUser.photoURL as string)
            }
            alt="Vista previa de la foto de perfil"
            width={128}
            height={128}
            className="w-16 h-16 rounded-full border-2 border-orange-32"
          />
          <small className="font-bold text-orange-300">Seleciona una foto de perfil</small>
          <input
            type="file"
            id="uploadPhoto"
            accept="image/*"
            name="uploadPhoto"
            title="Seleccionar foto de perfil"
            onChange={handlePhotoChange}
            className="font-bold text-orange-300 hidden"
          />
        </label>
        <button type="submit" className="py-2 px-4 border rounded-sm">
          Actualizar
        </button>
      </formAction.Form>
    </section>
  );
};

export default UpdateAccount;
