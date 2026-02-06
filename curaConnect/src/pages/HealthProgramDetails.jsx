import React, { useEffect, useMemo, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import ConfirmationModal from "../components/core/HomePage/common/ConfirmationModel"
import Footer from "../components/core/HomePage/common/Footer"
import RatingStars from "../components/core/HomePage/common/RatingStars"
import HealthProgramAccordionBar from "../components/core/HealthProgram/HealthProgramAccordionBar"
import HealthProgramDetailsCard from "../components/core/HealthProgram/HealthProgramDetailsCard"

import { formatDate } from "../services/formateDate"
import { fetchHealthProgramDetails } from "../services/operations/healthProgramDetailsAPI"
import { buyHealthProgram } from "../services/operations/PatientFeaturesAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"

function HealthProgramDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.healthProgram)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // programId from URL
  const { programId } = useParams()

  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetchHealthProgramDetails(programId)
        setResponse(res)
      } catch (err) {
        console.error("Could not fetch Health Program Details", err)
      }
    })()
  }, [programId])

  const avgReviewCount = useMemo(() => {
    return GetAvgRating(
      response?.data?.healthProgramDetails?.ratingAndReviews
    )
  }, [response])

  const totalNoOfSteps = useMemo(() => {
    let steps = 0
    response?.data?.healthProgramDetails?.programContent?.forEach((sec) => {
      steps += sec.subSections.length || 0
    })
    return steps
  }, [response])

  // Accordion state
  const [isActive, setIsActive] = useState([])
  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? [...isActive, id]
        : isActive.filter((e) => e !== id)
    )
  }

  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!response.success) {
    return <Error />
  }

  const {
    _id: program_id,
    title,
    description,
    whatYouWillLearn,
    programContent,
    ratingAndReviews,
    doctor,
    patientsEnrolled,
    createdAt,
  } = response.data.healthProgramDetails

  const handleBuyProgram = () => {
    if (token) {
      buyHealthProgram(token, [program_id], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to enroll in this program.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        {/* Hero */}
        <div className="mx-auto box-content px-4 lg:w-[1260px]">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab py-8 lg:mx-0 xl:max-w-[810px]">
            <div className="z-30 my-5 flex flex-col gap-4 py-5 text-lg text-richblack-5">
              <p className="text-4xl font-bold">{title}</p>
              <p className="text-richblack-200">{description}</p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars rating={avgReviewCount} size={24} />
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                <span>{`${patientsEnrolled.length} enrolled`}</span>
              </div>

              <p>
                Created By {`${doctor.firstName} ${doctor.lastName}`}
              </p>

              <div className="flex gap-5">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>

            <div className="hidden lg:block lg:absolute right-[1rem] top-[60px] w-1/3 max-w-[410px]">
              <HealthProgramDetailsCard
                program={response.data.healthProgramDetails}
                setConfirmationModal={setConfirmationModal}
                handleBuyProgram={handleBuyProgram}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto box-content px-4 text-richblack-5 lg:w-[1260px]">
        <div className="xl:max-w-[810px]">
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5 whitespace-pre-line">
              {whatYouWillLearn}
            </div>
          </div>

          <div>
            <p className="text-[28px] font-semibold">Program Content</p>
            <div className="flex justify-between py-3">
              <div className="flex gap-2">
                <span>{programContent.length} section(s)</span>
                <span>{totalNoOfSteps} step(s)</span>
              </div>
              <button
                className="text-yellow-25"
                onClick={() => setIsActive([])}
              >
                Collapse all sections
              </button>
            </div>

            <div className="py-4">
              {programContent.map((section) => (
                <HealthProgramAccordionBar
                  key={section._id}
                  section={section}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            {/* Doctor */}
            <div className="mb-12 py-4">
              <p className="text-[28px] font-semibold">Doctor</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    doctor.image ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${doctor.firstName} ${doctor.lastName}`
                  }
                  alt="Doctor"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg">
                  {doctor.firstName} {doctor.lastName}
                </p>
              </div>
              <p className="text-richblack-50">
                {doctor?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  )
}

export default HealthProgramDetails
