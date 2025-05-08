"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import BarcodeScanner from "react-qr-barcode-scanner"
import receiveProduct from "@/lib/actions/receiveProduct"
import { useReceiveStore } from "@/store/receiveStore"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  ArrowDown,
  Boxes,
  Camera,
  Loader,
  Save,
  Trash,
  UploadCloud,
} from "lucide-react"
import { getProductByBarcode } from "@/lib/queries/products"

interface Props {
  barcode?: string
}

// Esquema de validación
const formSchema = z.object({
  barcode: z.string().min(2, {
    message: "El código de barras debe tener al menos 2 caracteres.",
  }),
  stock: z.coerce.number().min(1, "El stock debe ser al menos 1"),
})

export default function ReceiveProductForm({ barcode }: Props) {
  const [scanning, setScanning] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const { receivedProducts, addProduct, removeProduct, clearOrder } =
    useReceiveStore()

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
    } catch (error) {
      console.error("Error fetching product:", error)
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

  // Confirm and save products
  async function handleUpload() {
    try {
      await receiveProduct({ products: receivedProducts })
      toast.success("Productos actualizados correctamente")
      clearOrder() // Clear the product list after confirmation
    } catch (error) {
      toast.error("Error actualizando productos")
      console.error("Error saving products:", error)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-6 p-4">
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
                      disabled={loading}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant={scanning ? "destructive" : "default"}
                    onClick={() => setScanning(!scanning)}
                    className="gap-1"
                    disabled={loading}
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
                    min={0}
                    placeholder="Cantidad recibida"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <footer className="flex gap-4 pt-4 justify-end">
            <Button type="reset" variant="outline" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash size={16} />
                  Eliminar
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

      {receivedProducts.length > 0 && (
        <div className="space-y-4 p-4">
          <h3 className="font-bold">Productos añadidos:</h3>
          <ul className="space-y-2">
            {receivedProducts.map((product) => (
              <li
                key={product.barcode}
                className="flex flex-col items-start border p-2 rounded"
              >
                <header className="flex justify-between items-center w-full mb-4">
                  <h4 className="font-bold">{product.name}</h4>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loading}
                    onClick={() => removeProduct(product.barcode)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </header>
                <div>
                  <p className="flex items-center gap-2">
                    <Boxes size={16} /> Almacen {product.currentStock} uds
                  </p>
                  <span className="flex items-center gap-2">
                    <ArrowDown size={16} /> Bajar {product.stock} uds
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={clearOrder} disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash size={16} />
                  Vaciar lista
                </span>
              )}
            </Button>

            <Button onClick={handleUpload} disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UploadCloud size={16} />
                  Confirmar y guardar
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
