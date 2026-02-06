import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import { markStepAsComplete } from "../../../services/operations/healthProgramDetailsAPI"

import { updateCompletedLectures } from "../../../slices/viewHealthProgramSlice"

import IconBtn from "../HomePage/common/IconBtn"

const VideoDetails = () => {
  const { programId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const dispatch = useDispatch()

  const { token } = useSelector((state) => state.auth)
  const {
    healthProgramSectionData,
    healthProgramEntireData,
    completedLectures,
  } = useSelector((state) => state.viewHealthProgram)

  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  const videoData = useMemo(() => {
    if (!healthProgramSectionData.length) return null

    const currentSection = healthProgramSectionData.find(
      (sec) => sec._id === sectionId
    )

    return currentSection?.subSection?.find(
      (step) => step._id === subSectionId
    )
  }, [healthProgramSectionData, sectionId, subSectionId])

  const previewSource = healthProgramEntireData?.thumbnail || ""

  useEffect(() => {
    if (!healthProgramSectionData.length) return

    if (!videoData) {
      navigate("/dashboard/my-health-programs")
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVideoEnded(false)
  }, [healthProgramSectionData.length, navigate, videoData])

  // Helpers
  const isFirstVideo = () => {
    const secIndex = healthProgramSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subIndex =
      healthProgramSectionData[secIndex]?.subSection?.findIndex(
        (s) => s._id === subSectionId
      )

    return secIndex === 0 && subIndex === 0
  }

  const isLastVideo = () => {
    const secIndex = healthProgramSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subIndex =
      healthProgramSectionData[secIndex]?.subSection?.findIndex(
        (s) => s._id === subSectionId
      )

    return (
      secIndex === healthProgramSectionData.length - 1 &&
      subIndex === healthProgramSectionData[secIndex].subSection.length - 1
    )
  }

  const goToNextVideo = () => {
    const secIndex = healthProgramSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subIndex =
      healthProgramSectionData[secIndex].subSection.findIndex(
        (s) => s._id === subSectionId
      )

    if (subIndex + 1 < healthProgramSectionData[secIndex].subSection.length) {
      const nextId =
        healthProgramSectionData[secIndex].subSection[subIndex + 1]._id
      navigate(
        `/view-health-program/${programId}/section/${sectionId}/sub-section/${nextId}`
      )
    } else {
      const nextSection = healthProgramSectionData[secIndex + 1]
      navigate(
        `/view-health-program/${programId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
      )
    }
  }

  const goToPrevVideo = () => {
    const secIndex = healthProgramSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subIndex =
      healthProgramSectionData[secIndex].subSection.findIndex(
        (s) => s._id === subSectionId
      )

    if (subIndex > 0) {
      const prevId =
        healthProgramSectionData[secIndex].subSection[subIndex - 1]._id
      navigate(
        `/view-health-program/${programId}/section/${sectionId}/sub-section/${prevId}`
      )
    } else {
      const prevSection = healthProgramSectionData[secIndex - 1]
      const lastStep =
        prevSection.subSection[prevSection.subSection.length - 1]._id
      navigate(
        `/view-health-program/${programId}/section/${prevSection._id}/sub-section/${lastStep}`
      )
    }
  }

  const handleStepCompletion = async () => {
    setLoading(true)
    const res = await markStepAsComplete(
      { programId, subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  const handleRewatch = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setVideoEnded(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full rounded-md"
            controls
            poster={previewSource}
            onEnded={() => setVideoEnded(true)}
          >
            <source src={videoData.videoUrl} />
          </video>

          {videoEnded && (
            <div className="absolute inset-0 z-50 grid place-content-center bg-black/70">
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={handleStepCompletion}
                  text={loading ? "Loading..." : "Mark as Completed"}
                />
              )}

              <IconBtn
                onclick={handleRewatch}
                text="Rewatch"
                customClasses="mt-2"
              />

              <div className="mt-6 flex gap-4">
                {!isFirstVideo() && (
                  <button onClick={goToPrevVideo} className="blackButton">
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button onClick={goToNextVideo} className="blackButton">
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails
