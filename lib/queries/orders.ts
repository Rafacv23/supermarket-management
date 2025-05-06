import { Order, OrderItem, Product } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

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
