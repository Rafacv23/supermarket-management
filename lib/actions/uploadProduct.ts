"use server"

import { prisma } from "@/lib/prisma"

interface UploadProductProps {
  products: {
    barcode: string
    stock: number
  }[]
}

export default async function uploadProduct({ products }: UploadProductProps) {
  try {
    const updatePromises = products.map(async (product) => {
      const existingProduct = await prisma.product.findUnique({
        where: { barcode: product.barcode },
      })

      if (!existingProduct) {
        console.warn(`Product with barcode ${product.barcode} not found.`)
        return null
      }

      if (existingProduct.stock < product.stock) {
        console.warn(
          `Insufficient stock for product ${product.barcode}: Available ${existingProduct.stock}, Tried to subtract ${product.stock}`
        )
        return null
      }

      return prisma.product.update({
        where: { barcode: product.barcode },
        data: {
          stock: {
            decrement: product.stock,
          },
        },
      })
    })

    const updatedProducts = await Promise.all(updatePromises)
    return updatedProducts.filter(Boolean) // remove nulls
  } catch (error) {
    console.error("Error uploading products:", error)
    throw new Error("Upload failed")
  }
}
