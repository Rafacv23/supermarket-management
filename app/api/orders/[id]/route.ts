// returns a specific order with his products by a given id

import { prisma } from "@/lib/prisma"
import { type NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    if (!id) {
      return new Response("Order ID is required", { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return new Response("Order not found", { status: 404 })
    }

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "3600",
      },
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return new Response("Failed to fetch order", { status: 500 })
  }
}
