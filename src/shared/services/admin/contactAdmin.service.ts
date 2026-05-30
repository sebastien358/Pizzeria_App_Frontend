import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosAdminContactList(currentPage: number, limit: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/contact/list`, {
      params: {
        currentPage: currentPage,
        limit: limit
      }
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur de la récupération de la liste des contacts : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminContactCurrent(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/contact/current/${id}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur de la récupération du détails d'un contact :  ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminContactSearch(term: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/contact/search`, {
      params: {
        search: term,
      },
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur search contacts : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminActiveIsRead(id: number) {
  try {
    const response = await axios.patch(`${BASE_URL}/api/admin/contact/is-read/${id}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur lors de la mise à jour du contact  : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminRemoveContact(id: number) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/contact/remove/${id}`)
    if (response.status === 200 || response.status === 204) {
      return response.data
    }

    throw new Error(`Erreur lors de la suppression du contact : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}
