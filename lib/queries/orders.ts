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

// Define the missing type
type OrderItemWithProduct = OrderItem & {
  product: Product
}

export function useOrderDetails(orderId: string) {
  return useQuery<OrderDetails>({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}`)
      if (!res.ok) throw new Error("Failed to fetch order")
      const order = await res.json()
      return {
        ...order,
        orderItems: order.orderItems.map((item: OrderItemWithProduct) => ({
          ...item,
          product: item.product,
        })),
      } as OrderDetails
    },
    enabled: !!orderId,
  })
}

export async function getOrderDetails(
  orderId: string
): Promise<OrderDetails | null> {
  try {
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

    return order
  } catch (error) {
    console.error("Error fetching order details:", error)
    return null
  }
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
