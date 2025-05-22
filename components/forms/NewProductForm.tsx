import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Scanner from "@/components/Scanner"
import createProduct from "@/lib/actions/createProduct"
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
import { toast } from "sonner"
import { useScanner } from "@/hooks/useScanner"
import { Camera, Save, Trash } from "lucide-react"
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
})

interface Props {
  barcode?: string
}

export default function NewProductForm({ barcode }: Props) {
  const { scanning, setScanning, handleScan: baseHandleScan } = useScanner()

  function handleScan(barcode: string) {
    form.setValue("barcode", barcode)
    form.trigger("barcode")
    baseHandleScan(barcode)
    setScanning(false)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: "",
      category: undefined,
      barcode: barcode || "",
    },
  })

  async function ClientAction(formData: FormData) {
    try {
      const rawName = formData.get("name") as string
      const rawCategory = form.getValues("category") // because category is not part of native FormData
      const rawBarcode = formData.get("barcode") as string

      // Format values
      const formattedName = rawName.toLowerCase()
      const formattedBarcode = rawBarcode.replace(/^;/, "")

      if (!rawCategory) {
        toast.error("Debes seleccionar una categoría.")
        return
      }
      // activate this to debug
      // console.log("Formatted Name:", formattedName)
      // console.log("Formatted Category:", rawCategory)
      // console.log("Formatted Barcode:", formattedBarcode)
      await createProduct({
        name: formattedName,
        category: rawCategory,
        barcode: formattedBarcode,
      })
      toast.success("Producto creado correctamente")
      form.reset()
    } catch (error) {
      toast.error("Error creando el producto")
      console.error("Error saving product:", error)
    }
  }

  return (
    <Form {...form}>
      <form action={ClientAction} className="space-y-6 p-4">
        <div className="flex items-end justify-between">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    className="h-12 text-base"
                    type="text"
                    required
                    placeholder="Nombre del producto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("name") && (
            <Button
              onClick={() => form.resetField("name")}
              variant="outline"
              className="h-12 text-base"
            >
              <Trash size={16} />
              Borrar
            </Button>
          )}
        </div>

        <div className="flex items-end justify-between">
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de barras</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      className="h-12 text-base"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      placeholder="Código de barras"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant={scanning ? "destructive" : "default"}
                    onClick={() => setScanning(!scanning)}
                    className="h-12 px-4 gap-2 text-base"
                  >
                    <Camera className="w-4 h-4" />
                    {scanning ? "Cerrar cámara" : "Escanear"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("barcode") && (
            <Button
              onClick={() => form.resetField("barcode")}
              variant="outline"
              className="h-12 text-base ml-2"
            >
              <Trash size={16} />
              Borrar
            </Button>
          )}
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Categoría del producto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Category).map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="h-12 text-base"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {scanning && <Scanner onDetected={handleScan} />}

        <footer className="flex gap-4 pt-4 justify-end">
          <Button type="reset" variant="outline" className="h-12 text-base">
            <Trash />
            Borrar
          </Button>
          <Button type="submit" className="h-12 text-base">
            <Save /> Guardar
          </Button>
        </footer>
      </form>
    </Form>
  )
}
