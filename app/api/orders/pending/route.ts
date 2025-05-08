// returns all the pending orders from the database

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const revalidate = 3600

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        orderItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(orders, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=120",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching pending orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch pending orders" },
      { status: 500 }
    )
  }
}
