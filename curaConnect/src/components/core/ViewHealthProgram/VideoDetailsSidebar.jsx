import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import IconBtn from "../HomePage/common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const navigate = useNavigate()
  const { sectionId, stepId } = useParams()

  const {
    programSectionData,
    programEntireData,
    totalNoOfSteps,
    completedSteps,
  } = useSelector((state) => state.viewHealthProgram)

  const activeSectionId = sectionId || ""
  const activeStepId = stepId || ""

  const navigateToSection = (section) => {
    const firstStepId = section?.subSections?.[0]?._id
    if (!firstStepId) return

    navigate(
      `/view-program/${programEntireData?._id}/section/${section._id}/step/${firstStepId}`
    )
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r border-richblack-700 bg-richblack-800">
      {/* Header */}
      <div className="mx-5 flex flex-col gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
        <div className="flex w-full items-center justify-between">
          <div
            onClick={() => navigate("/dashboard/my-programs")}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
            title="Back"
          >
            <IoIosArrowBack size={30} />
          </div>

          <IconBtn
            text="Add Review"
            customClasses="ml-auto"
            onclick={() => setReviewModal(true)}
          />
        </div>

        <div className="flex flex-col">
          <p>{programEntireData?.title}</p>
          <p className="text-sm font-semibold text-richblack-500">
            {completedSteps?.length} / {totalNoOfSteps} Steps Completed
          </p>
        </div>
      </div>

      {/* Sections & Steps */}
      <div className="h-[calc(100vh-5rem)] overflow-y-auto">
        {programSectionData.map((section) => (
          <div
            key={section._id}
            className="mt-2 cursor-pointer text-sm text-richblack-5"
            onClick={() => navigateToSection(section)}
          >
            {/* Section */}
            <div className="flex justify-between bg-richblack-600 px-5 py-4">
              <div className="w-[70%] font-semibold">{section.title}</div>

              <span
                className={`transition-all duration-500 ${
                  activeSectionId === section._id
                    ? "rotate-0"
                    : "rotate-180"
                }`}
              >
                <BsChevronDown />
              </span>
            </div>

            {/* Steps */}
            {activeSectionId === section._id && (
              <div className="transition-all duration-500">
                {section.subSections.map((step) => (
                  <div
                    key={step._id}
                    className={`flex gap-3 px-5 py-2 ${
                      activeStepId === step._id
                        ? "bg-yellow-200 font-semibold text-richblack-800"
                        : "hover:bg-richblack-900"
                    }`}
                    onClick={() => {
                      navigate(
                        `/view-program/${programEntireData?._id}/section/${section._id}/step/${step._id}`
                      )
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={completedSteps.includes(step._id)}
                      onChange={() => {}}
                    />
                    {step.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
