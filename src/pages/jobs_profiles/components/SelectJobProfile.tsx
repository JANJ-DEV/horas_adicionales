import type { Branch, JobPosition } from "@/types";
import type { FC } from "react";

type SelectJobProfileProps = {
    branches?: Branch[];
    jobsPositions?: JobPosition[];
    onChangeSelectJobProfile: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}   
// import { useFilterBranches } from "@/hooks/useFilterBranches"; --- IGNORE ---
// Este componente tiene que devolver un select con las ramas o puestos de trabajo dependiendo de lo que se le pase por props

const SelectJobProfile: FC<SelectJobProfileProps> = ({ branches, jobsPositions, onChangeSelectJobProfile }) => {
    
    if(branches) {
        return (
            <select name="branch" id="branch" aria-label="Select branch" onChange={onChangeSelectJobProfile}>
                {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                        {branch.name}
                    </option>
                ))}
            </select>
        );
    }

    return (
        <select name="jobPosition" id="jobPosition" aria-label="Select job position" onChange={onChangeSelectJobProfile}>
            {jobsPositions?.map(jobPosition => (
                <option key={jobPosition.id} value={jobPosition.id}>
                    {jobPosition.name}
                </option>
            ))}
        </select>
    )
}

export default SelectJobProfile;

