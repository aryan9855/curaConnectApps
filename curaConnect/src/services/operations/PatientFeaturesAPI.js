import { toast } from "react-hot-toast"
import { patientEndpoints } from "../apis"
import { apiConnector } from "../apiconnector"
import rzpLogo from "../../assets/Images/CuraConnectLogo.png"
import { setPaymentLoading } from "../../slices/healthProgramSlice"
import { resetCart } from "../../slices/cartSlice"

const {
  PROGRAM_PAYMENT_API,
  PROGRAM_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = patientEndpoints

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src

    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)

    document.body.appendChild(script)
  })
}

export async function buyHealthProgram(
  token,
  programs,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...")

  try {
    // Load Razorpay SDK
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    )

    if (!res) {
      toast.error("Razorpay SDK failed to load")
      return
    }

    // Create order
    const orderResponse = await apiConnector(
      "POST",
      PROGRAM_PAYMENT_API,
      { programs },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderResponse.data.message.currency,
      amount: `${orderResponse.data.message.amount}`,
      order_id: orderResponse.data.message.id,
      name: "CuraConnect",
      description: "Thank you for enrolling in the health program",
      image: rzpLogo,
      prefill: {
        name: userDetails.firstName,
        email: userDetails.email,
      },
      handler: function (response) {
        sendPaymentSuccessEmail(
          response,
          orderResponse.data.message.amount,
          token
        )
        verifyPayment(
          { ...response, programs },
          token,
          navigate,
          dispatch
        )
      },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()

    paymentObject.on("payment.failed", function (response) {
      toast.error("Payment failed")
      console.log(response.error)
    })
  } catch (error) {
    console.log("PAYMENT API ERROR:", error)
    toast.error("Could not complete payment")
  }

  toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR:", error)
  }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying payment...")
  dispatch(setPaymentLoading(true))

  try {
    const response = await apiConnector(
      "POST",
      PROGRAM_VERIFY_API,
      bodyData,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Payment successful. You are now enrolled!")
    navigate("/dashboard/enrolled-health-programs")
    dispatch(resetCart())
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR:", error)
    toast.error("Could not verify payment")
  }

  toast.dismiss(toastId)
  dispatch(setPaymentLoading(false))
}
