"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import BarcodeScanner from "react-qr-barcode-scanner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import { Camera } from "lucide-react"

import { Category } from "@prisma/client"

// Esquema de validación
const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre del producto debe tener 2 caracteres como mínimo.",
  }),
  category: z.nativeEnum(Category, {
    errorMap: () => ({ message: "Debes seleccionar una categoría válida." }),
  }),
  barcode: z.string().min(2, {
    message: "El código de barras debe tener al menos 2 caracteres.",
  }),
  price: z
    .union([
      z.coerce.number().min(0.01),
      z.literal("").transform(() => undefined),
    ])
    .optional()
    .transform((val) => (typeof val === "number" ? val : undefined)),
  stock: z
    .union([z.coerce.number().min(0), z.literal("").transform(() => undefined)])
    .optional()
    .transform((val) => (typeof val === "number" ? val : undefined)),
})

export default function NewProductForm() {
  const [scanning, setScanning] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: undefined,
      barcode: "",
      price: undefined,
      stock: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    //TODO : añadir toast para confirmar que se ha enviado el formulario
    //TODO: crear action con use server para guardar producto en db
  }

  function handleScan(result: string) {
    if (result) {
      form.setValue("barcode", result)
      setScanning(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nombre del producto"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoría del producto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Category).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio (Opcional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Precio en €" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock (Opcional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
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
            Borrar
          </Button>
          <Button type="submit">Guardar</Button>
        </footer>
      </form>
    </Form>
  )
}
