import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import HealthProgramReviewModal from "../components/core/ViewHealthProgram/HealthProgramReviewModal"
import VideoDetailsSidebar from "../components/core/ViewHealthProgram/VideoDetailsSidebar"
import { getFullDetailsOfHealthProgram } from "../services/operations/healthProgramDetailsAPI"
import {
  setHealthProgramSectionData,
  setEntireHealthProgramData,
  setCompletedLectures,
  setTotalNoOfLectures,
} from "../slices/viewHealthProgramSlice"

export default function ViewHealthProgram() {
  const { programId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [reviewModal, setReviewModal] = useState(false)

  useEffect(() => {
    ;(async () => {
      const programData = await getFullDetailsOfHealthProgram(
        programId,
        token
      )

      dispatch(
        setHealthProgramSectionData(
          programData.healthProgramDetails.programContent
        )
      )
      dispatch(
        setEntireHealthProgramData(
          programData.healthProgramDetails
        )
      )
      dispatch(setCompletedLectures(programData.completedSteps))

      let steps = 0
      programData?.healthProgramDetails?.programContent?.forEach(
        (sec) => {
          steps += sec.subSections.length
        }
      )
      dispatch(setTotalNoOfLectures(steps))
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />

        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>

      {reviewModal && (
        <HealthProgramReviewModal
          setReviewModal={setReviewModal}
        />
      )}
    </>
  )
}
