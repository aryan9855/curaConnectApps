import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  deleteProgramSection,
  deleteProgramSubSection,
} from "../../../../../services/operations/healthProgramAPI"

import { setHealthProgram } from "../../../../../slices/healthProgramSlice"
import ConfirmationModal from "../../../HomePage/common/ConfirmationModel"
import SubSectionModal from "./SubSectionModal"

export default function NestedView({ handleChangeEditSectionName }) {
  const { program } = useSelector((state) => state.healthProgram)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  // Modal states
  const [addSubSection, setAddSubSection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  // Delete section
  const handleDeleteSection = async (sectionId) => {
    const result = await deleteProgramSection({
      sectionId,
      programId: program._id,
      token,
    })

    if (result) {
      dispatch(setHealthProgram(result))
    }

    setConfirmationModal(null)
  }

  // Delete sub-section
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteProgramSubSection({
      subSectionId,
      sectionId,
      token,
    })

    if (result) {
      const updatedSections = program.programContent.map((section) =>
        section._id === sectionId ? result : section
      )

      dispatch(
        setHealthProgram({
          ...program,
          programContent: updatedSections,
        })
      )
    }

    setConfirmationModal(null)
  }

  return (
    <>
      <div className="rounded-lg bg-richblack-700 p-6 px-8">
        {program?.programContent?.map((section) => (
          <details key={section._id} open>
            {/* Section Header */}
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-richblack-600 py-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-richblack-50" />
                <p className="font-semibold text-richblack-50">
                  {section.title}
                </p>
              </div>

              <div className="flex items-center gap-x-3">
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.title
                    )
                  }
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>

                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this section?",
                      text2:
                        "All steps inside this section will be permanently removed.",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () =>
                        handleDeleteSection(section._id),
                      btn2Handler: () =>
                        setConfirmationModal(null),
                    })
                  }
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>

                <span className="text-richblack-300">|</span>
                <AiFillCaretDown className="text-xl text-richblack-300" />
              </div>
            </summary>

            {/* Sub-sections */}
            <div className="px-6 pb-4">
              {section.subSections.map((step) => (
                <div
                  key={step._id}
                  onClick={() => setViewSubSection(step)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                      {step.title}
                    </p>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3"
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({
                          ...step,
                          sectionId: section._id,
                        })
                      }
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>

                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this step?",
                          text2:
                            "This care step will be permanently removed.",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(
                              step._id,
                              section._id
                            ),
                          btn2Handler: () =>
                            setConfirmationModal(null),
                        })
                      }
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Step */}
              <button
                onClick={() => setAddSubSection(section._id)}
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
              >
                <FaPlus className="text-lg" />
                <p>Add Care Step</p>
              </button>
            </div>
          </details>
        ))}
      </div>

      {/* Sub-section Modals */}
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit
        />
      ) : null}

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  )
}
