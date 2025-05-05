"use server"

import { prisma } from "@/lib/prisma"

interface ReceiveProductProps {
  products: [
    {
      barcode: string
      stock: number
    }
  ]
}

export default async function receiveProduct({
  products,
}: ReceiveProductProps) {
  try {
    // Create an array to hold the promises for product updates
    const updatePromises = products.map(async (product) => {
      // Check if the product exists in the database
      const existingProduct = await prisma.product.findUnique({
        where: {
          barcode: product.barcode,
        },
      })

      // If the product exists, update the stock; if not, skip the update
      if (existingProduct) {
        return prisma.product.update({
          where: {
            barcode: product.barcode,
          },
          data: {
            stock: {
              increment: product.stock,
            },
          },
        })
      } else {
        // Return null or handle accordingly if the product doesn't exist
        console.log(
          `Product with barcode ${product.barcode} does not exist, skipping.`
        )
        return null
      }
    })

    // Execute the updates in parallel, filtering out null results (non-existing products)
    const updatedProducts = await Promise.all(updatePromises)

    // Filter out null values (products that did not exist and were skipped)
    return updatedProducts.filter(Boolean)
  } catch (error) {
    console.error("Error receiving products:", error)
    throw new Error("Error receiving products")
  }
}
