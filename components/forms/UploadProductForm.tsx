"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { useOrderStore } from "@/store/orderStore"
import BarcodeScanner from "react-qr-barcode-scanner"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash, Save, UploadCloud, Camera, ArrowUp, Boxes } from "lucide-react"
import uploadProductAndCreateOrder from "@/lib/actions/createOrder"
import { getProductByBarcode } from "@/lib/queries/products"

interface Props {
  barcode?: string
}

const formSchema = z.object({
  barcode: z.string().min(2, "Código inválido"),
  stock: z.coerce.number().min(1, "El stock debe ser al menos 1"),
})

export default function UploadProductForm({ barcode }: Props) {
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState<boolean>(false)
  const { order, addProduct, removeProduct, clearOrder } = useOrderStore()

  const form = useForm<z.infer<typeof formSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      barcode: barcode || "",
      stock: 1,
    },
  })

  async function handleAdd(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const product = await getProductByBarcode(values.barcode)
      addProduct({ ...values, name: product.name, currentStock: product.stock })
      console.log("Fetched product:", product)
      toast.success("Producto añadido")
    } catch (err) {
      console.error("Error fetching product:", err)
      toast.error("No se pudo encontrar el producto.")
    } finally {
      setLoading(false)
      form.reset()
    }
  }

  // Add product to list
  function handleScan(result: string) {
    if (result) {
      form.setValue("barcode", result)
      setScanning(false)
    }
  }

  async function handleUpload() {
    setLoading(true)
    try {
      await uploadProductAndCreateOrder({
        employeeId: "admin",
        products: order,
      })
      toast.success("Productos enviados correctamente")
      clearOrder()
    } catch {
      toast.error("Error al enviar productos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAdd)}
          className="space-y-4 p-4 border rounded-md"
        >
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de barras</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      type="text"
                      disabled={loading}
                      placeholder="Código de barras"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant={scanning ? "destructive" : "default"}
                    onClick={() => setScanning(!scanning)}
                    disabled={loading}
                    className="gap-1"
                  >
                    <Camera className="w-4 h-4" />
                    {scanning ? "Cerrar cámara" : "Escanear"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {scanning && (
            <div className="mt-4" aria-disabled={loading}>
              <BarcodeScanner
                width={400}
                height={400}
                onUpdate={(err, result) => {
                  if (result) handleScan(result.getText())
                }}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="number"
                    placeholder="Cantidad a subir"
                    min={1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <footer className="flex gap-4 pt-4 justify-end">
            <Button type="reset" variant="outline" disabled={loading}>
              <Trash />
              Borrar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Añadir
            </Button>
          </footer>
        </form>
      </Form>
      {order.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold">Productos añadidos:</h3>
          <ul className="space-y-2">
            {order.map((product) => (
              <li
                key={product.barcode}
                className="flex justify-between items-center border p-2 rounded"
              >
                <h4 className="font-bold">{product.name}</h4>
                <p className="flex items-center gap-2">
                  <Boxes size={16} /> Almacen {product.currentStock} uds
                </p>
                <span className="flex items-center gap-2">
                  <ArrowUp size={16} /> Subir {product.stock} uds
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeProduct(product.barcode)}
                  disabled={loading}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={clearOrder} disabled={loading}>
              <Trash className="w-4 h-4 mr-1" />
              Vaciar lista
            </Button>

            <Button onClick={handleUpload} disabled={loading}>
              <UploadCloud className="w-4 h-4 mr-1" />
              Confirmar y guardar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
