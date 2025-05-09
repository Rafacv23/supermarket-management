import { prisma } from "@/lib/prisma"
import { type NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params

  if (!barcode) {
    return new Response("Barcode is required", { status: 400 })
  }

  const product = await prisma.product.findUnique({
    where: { barcode },
  })

  if (!product) {
    return new Response("Product not found", { status: 404 })
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "3600",
    },
  })
}
