import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export const axiosRemoveAccountUser = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/user/account/delete`)
    if (response.status === 200 || response.status === 204) {
      return response.data
    }

    throw new Error(`La suppression du compte a échoué : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}
