import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { editProgramDetails } from "../../../../../services/operations/healthProgramAPI"
import {
  resetHealthProgramState,
  setStep,
} from "../../../../../slices/healthProgramSlice"
import { PROGRAM_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../HomePage/common/IconBtn"

export default function PublishProgram() {
  const { register, handleSubmit, setValue, getValues } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { program } = useSelector((state) => state.healthProgram)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (program?.status === PROGRAM_STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [program?.status, setValue])

  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToPrograms = () => {
    dispatch(resetHealthProgramState())
    navigate("/dashboard/my-programs")
  }

  const handleProgramPublish = async () => {
    // Check if form is actually updated
    if (
      (program?.status === PROGRAM_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (program?.status === PROGRAM_STATUS.DRAFT &&
        getValues("public") === false)
    ) {
      goToPrograms()
      return
    }

    const formData = new FormData()
    formData.append("programId", program._id)

    const programStatus = getValues("public")
      ? PROGRAM_STATUS.PUBLISHED
      : PROGRAM_STATUS.DRAFT

    formData.append("status", programStatus)

    setLoading(true)
    const result = await editProgramDetails(formData, token)

    if (result) {
      goToPrograms()
    }

    setLoading(false)
  }

  const onSubmit = () => {
    handleProgramPublish()
  }

  return (
    <div className="rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="h-4 w-4 rounded border-gray-300 bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this health program public
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex items-center gap-x-2 rounded-md bg-richblack-300 px-[20px] py-[8px] font-semibold text-richblack-900"
          >
            Back
          </button>

          <IconBtn disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  )
}
