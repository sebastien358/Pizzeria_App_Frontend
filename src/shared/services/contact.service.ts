import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosAddContact(data: Object) {
  try {
    const response = await axios.post(`${BASE_URL}/contact/new`, data)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur de l'envoi d'un message : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

