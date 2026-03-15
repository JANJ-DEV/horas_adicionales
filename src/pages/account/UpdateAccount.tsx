import useAuth from "@/context/hooks/auth.hook";
import { useEffect, useState, type FC } from "react";
import { useFetcher } from "react-router";
import Btn from "@/components/Btn";

const UpdateAccount: FC = () => {
  const { currentUser } = useAuth();
  const formAction = useFetcher();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const isSubmitting = formAction.state === "submitting";
  const formFeedback = (formAction.data ?? {}) as {
    message?: string;
    error?: string;
  };

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
      setSelectedFileName("");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFileName(file.name);
  };

  if (!currentUser) {
    return (
      <section className="mx-auto mt-6 w-full max-w-xl rounded-2xl border border-red-400/35 bg-red-500/10 p-4 text-red-100">
        No hay un usuario autenticado
      </section>
    );
  }

  return (
    <section className="mx-auto flex h-full w-full max-w-2xl flex-1 flex-col pb-4 sm:pb-6">
      <article className="flex min-h-full flex-1 flex-col rounded-2xl border border-cyan-400/25 bg-slate-900/55 p-4 shadow-[0_18px_42px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6">
        <header className="mb-5 border-b border-cyan-400/20 pb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
            Perfil de usuario
          </p>
          <h1 className="mt-1 text-2xl font-black text-cyan-50 sm:text-3xl">Actualizar cuenta</h1>
          <p className="mt-1 text-sm text-slate-300">
            Edita tu nombre y tu foto para personalizar tu experiencia.
          </p>
        </header>

        <formAction.Form method="put" className="flex flex-1 flex-col gap-5">
          <label htmlFor="displayName" className="flex flex-col gap-2">
            <small className="text-xs font-bold uppercase tracking-wide text-orange-300">
              Nombre de usuario
            </small>
            <input
              type="text"
              id="displayName"
              name="displayName"
              placeholder="Nombre de usuario"
              defaultValue={currentUser.displayName as string}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-600 bg-slate-800/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40"
            />
          </label>

          <section className="rounded-xl border border-slate-700 bg-black/25 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-orange-300">
              Foto de perfil
            </p>
            <label htmlFor="uploadPhoto" className="flex items-center gap-3 sm:gap-4">
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
                width={96}
                height={96}
                className="h-20 w-20 rounded-full border-2 border-cyan-400/45 object-cover sm:h-24 sm:w-24"
              />

              <span className="flex flex-1 flex-col gap-1">
                <strong className="text-sm text-slate-100">Selecciona una imagen</strong>
                <small className="text-xs text-slate-300">
                  {selectedFileName || "PNG o JPG. Se mostrará una vista previa antes de guardar."}
                </small>
                <span className="inline-flex w-fit rounded-md border border-cyan-400/45 bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-100">
                  Cambiar foto
                </span>
              </span>

              <input
                type="file"
                id="uploadPhoto"
                accept="image/*"
                name="uploadPhoto"
                title="Seleccionar foto de perfil"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
          </section>

          <Btn
            type="submit"
            label={isSubmitting ? "Guardando..." : "Actualizar cuenta"}
            variant={isSubmitting ? "loading" : "success"}
            formState={isSubmitting}
          />

          {formFeedback.error && (
            <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {formFeedback.error}
            </p>
          )}

          {formFeedback.message && !formFeedback.error && (
            <p className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
              {formFeedback.message}
            </p>
          )}
        </formAction.Form>
      </article>
    </section>
  );
};

export default UpdateAccount;
