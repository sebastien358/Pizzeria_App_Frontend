import axios from 'axios'
import type { ProductFormInterface, ProductInterface } from '@/shared/interfaces'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosGetProductAdmin(currentPage: number, limit: number,): Promise<ProductInterface[] | ProductInterface> {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/product/list`, {
      params: {
        currentPage: currentPage,
        limit: limit,
      },
    })
    return response.data
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminCurrentProduct(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/product/current/${id}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`error current product: ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAddProductAdmin(
  formData: ProductFormInterface,
): Promise<ProductFormInterface> {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/product/add`, formData)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`error add product: ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosEditProductAdmin(
  formData: ProductFormInterface,
  id: number,
): Promise<ProductFormInterface> {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/product/edit/${id}`, formData)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`error edit product: ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosDeleteProductAdmin(
  id: ProductFormInterface,
): Promise<ProductFormInterface> {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/product/delete/${id}`)
    if (response.status === 200 || response.status === 204) {
      return response.data
    }
    throw new Error(`error delete product: ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosDeleteProductImage(productId: number, imageId: number): Promise<ProductFormInterface> {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/product/delete/${productId}/image/${imageId}`)
    if (response.status === 200 || response.status === 204) {
      return response.data
    }
    throw new Error(`error delete images product: ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminSearchProduct(term: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/product/search`, {
      params: {
        search: term,
      },
    })
    if (response.status >= 200 || response.status < 300) {
      return response.data ?? true
    }
    throw new Error(`Erreur input search products : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

