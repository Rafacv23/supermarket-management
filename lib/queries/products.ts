import { Category, Product } from "@prisma/client"
import { useInfiniteQuery } from "@tanstack/react-query"

export async function getProductByBarcode(barcode: string): Promise<Product> {
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

async function getProductsByQuery(query: string): Promise<Product[]> {
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

export function useProductsByCategory(category: Category | undefined) {
  return useInfiniteQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/products/category/${category}?page=${pageParam}&limit=10`
      )
      if (!res.ok) throw new Error("Failed to fetch products")
      return res.json()
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 10 ? undefined : allPages.length + 1,
    enabled: !!category,
    initialPageParam: 1,
  })
}

import { BARCODE_REGEX } from "../definitions"

export async function searchProducts(term: string): Promise<Product[]> {
  const trimmedTerm = term.trim()
  if (!trimmedTerm) {
    throw new Error("El término de búsqueda está vacío.")
  }

  const isBarcode = BARCODE_REGEX.test(trimmedTerm)
  const result = isBarcode
    ? await getProductByBarcode(trimmedTerm)
    : await getProductsByQuery(trimmedTerm.toLowerCase())

  return Array.isArray(result) ? result : [result]
}
