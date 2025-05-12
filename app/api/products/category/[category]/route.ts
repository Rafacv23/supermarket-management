import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Category } from "@prisma/client"

export async function GET(
  req: NextRequest,
  { params }: { params: { category: Category } }
) {
  const { category } = params
  const { searchParams } = req.nextUrl

  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10

  const skip = Math.max((page - 1) * limit, 0)

  if (!category) {
    return new Response("Category is required", { status: 400 })
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
      "Cache-Control": "public, max-age=1200, stale-while-revalidate=120", // caché
    },
  })
}
