"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

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
          return {
            message: `Producto con código de barras ${product.barcode} no encontrado.`,
            status: 403,
          }
        }

        validItems.push({
          productBarcode: product.barcode,
          quantity: product.stock,
        })
      })
    )

    if (validItems.length === 0) {
      console.warn("No hay productos válidos para crear una orden.")
      return {
        message: "No hay productos válidos para crear un pedido.",
        status: 403,
      }
    }

    // Paso 2: Crear la orden y los OrderItems
    const order = await prisma.order.create({
      data: {
        employeeId,
        orderItems: {
          create: validItems.map((item) => ({
            product: {
              connect: { barcode: item.productBarcode }, // This should work because we are using `barcode` as the unique key
            },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    })

    console.log(order)

    revalidatePath("/")

    return {
      message: "Pedido creado con éxito",
      status: 200,
    }
  } catch (error) {
    console.error("Error al crear la orden:", error)
    return {
      message: "Error al crear el pedido",
      status: 500,
    }
  }
}
