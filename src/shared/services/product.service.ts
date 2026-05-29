import axios from 'axios'
import type { ProductInterface } from '@/shared/interfaces'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosGetProducts(offset: number, limit: number): Promise<ProductInterface[] | ProductInterface> {
  try {
    const response = await axios.get(`${BASE_URL}/api/product/list`, {
      params: {
        offset,
        limit
      }
    })
    return response.data
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function axiosSearchProducts(search: string): Promise<ProductInterface[] | ProductInterface> {
  try {
    const response = await axios.get(`${BASE_URL}/api/product/search`, {
      params: {
        search
      }
    })
    return response.data
  } catch (e) {
    console.log(e)
    throw e
  }
}
