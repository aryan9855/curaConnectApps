import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  createProgramSubSection,
  updateProgramSubSection,
} from "../../../../../services/operations/healthProgramAPI"

import { setHealthProgram } from "../../../../../slices/healthProgramSlice"
import IconBtn from "../../../HomePage/common/IconBtn"
import Upload from "../Upload"

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { program } = useSelector((state) => state.healthProgram)

  // Prefill for view/edit
  useEffect(() => {
    if (view || edit) {
      setValue("stepTitle", modalData.title)
      setValue("stepDesc", modalData.description)
      setValue("stepVideo", modalData.videoUrl)
    }
  }, [
    edit,
    modalData.description,
    modalData.title,
    modalData.videoUrl,
    setValue,
    view,
  ])

  const isFormUpdated = () => {
    const currentValues = getValues()
    return (
      currentValues.stepTitle !== modalData.title ||
      currentValues.stepDesc !== modalData.description ||
      currentValues.stepVideo !== modalData.videoUrl
    )
  }

  const handleEditSubSection = async () => {
    const currentValues = getValues()
    const formData = new FormData()

    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)

    if (currentValues.stepTitle !== modalData.title)
      formData.append("title", currentValues.stepTitle)

    if (currentValues.stepDesc !== modalData.description)
      formData.append("description", currentValues.stepDesc)

    if (currentValues.stepVideo !== modalData.videoUrl)
      formData.append("video", currentValues.stepVideo)

    setLoading(true)
    const result = await updateProgramSubSection(formData, token)

    if (result) {
      const updatedContent = program.programContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      dispatch(
        setHealthProgram({
          ...program,
          programContent: updatedContent,
        })
      )
    }

    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made")
      } else {
        handleEditSubSection()
      }
      return
    }

    const formData = new FormData()
    formData.append("sectionId", modalData)
    formData.append("title", data.stepTitle)
    formData.append("description", data.stepDesc)
    formData.append("video", data.stepVideo)

    setLoading(true)
    const result = await createProgramSubSection(formData, token)

    if (result) {
      const updatedContent = program.programContent.map((section) =>
        section._id === modalData ? result : section
      )
      dispatch(
        setHealthProgram({
          ...program,
          programContent: updatedContent,
        })
      )
    }

    setModalData(null)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Care Step
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          <Upload
            name="stepVideo"
            label="Care Step Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5">
              Step Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              {...register("stepTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.stepTitle && (
              <span className="text-xs text-pink-200">
                Step title is required
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5">
              Step Description {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              {...register("stepDesc", { required: true })}
              className="form-style min-h-[130px] w-full resize-none"
            />
            {errors.stepDesc && (
              <span className="text-xs text-pink-200">
                Step description is required
              </span>
            )}
          </div>

          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Saving..." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
