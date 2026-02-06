import React from "react"
import RatingStars from "../HomePage/common/RatingStars"
import GetAvgRating from "../../../utils/avgRating"
import { Link } from "react-router-dom"

const HealthProgramCard = ({ program, height }) => {
  const avgRating = GetAvgRating(program?.ratingsAndReviews)

  return (
    <Link to={`/health-programs/${program._id}`}>
      <div>
        {/* Thumbnail */}
        <div className="rounded-lg">
          <img
            src={program?.thumbnail}
            alt="health program thumbnail"
            className={`${height} w-full rounded-xl object-cover`}
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2 px-1 py-3">
          <p className="text-xl text-richblack-5">
            {program?.title}
          </p>

          <p className="text-sm text-richblack-50">
            {program?.doctor?.firstName} {program?.doctor?.lastName}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-yellow-5">
              {avgRating || 0}
            </span>

            <RatingStars rating={avgRating} />

            <span className="text-richblack-400">
              {program?.ratingsAndReviews?.length} Reviews
            </span>
          </div>

          <p className="text-xl text-richblack-5">
            Rs {program?.price}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default HealthProgramCard
