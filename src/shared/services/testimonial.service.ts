import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosTestimonialList(currentPage: number, limit: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/testimonial/list`, {
      params: {
        currentPage: currentPage,
        limit: limit
      }
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur de la récupération des témoignages : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAddTestimonial(formData: FormData) {
  try {
    const response = await axios.post(`${BASE_URL}/api/testimonial/add`, formData)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur de l'ajout d'un témoignage : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}
