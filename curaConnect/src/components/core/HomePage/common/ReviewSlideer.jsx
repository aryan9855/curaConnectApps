import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"

// Icons
import { FaStar } from "react-icons/fa"

// API
import { apiConnector } from "../../../../services/apiconnector"
import { ratingsEndpoints } from "../../../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )

        if (data?.success) {
          setReviews(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error)
      }
    })()
  }, [])

  return (
    <div className="text-white">
      <div className="my-[50px] max-w-maxContentTab lg:max-w-maxContent">
        {reviews.length ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="min-w-[260px] flex-shrink-0 rounded-lg bg-richblack-800 p-3 text-[14px] text-richblack-25"
              >
                {/* Patient Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review.user.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt="Patient Avatar"
                    className="h-9 w-9 rounded-full object-cover"
                  />

                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">
                      {`${review?.user?.firstName} ${review?.user?.lastName}`}
                    </h1>
                    <h2 className="text-[12px] font-medium text-richblack-500">
                      {review?.doctor?.name || review?.service?.name}
                    </h2>
                  </div>
                </div>

                {/* Review Text */}
                <p className="mt-3 font-medium text-richblack-25">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")}...`
                    : review.review}
                </p>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </span>

                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-richblack-400">No reviews yet</p>
        )}
      </div>
    </div>
  )
}

export default ReviewSlider
