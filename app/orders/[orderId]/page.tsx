"use client"

import { useOrderDetails } from "@/lib/queries/orders"
import { Boxes, ClipboardList } from "lucide-react"
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
    return (
      <Container>
        <Loading />
      </Container>
    )
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
      <header className="flex items-start flex-col gap-4">
        <h1 className="text-2xl font-bold ">Pedido</h1>
        <p>
          Fecha del pedido:
          {order?.createdAt.toString()}
        </p>
      </header>
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
                {order?.orderItems.map((item) => (
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
                          <FormLabel
                            className={
                              field.value?.includes(item.id)
                                ? "line-through text-lg font-normal flex items-center gap-4"
                                : "text-lg font-normal flex items-center gap-4"
                            }
                          >
                            <p>{item.product.name}</p>
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                              <Boxes size={16} /> Cantidad: {item.quantity} uds
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            <ClipboardList /> Pedido Completado
          </Button>
        </form>
      </Form>
    </Container>
  )
}
