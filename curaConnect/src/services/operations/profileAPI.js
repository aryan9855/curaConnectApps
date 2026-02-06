import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_PROGRAMS_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

// ================= USER DETAILS =================
export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector(
        "GET",
        GET_USER_DETAILS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`

      dispatch(
        setUser({
          ...response.data.data,
          image: userImage,
        })
      )
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR:", error)
      toast.error("Could not fetch user details")
    }

    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

// ================= ENROLLED HEALTH PROGRAMS =================
export async function getUserEnrolledHealthPrograms(token) {
  const toastId = toast.loading("Loading...")
  let result = []

  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_PROGRAMS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_PROGRAMS_API ERROR:", error)
    toast.error("Could not get enrolled health programs")
  }

  toast.dismiss(toastId)
  return result
}

// ================= INSTRUCTOR / DOCTOR DATA =================
export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...")
  let result = []

  try {
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_DATA_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    result = response?.data?.programs
  } catch (error) {
    console.log("GET_INSTRUCTOR_API ERROR:", error)
    toast.error("Could not fetch instructor data")
  }

  toast.dismiss(toastId)
  return result
}
