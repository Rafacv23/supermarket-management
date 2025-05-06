"use client"

import { useOrderDetails } from "@/lib/queries/orders"
import { ClipboardList } from "lucide-react"
import { use } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { OrderItem } from "@prisma/client"
import Container from "@/components/Container"
import completeOrder from "@/lib/actions/completeOrder"
import Loading from "@/components/Loading"

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

export default function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = use(params)
  const { data: order, isLoading, isError } = useOrderDetails(orderId)

  const form = useForm<z.infer<typeof FormSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(FormSchema as any),
    defaultValues: {
      items: ["recents", "home"],
    },
  })

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return (
      <Container>
        <p>Error al cargar el pedido</p>
      </Container>
    )
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await completeOrder(orderId)
      console.log("Completing order with items:", data.items)
      toast.success("Pedido completado correctamente")
    } catch (error) {
      console.error("Error al completar el pedido:", error)
      toast.error("Error al completar el pedido")
      return
    }
  }

  return (
    <Container>
      <h1 className="text-2xl font-bold">Pedido #{orderId}</h1>
      <p>Detalles del pedido: {order.createdAt}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Productos</FormLabel>
                  <FormDescription>
                    Marca los productos a medida que los vayas subiendo en el
                    montacargas.
                  </FormDescription>
                </div>
                {order.orderItems.map((item: OrderItem) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-lg font-normal">
                            {item.product.name}
                            <span className="text-sm text-muted-foreground">
                              Cantidad: {item.quantity}uds
                            </span>
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            <ClipboardList /> Pedido Completado
          </Button>
        </form>
      </Form>
    </Container>
  )
}
