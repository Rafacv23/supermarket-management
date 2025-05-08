import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Order } from "@prisma/client"

interface OrdersProps {
  pendingOrders?: Order[]
}

export default function Orders({ pendingOrders = [] }: OrdersProps) {
  const hasOrders = pendingOrders.length > 0

  return (
    <div className="w-full">
      {hasOrders ? (
        <>
          <h2 className="text-lg font-bold mt-4">Pedidos pendientes</h2>
          <ul className="mt-2 grid grid-cols-1 gap-4">
            {pendingOrders.map((order) => (
              <li key={order.id}>
                <OrderCard order={order} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4">No hay pedidos pendientes</p>
      )}
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.createdAt)
  const formattedDate = `${date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })} - ${date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })}`

  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="hover:bg-secondary hover:transition-colors ease-in-out">
        <CardHeader>
          <CardTitle>Pedido: {order.id}</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent>Estado: PENDIENTE</CardContent>
      </Card>
    </Link>
  )
}
