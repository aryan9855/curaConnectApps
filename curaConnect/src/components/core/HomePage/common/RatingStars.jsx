import React, { useMemo } from "react"
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti"

function RatingStars({ rating = 0, size = 20 }) {
  const starCount = useMemo(() => {
    const safeRating = Math.min(Math.max(rating, 0), 5)
    const fullStars = Math.floor(safeRating)
    const hasHalfStar = !Number.isInteger(safeRating)

    return {
      full: fullStars,
      half: hasHalfStar ? 1 : 0,
      empty: hasHalfStar ? 4 - fullStars : 5 - fullStars,
    }
  }, [rating])

  return (
    <div
      className="flex gap-1 text-yellow-100"
      aria-label={`Rating: ${rating} out of 5`}
    >
      {[...Array(starCount.full)].map((_, i) => (
        <TiStarFullOutline key={`full-${i}`} size={size} />
      ))}

      {[...Array(starCount.half)].map((_, i) => (
        <TiStarHalfOutline key={`half-${i}`} size={size} />
      ))}

      {[...Array(starCount.empty)].map((_, i) => (
        <TiStarOutline key={`empty-${i}`} size={size} />
      ))}
    </div>
  )
}

export default RatingStars
