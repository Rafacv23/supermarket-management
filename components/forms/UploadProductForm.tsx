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
import { Save, Camera, Loader, RotateCcw } from "lucide-react"
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
  const { addProduct } = useOrderStore()

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
      const rawBarcode = values.barcode

      // Format values
      const formattedBarcode = rawBarcode.replace(/^;/, "")

      const product = await getProductByBarcode(formattedBarcode)
      addProduct({ ...values, name: product.name })
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

  return (
    <div className="space-y-6 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4 p-4">
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
            <Button
              type="reset"
              onClick={() => form.reset()}
              variant="outline"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RotateCcw size={16} />
                  Cancelar
                </span>
              )}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save size={16} />
                  Añadir
                </span>
              )}
            </Button>
          </footer>
        </form>
      </Form>
    </div>
  )
}
