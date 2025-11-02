import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

export const uploadImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append("image", file)

    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const response = await axios.post(`${API_BASE_URL}/auth/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`,
      },
    })

    return response.data.imageUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}
