import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import ProgressBar from "@ramonak/react-progress-bar"
import Loader from "../HomePage/common/Loader"
import { getUserEnrolledHealthPrograms } from "../../../services/operations/profileAPI"

function EnrolledHealthPrograms() {
  const { token } = useSelector((state) => state.auth)
  const [enrolledHealthPrograms, setEnrolledHealthPrograms] = useState(null)

  const getEnrolledHealthProgram = useCallback(async () => {
    try {
      const response = await getUserEnrolledHealthPrograms(token)
      setEnrolledHealthPrograms(response)
    } catch (err) {
      console.error("Unable to fetch health programs", err)
    }
  }, [token])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getEnrolledHealthProgram()
  }, [getEnrolledHealthProgram])

  return (
    <div className="text-white">
      <div>Enrolled Health Programs</div>
      {!enrolledHealthPrograms ? (
        <Loader />
      ) : !enrolledHealthPrograms.length ? (
        <p>You have not enrolled in any health program yet</p>
      ) : (
        <div>
          <div>
            <p>Health Program Name</p>
            <p>Duration</p>
            <p>Progress</p>
          </div>
          {/* Cards */}
          {enrolledHealthPrograms.map((healthProgram) => (
            <div key={healthProgram._id}>
              <div>
                <img src={healthProgram.thumbnail} alt={healthProgram.healthProgramName} />
                <div>
                  <p>{healthProgram.healthProgramName}</p>
                  <p>{healthProgram.healthProgramDescription}</p>
                </div>
              </div>

              <div>{healthProgram?.totalDuration}</div>

              <div>
                <p>Progress: {healthProgram.progress || 0}</p>
                <ProgressBar
                  completed={healthProgram.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EnrolledHealthPrograms
