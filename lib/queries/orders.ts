import { Order, OrderItem, Product } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { prisma } from "../prisma"

export function usePendingOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders", "pending"],
    queryFn: async () => {
      const res = await fetch(`/api/orders/pending`)
      if (!res.ok) throw new Error("Failed to fetch products")
      return res.json()
    },
    enabled: true,
  })
}

type OrderDetails = Order & {
  orderItems: (OrderItem & {
    product: Product
  })[]
}

export function useOrderDetails(orderId: string) {
  return useQuery<OrderDetails>({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}`)
      if (!res.ok) throw new Error("Failed to fetch order")
      return res.json() as Promise<Order>
    },
    enabled: !!orderId,
  })
}

export async function getPendingOrders(): Promise<Order[] | null> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: "PENDING",
      },
    })

    return orders
  } catch (error) {
    console.error("Error fetching pending orders:", error)
    return null
  }
}
