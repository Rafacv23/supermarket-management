"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { useOrderStore } from "@/store/orderStore"
import uploadProduct from "@/lib/actions/uploadProduct"
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
import { Trash, Save, UploadCloud, Camera } from "lucide-react"

const formSchema = z.object({
  barcode: z.string().min(2, "Código inválido"),
  stock: z.coerce.number().min(1, "El stock debe ser al menos 1"),
})

export default function UploadProductForm() {
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState<boolean>(false)
  const { order, addProduct, removeProduct, clearOrder } = useOrderStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: "",
      stock: 1,
    },
  })

  function handleAdd(values: z.infer<typeof formSchema>) {
    addProduct(values)
    toast.success("Producto añadido")
    form.reset()
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
      await uploadProduct({ products: order })
      toast.success("Productos enviados correctamente")
      clearOrder()
    } catch {
      toast.error("Error al enviar productos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
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
                      placeholder="Código de barras"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant={scanning ? "destructive" : "default"}
                    onClick={() => setScanning(!scanning)}
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
            <div className="mt-4">
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
            <Button type="reset" variant="outline">
              <Trash />
              Borrar
            </Button>
            <Button type="submit">
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
                <span>
                  {product.barcode} — {product.stock} uds
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeProduct(product.barcode)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={clearOrder}>
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
