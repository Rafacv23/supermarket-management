"use server"

import { prisma } from "@/lib/prisma"

interface UploadProductProps {
  employeeId: string
  products: {
    barcode: string
    stock: number // quantity to subtract
  }[]
}

export default async function uploadProductAndCreateOrder({
  employeeId,
  products,
}: UploadProductProps) {
  try {
    const validItems: {
      productBarcode: string
      quantity: number
    }[] = []

    // Paso 1: Verificar productos y actualizar stock
    await Promise.all(
      products.map(async (product) => {
        const existingProduct = await prisma.product.findUnique({
          where: { barcode: product.barcode },
        })

        if (!existingProduct) {
          console.warn(`Producto con barcode ${product.barcode} no encontrado.`)
          return
        }

        if (existingProduct.stock < product.stock) {
          console.warn(
            `Stock insuficiente para ${product.barcode}: Disponible ${existingProduct.stock}, Intentado: ${product.stock}`
          )
          return
        }

        // Actualizar stock
        await prisma.product.update({
          where: { barcode: product.barcode },
          data: {
            stock: {
              decrement: product.stock,
            },
          },
        })

        validItems.push({
          productBarcode: product.barcode,
          quantity: product.stock,
        })
      })
    )

    if (validItems.length === 0) {
      console.warn("No hay productos válidos para crear una orden.")
      return null
    }

    // Paso 2: Crear la orden y los OrderItems
    const order = await prisma.order.create({
      data: {
        employeeId,
        orderItems: {
          create: validItems.map((item) => ({
            productBarcode: item.productBarcode,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    })

    return order
  } catch (error) {
    console.error("Error al crear la orden:", error)
    throw new Error("Falló la creación de la orden")
  }
}
