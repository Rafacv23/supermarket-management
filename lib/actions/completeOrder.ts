"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

//this function ensures that the order is completed and marks it as completed in the database
export default async function completeOrder(orderId: string) {
  try {
    // fetch the order from the database

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })
    if (!order) {
      console.log("Order not found")
      return
    }

    // check if the order is already completed
    if (order.status === "COMPLETED") {
      console.log("Order is already completed")
      return
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    })

    console.log("Order completed successfully")

    revalidatePath(`/`)
  } catch (error) {
    console.error("Error completing order:", error)
    throw new Error("Error completing order")
  }
}
