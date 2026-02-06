import React, { useMemo, useState } from "react"
import { HomePageExplore } from "../../../data/homepage-explore"
import HealthProgramCard from "./HealthProgramCard"
import HighlightText from "./HighlightText"

const tabsName = ["Free", "New to Healthcare", "Most Popular", "Clinical Paths", "Career Paths"]

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0])

  const currentCourses = useMemo(() => {
    const result = HomePageExplore.find((item) => item.tag === currentTab)
    return result?.courses || []
  }, [currentTab])

  const [currentCard, setCurrentCard] = useState(
    currentCourses[0]?.heading || ""
  )

  const setMyCards = (value) => {
    setCurrentTab(value)
    const result = HomePageExplore.find((item) => item.tag === value)
    const nextCourses = result?.courses || []
    setCurrentCard(nextCourses[0]?.heading || "")
  }

  return (
    <div>
      {/* Heading */}
      <div className="text-4xl font-semibold text-center">
        Explore our
        <HighlightText text={" Health Programs"} />
      </div>

      {/* Tabs */}
      <div className="flex gap-5 justify-center mt-8">
        {tabsName.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all
              ${
                currentTab === tab
                  ? "bg-richblack-800 text-white"
                  : "bg-richblack-700 text-richblack-200"
              }`}
            onClick={() => setMyCards(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6 mt-10">
        {currentCourses.map((program, index) => (
          <HealthProgramCard
            key={index}
            cardData={program}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
          />
        ))}
      </div>
    </div>
  )
}

export default ExploreMore
