import { useMemo } from "react"
import { AiOutlineDown } from "react-icons/ai"

import ProgramSubSectionAccordion from "./HealthProgramSubSectionAccordion"

export default function HealthProgramAccordionBar({
  section,
  isActive,
  handleActive,
}) {
  const active = useMemo(
    () => isActive?.includes(section._id),
    [isActive, section._id]
  )

  return (
    <div className="overflow-hidden border border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">
      {/* Header */}
      <div
        className="flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-all duration-300"
        onClick={() => handleActive(section._id)}
      >
        <div className="flex items-center gap-2">
          <span
            className={`transition-transform duration-300 ${
              active ? "rotate-180" : "rotate-0"
            }`}
          >
            <AiOutlineDown />
          </span>
          <p className="font-medium">{section?.title}</p>
        </div>

        <span className="text-yellow-25 text-sm">
          {`${section?.subSections?.length || 0} step(s)`}
        </span>
      </div>

      {/* Content */}
      <div
        className={`grid overflow-hidden bg-richblack-900 transition-[grid-template-rows] duration-[0.35s] ease-in-out ${
          active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-2 px-7 py-6 font-semibold text-textHead">
            {section?.subSections?.map((step) => (
              <ProgramSubSectionAccordion key={step._id} step={step} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
