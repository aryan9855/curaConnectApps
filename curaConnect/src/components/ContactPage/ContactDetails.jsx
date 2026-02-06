import React from "react"
import * as Icon1 from "react-icons/bi"
import * as Icon2 from "react-icons/io5"
import * as Icon3 from "react-icons/hi2"

const contactDetails = [
  {
    icon: "HiChatBubbleLeftRight",
    heading: "Chat with Care Team",
    description: "Our healthcare support team is available to assist you.",
    details: "support@curaconnect.com",
  },
  {
    icon: "BiWorld",
    heading: "Visit Our Center",
    description: "Meet our team at our healthcare support office.",
    details:
      "CuraConnect Health Hub, Akshya Nagar 1st Block, Bangalore - 560016",
  },
  {
    icon: "IoCall",
    heading: "Call for Assistance",
    description: "Mon - Sat | 9:00 AM to 6:00 PM",
    details: "+91 00000 00000",
  },
]

const ContactDetails = () => {
  return (
    <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6">
      {contactDetails.map((ele, index) => {
        const Icon =
          Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon]

        return (
          <div
            key={index}
            className="flex flex-col gap-1 p-3 text-sm text-richblack-200"
          >
            <div className="flex items-center gap-3">
              <Icon size={25} />
              <h2 className="text-lg font-semibold text-richblack-5">
                {ele.heading}
              </h2>
            </div>

            <p className="font-medium">{ele.description}</p>
            <p className="font-semibold">{ele.details}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ContactDetails
