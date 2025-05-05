"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import BarcodeScanner from "react-qr-barcode-scanner"
import receiveProduct from "@/lib/actions/receiveProduct"

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
import { Camera, Save, Trash } from "lucide-react"
import ProductCard from "@/components/ProductCard"

interface ReceiveProductFormProps {
  barcode?: string
}

// Esquema de validación
const formSchema = z.object({
  barcode: z.string().min(2, {
    message: "El código de barras debe tener al menos 2 caracteres.",
  }),
  stock: z
    .union([
      z.coerce
        .number()
        .min(0, { message: "El stock debe ser mayor o igual que 0." }),
      z.literal("").transform(() => undefined),
    ])
    .transform((val) => (typeof val === "number" ? val : undefined)),
})

export default function ReceiveProductForm({
  barcode,
}: ReceiveProductFormProps) {
  const [scanning, setScanning] = useState<boolean>(false)
  const [productsList, setProductsList] = useState<any[]>([]) // Track products being added

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: barcode || "",
      stock: undefined,
    },
  })

  // Add product to list
  function handleScan(result: string) {
    if (result) {
      form.setValue("barcode", result)
      setScanning(false)
    }
  }

  function handleAddProduct(values: z.infer<typeof formSchema>) {
    const newProduct = {
      barcode: values.barcode,
      stock: values.stock,
    }
    setProductsList((prevList) => [...prevList, newProduct]) // Add to list
    form.reset() // Reset form for next product
  }

  // Confirm and save products
  async function onConfirm() {
    try {
      await receiveProduct({ products: productsList })
      toast.success("Productos actualizados correctamente")
      setProductsList([]) // Clear the product list after confirmation
    } catch (error) {
      toast.error("Error actualizando productos")
      console.error("Error saving products:", error)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddProduct)}
          className="space-y-6 p-4"
        >
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de barras</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input type="text" placeholder="1234567890123" {...field} />
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
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Cantidad en almacén"
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
              <Save /> Agregar producto
            </Button>
          </footer>
        </form>
      </Form>

      {/* Product list preview */}
      {productsList.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Productos agregados</h3>
          <ul className="space-y-2 mt-2">
            {productsList.map((product) => (
              <li key={product.barcode} className="border p-2 rounded-md">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confirm button */}
      {productsList.length > 0 && (
        <footer className="flex gap-4 pt-4 justify-end">
          <Button type="button" variant="default" onClick={onConfirm}>
            Confirmar recepción de productos
          </Button>
        </footer>
      )}
    </div>
  )
}
