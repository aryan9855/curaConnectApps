import React from "react"
import ContactUsForm from "./ContactUsForm"

const ContactForm = () => {
  return (
    <div className="border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex flex-col gap-3">
      <h1 className="text-4xl leading-10 font-semibold text-richblack-5">
        Have a Health Question or Idea?
      </h1>

      <p>
        Share your concerns, ideas, or feedback with us — our healthcare team is
        here to help you.
      </p>

      <div className="mt-7">
        <ContactUsForm />
      </div>
    </div>
  )
}

export default ContactForm
