"use server"

import { prisma } from "@/lib/prisma"

interface UploadProductProps {
  products: [
    {
      barcode: string
      stock: number
    }
  ]
}

export default async function uploadProduct({ products }: UploadProductProps) {
  try {
    // Create an array to hold the promises for product updates
    const updatePromises = products.map(async (product) => {
      // Check if the product exists in the database
      const existingProduct = await prisma.product.findUnique({
        where: {
          barcode: product.barcode,
        },
      })

      // If the product exists, check the stock and update accordingly
      if (existingProduct) {
        // Check if the stock to be uploaded is more than the available stock
        if (product.stock > existingProduct.stock) {
          console.log(
            `Cannot upload more stock than available for product with barcode ${product.barcode}. Available: ${existingProduct.stock}, Attempted: ${product.stock}`
          )
          // Optionally, you can throw an error here to prevent the operation from continuing
          throw new Error(
            `Cannot upload more stock than available for product ${product.barcode}`
          )
        }

        // Proceed with the update if the stock is valid
        return prisma.product.update({
          where: {
            barcode: product.barcode,
          },
          data: {
            stock: {
              decrement: product.stock, // Decrease the stock by the uploaded amount
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
