import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Category } from "@prisma/client"

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  const rawCategory = params.category
  const category = rawCategory.toUpperCase() as Category // or validate safely

  const { searchParams } = req.nextUrl
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10
  const skip = Math.max((page - 1) * limit, 0)

  if (!Object.values(Category).includes(category)) {
    return new Response("Invalid category", { status: 400 })
  }

  const products = await prisma.product.findMany({
    where: { category },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  })

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=1200, stale-while-revalidate=120",
    },
  })
}
