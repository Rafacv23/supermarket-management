//returns all the orders from the database
// returns all the pending orders from the database

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error("Error fetching pending orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch pending orders" },
      { status: 500 }
    )
  }
}
