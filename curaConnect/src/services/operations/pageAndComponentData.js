import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { catalogEndpoints } from "../apis"

export const getCatalogaPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...")
  let result = []

  try {
    const response = await apiConnector(
      "POST",
      catalogEndpoints.GET_CATALOG_PAGE_DATA_API,
      { categoryId }
    )

    if (!response?.data?.success) {
      throw new Error("Could not fetch catalog page data")
    }

    result = response.data
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR:", error)
    toast.error(error.message)
    result = error.response?.data
  }

  toast.dismiss(toastId)
  return result
}
