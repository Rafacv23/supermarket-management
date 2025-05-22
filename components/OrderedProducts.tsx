"use client"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Boxes, ClipboardList } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import completeOrder from "@/lib/actions/completeOrder"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

type OrderItems = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    barcode: string
    price: number
  }
}

type Props = {
  orderId: string
  products: OrderItems[]
}

export default function OrderedProducts({ orderId, products }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(FormSchema as any),
    defaultValues: {
      items: ["recents", "home"],
    },
  })
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true)
      await completeOrder(orderId)
      console.log("Completing order with items:", data.items)
      toast.success("Pedido completado correctamente")
      router.push("/")
    } catch (error) {
      console.error("Error al completar el pedido:", error)
      toast.error("Error al completar el pedido")
      return
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
              {products.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem key={item.id}>
                        <label
                          htmlFor={item.id}
                          className={`flex items-center mb-2 gap-4 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border
      ${
        field.value?.includes(item.id)
          ? "bg-primary/10 border-primary"
          : "bg-secondary"
      }
    `}
                        >
                          <FormControl>
                            <Checkbox
                              id={item.id}
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
                              className="sr-only" // 👈 hides the default checkbox, but keeps it accessible
                            />
                          </FormControl>

                          <div className="flex flex-col w-full">
                            <FormLabel
                              className={`text-lg font-semibold capitalize mb-1 transition-colors duration-200 ${
                                field.value?.includes(item.id)
                                  ? "line-through text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {item.product.name}
                            </FormLabel>
                            <div className="text-sm text-muted-foreground flex items-center gap-3">
                              <Boxes size={16} className="text-primary" />
                              <span>Cantidad: {item.quantity} uds</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Código de barras: {item.product.barcode}
                            </div>
                          </div>
                        </label>
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
  )
}
