import React from "react"
import { HiOutlineVideoCamera } from "react-icons/hi"

function HealthProgramSubSectionAccordion({ step }) {
  return (
    <div>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 text-richblack-50">
          <span className="text-richblack-200">
            <HiOutlineVideoCamera />
          </span>
          <p>{step?.title}</p>
        </div>
      </div>
    </div>
  )
}

export default HealthProgramSubSectionAccordion
