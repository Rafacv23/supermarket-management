import { Product } from "@prisma/client"

export async function getProductByBarcode(barcode: string): Promise<Product[]> {
  try {
    const res = await fetch(`/api/products/${barcode}`)
    if (!res.ok) {
      console.error("Error fetching product:", res.statusText)
      throw new Error("Failed to fetch product")
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Failed to fetch data:", error)
    throw new Error("Error fetching product data")
  }
}

export async function getProductsByQuery(query: string): Promise<Product[]> {
  try {
    const res = await fetch(`/api/products/search?q=${query}`)
    if (!res.ok) {
      console.error("Error fetching products:", res.statusText)
      throw new Error("Failed to fetch products")
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Failed to fetch data:", error)
    throw new Error("Error fetching product data")
  }
}
