import { type FC, type SubmitEvent } from "react";
import type { JobPosition } from "@/types";

type Props = {
  state: boolean;
  jobPosition: JobPosition;
};

const IsUpdatingJobPosition: FC<Props> = ({ state, jobPosition }) => {
  const handlerSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.table(data.title);
  };

  return state ? (
    <form className="bg-dark text-white text-2xl" onSubmit={handlerSubmit}>
      <input
        type="text"
        name="title"
        id="title"
        defaultValue={jobPosition.name}
        className="w-full border py-2 px-4 rounded text-sm lg:text-base"
      />
      <textarea
        rows={5}
        name="description"
        id="description"
        defaultValue={jobPosition.description}
        className="w-full border py-2 px-4 rounded text-sm lg:text-base mt-2"
      />

      <button
        type="submit"
        className="mt-4 flex justify-end bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        Enviar
      </button>
    </form>
  ) : null;
};

export default IsUpdatingJobPosition;
