import Container from "@/components/Container"
import Loading from "@/components/Loading"
import OrderedProducts from "@/components/OrderedProducts"
import { getOrderDetails } from "@/lib/queries/orders"
import { Suspense } from "react"

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  const order = await getOrderDetails(orderId)

  return (
    <Container>
      <header className="flex items-start flex-col gap-4">
        <h1 className="text-2xl font-bold ">Pedido</h1>
        <p>
          Fecha del pedido:
          {order?.createdAt.toString()}
        </p>
      </header>

      <Suspense fallback={<Loading />}>
        <OrderedProducts
          orderId={orderId}
          products={
            order?.orderItems
              ? order.orderItems.map((item) => ({
                  ...item,
                  product: {
                    ...item.product,
                    price: item.product.price ?? 0,
                  },
                }))
              : []
          }
        />
      </Suspense>
    </Container>
  )
}
