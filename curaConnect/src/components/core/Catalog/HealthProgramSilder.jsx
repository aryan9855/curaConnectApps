import React from "react"

import HealthProgramCard from "./HealthProgram_Card"

const HealthProgramSlider = ({ programs }) => {
  return (
    <>
      {programs?.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <HealthProgramCard
              key={program._id}
              program={program}
              height="h-[250px]"
            />
          ))}
        </div>
      ) : (
        <p className="text-xl text-richblack-5">
          No Health Programs Available
        </p>
      )}
    </>
  )
}

export default HealthProgramSlider
