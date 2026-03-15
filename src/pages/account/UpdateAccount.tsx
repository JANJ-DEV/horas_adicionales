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
  type FormFeedback = {
    message?: string;
    error?: string;
  };
  const rawData = formAction.data;
  const formFeedback: FormFeedback = {};

  if (rawData && typeof rawData === "object") {
    const maybeData = rawData as Record<string, unknown>;

    if (typeof maybeData.message === "string") {
      formFeedback.message = maybeData.message;
    }

    if (typeof maybeData.error === "string") {
      formFeedback.error = maybeData.error;
    }
  }

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
      <article className="app-surface flex min-h-full flex-1 flex-col p-4 sm:p-6">
        <header className="mb-5 border-b border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Perfil de usuario
          </p>
          <h1 className="mt-1 font-[var(--font-display)] text-2xl font-black text-[var(--text)] sm:text-3xl">
            Actualizar cuenta
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Edita tu nombre y tu foto para personalizar tu experiencia.
          </p>
        </header>

        <formAction.Form method="put" className="flex flex-1 flex-col gap-5">
          <label htmlFor="displayName" className="flex flex-col gap-2">
            <small className="text-xs font-bold uppercase tracking-wide text-[var(--accent-warm)]">
              Nombre de usuario
            </small>
            <input
              type="text"
              id="displayName"
              name="displayName"
              placeholder="Nombre de usuario"
              defaultValue={currentUser.displayName as string}
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-[var(--text)] outline-none transition duration-300 focus:border-[var(--border-strong)] focus:ring-2 focus:ring-[color:var(--accent)]/15"
            />
          </label>

          <section className="app-card p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--accent-warm)]">
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
                className="h-20 w-20 rounded-full border-2 border-[var(--border-strong)] object-cover sm:h-24 sm:w-24"
              />

              <span className="flex flex-1 flex-col gap-1">
                <strong className="text-sm text-[var(--text)]">Selecciona una imagen</strong>
                <small className="text-xs text-[var(--text-muted)]">
                  {selectedFileName || "PNG o JPG. Se mostrará una vista previa antes de guardar."}
                </small>
                <span className="inline-flex w-fit rounded-full border border-[var(--border-strong)] bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
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
            <p className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm font-semibold text-[var(--danger)]">
              {formFeedback.error}
            </p>
          )}

          {formFeedback.message && !formFeedback.error && (
            <p className="rounded-2xl border border-[var(--success)]/30 bg-[var(--success)]/10 px-4 py-3 text-sm font-semibold text-[var(--success)]">
              {formFeedback.message}
            </p>
          )}
        </formAction.Form>
      </article>
    </section>
  );
};

export default UpdateAccount;
