import React from "react"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"

function HealthProgramDetailsCard({
  program,
  setConfirmationModal,
  handleBuyProgram,
}) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { thumbnail, price } = program

  const handleShare = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = window.location.href
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
      }
      toast.success("Link copied to clipboard")
    } catch (err) {
      console.error("Failed to copy link", err)
      toast.error("Could not copy link")
    }
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.DOCTOR) {
      toast.error("Doctors cannot purchase health programs.")
      return
    }

    if (token) {
      dispatch(addToCart(program))
      return
    }

    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to continue",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const isEnrolled = program?.enrolledUsers?.includes(user?._id)

  return (
    <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5">
      {/* Thumbnail */}
      <img
        src={thumbnail}
        alt={program?.title}
        className="max-h-[300px] min-h-[180px] w-[400px] rounded-2xl object-cover md:max-w-full"
      />

      <div className="px-4">
        {/* Price */}
        <div className="pb-4 text-3xl font-semibold">Rs {price}</div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <button
            className="yellowButton"
            onClick={
              user && isEnrolled
                ? () => navigate("/dashboard/my-programs")
                : handleBuyProgram
            }
          >
            {user && isEnrolled ? "Go To Program" : "Enroll Now"}
          </button>

          {(!user || !isEnrolled) && (
            <button onClick={handleAddToCart} className="blackButton">
              Add to Cart
            </button>
          )}
        </div>

        {/* Trust Text */}
        <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
          Secure payment - Trusted healthcare professionals
        </p>

        {/* Program Includes */}
        <div>
          <p className="my-2 text-xl font-semibold">
            This Health Program Includes:
          </p>

          <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
            {program?.highlights?.map((item, index) => (
              <p key={index} className="flex gap-2">
                <BsFillCaretRightFill />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Share */}
        <div className="text-center">
          <button
            className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
            onClick={handleShare}
          >
            <FaShareSquare size={15} />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

export default HealthProgramDetailsCard
