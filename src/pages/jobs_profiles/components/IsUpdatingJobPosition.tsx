import { useState, type FC, type SubmitEvent } from "react";
import type { JobProfile } from "@/types";
import {
  getJobPositionFromBranchId,
  updateJobPositionById,
} from "@/services/jobsPositions.service";
import SelectJobPositionFromBranchId from "./SelectJobPosition";

type Props = {
  state: boolean;
  jobProfile: JobProfile;
};

const IsUpdatingJobPosition: FC<Props> = ({ state, jobProfile }) => {
  const [jobPositionDescription, setJobPositionDescription] = useState<string>(
    jobProfile.jobPosition.description
  );

  const handlerSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.table(jobProfile);
    updateJobPositionById(jobProfile.id as string, {
      name: data.title as string,
      description: jobPositionDescription,
    });
    getJobPositionFromBranchId(jobProfile.jobPosition.id, jobProfile.branch.id as string)
      .then((jobPosition) => {
        console.log(jobPosition);
        if (jobPosition) {
          setJobPositionDescription(jobPosition.description);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el puesto de trabajo:", error);
      });
  };

  return state ? (
    <form className="bg-dark text-white text-2xl" onSubmit={handlerSubmit}>
      <SelectJobPositionFromBranchId
        name="title"
        variant="name"
        branchId={jobProfile.branch.id as string}
      />
      {jobPositionDescription && jobPositionDescription}
      {/* {jobPositionDescription && <textarea
        rows={5}
        name="description"
        id="description"
        defaultValue={jobPositionDescription}
        className="w-full border py-2 px-4 rounded text-sm lg:text-base mt-2"
      />}  */}

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
